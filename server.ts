import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import {
  personalInfo,
  portfolioApps,
  experiences,
  skillCategories,
  patents,
  books,
  certifications,
  education,
  speakerEvents,
  endorsements
} from "./src/data/resumeData";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  published: boolean;
}

let firebaseConfig: any = null;
try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  } else if (process.env.FIREBASE_CONFIG) {
    firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
  }
} catch (err) {
  console.error("Error reading firebase-applet-config.json:", err);
}

// Initialize Firestore with Admin SDK
let dbPrimary: any = null;
let dbDefault: any = null;
let useDefaultDatabase = false;
let firestoreAvailable: boolean | null = null; // null = untested, true = working, false = unavailable

const projectId = firebaseConfig?.projectId || process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT;
const customDatabaseId = firebaseConfig?.firestoreDatabaseId || process.env.FIREBASE_DATABASE_ID || process.env.FIRESTORE_DATABASE_ID;

if (projectId) {
  try {
    const adminApp = getApps().length === 0
      ? initializeApp({ projectId })
      : getApps()[0];

    if (customDatabaseId && customDatabaseId !== "(default)") {
      dbPrimary = getFirestore(adminApp, customDatabaseId);
    }
    dbDefault = getFirestore(adminApp, "(default)");
    console.log(`Firebase Admin initialized for project: ${projectId}`);
  } catch (err) {
    console.warn("Failed to initialize Firebase Admin on backend:", err);
  }
}

function getActiveDb() {
  if (firestoreAvailable === false) return null;
  if (useDefaultDatabase) return dbDefault;
  return dbPrimary || dbDefault;
}

async function isAdminAuthenticated(req: any): Promise<boolean> {
  // Check administrative passcode in headers, query, or body
  const passcode = req.headers["x-admin-passcode"] || req.query.passcode || (req.body && req.body.passcode);
  if (passcode && passcode.toString().toLowerCase() === "minnie") {
    return true;
  }

  // Check Google Firebase ID Token in Authorization header or x-admin-id-token
  const authHeader = req.headers["authorization"] || req.headers["x-admin-id-token"];
  let idToken = "";
  if (authHeader) {
    if (authHeader.startsWith("Bearer ")) {
      idToken = authHeader.substring(7);
    } else {
      idToken = authHeader;
    }
  }

  if (idToken) {
    try {
      const firebaseApiKey = firebaseConfig?.apiKey || process.env.FIREBASE_API_KEY || "AIzaSyCDIPQXWmDq81U8BrjbCy8hTDphG_Y45Xc";
      const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseApiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      });
      if (response.ok) {
        const data = await response.json();
        const email = data.users?.[0]?.email;
        if (email === "minnie.ott@gmail.com") {
          return true;
        }
      }
    } catch (error) {
      console.error("Error verifying Firebase ID Token:", error);
    }
  }

  return false;
}


// Paths to the posts JSON
const postsFilePath = path.join(process.cwd(), "src", "data", "posts.json");
const deletedPostsFilePath = path.join(process.cwd(), "src", "data", "deleted_posts.json");

interface DeletedPostEntry {
  id: string;
  slug?: string;
  deletedAt: string;
}

function readDeletedPostsFromFile(): DeletedPostEntry[] {
  try {
    if (fs.existsSync(deletedPostsFilePath)) {
      const data = fs.readFileSync(deletedPostsFilePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading deleted_posts.json:", error);
  }
  return [];
}

function writeDeletedPostToFile(id: string, slug?: string): boolean {
  try {
    const list = readDeletedPostsFromFile();
    if (!list.some(item => item.id === id || (slug && item.slug === slug))) {
      list.push({ id, slug, deletedAt: new Date().toISOString() });
      const dir = path.dirname(deletedPostsFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(deletedPostsFilePath, JSON.stringify(list, null, 2), "utf-8");
    }
    return true;
  } catch (error) {
    console.error("Error writing deleted_posts.json:", error);
    return false;
  }
}

// Helper function to slugify titles
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Helper to read posts from JSON file safely
function readPostsFromFile(): BlogPost[] {
  try {
    if (fs.existsSync(postsFilePath)) {
      const data = fs.readFileSync(postsFilePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading posts.json, returning empty list:", error);
  }
  return [];
}

// Helper to write posts to JSON file safely
function writePostsToFile(posts: BlogPost[]): boolean {
  try {
    const dir = path.dirname(postsFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing to posts.json:", error);
    return false;
  }
}

// Helper functions to interact with Firestore with automatic database fallback and retry
async function savePostToFirestore(post: BlogPost): Promise<boolean> {
  if (firestoreAvailable === false) return false;

  const dbsToTry = [];
  if (!useDefaultDatabase && dbPrimary) dbsToTry.push(dbPrimary);
  if (dbDefault && !dbsToTry.includes(dbDefault)) dbsToTry.push(dbDefault);

  for (const db of dbsToTry) {
    try {
      await db.collection("posts").doc(post.id).set(post);
      if (db === dbDefault && dbPrimary && !useDefaultDatabase) {
        useDefaultDatabase = true;
      }
      firestoreAvailable = true;
      return true;
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      if (errMsg.includes("NOT_FOUND") || err?.code === 5) {
        if (db === dbPrimary) dbPrimary = null;
      }
    }
  }
  firestoreAvailable = false;
  return false;
}

async function deletePostFromFirestore(id: string, slug?: string): Promise<boolean> {
  // Always record deletion locally
  writeDeletedPostToFile(id, slug);

  if (firestoreAvailable === false) return false;

  const dbsToTry = [];
  if (!useDefaultDatabase && dbPrimary) dbsToTry.push(dbPrimary);
  if (dbDefault && !dbsToTry.includes(dbDefault)) dbsToTry.push(dbDefault);

  for (const db of dbsToTry) {
    try {
      await db.collection("posts").doc(id).delete();
      try {
        await db.collection("deleted_posts").doc(id).set({
          id,
          slug: slug || "",
          deletedAt: new Date().toISOString()
        });
      } catch (e) {
        // secondary deletion tracking save
      }
      if (db === dbDefault && dbPrimary && !useDefaultDatabase) {
        useDefaultDatabase = true;
      }
      firestoreAvailable = true;
      return true;
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      if (errMsg.includes("NOT_FOUND") || err?.code === 5) {
        if (db === dbPrimary) dbPrimary = null;
      }
    }
  }
  firestoreAvailable = false;
  return false;
}

// Helper to get posts from Firestore with automatic fallback and local file sync
async function getPostsFromFirestore(): Promise<BlogPost[]> {
  const localDeleted = readDeletedPostsFromFile();
  const deletedIds = new Set<string>(localDeleted.map(d => d.id));
  const deletedSlugs = new Set<string>(localDeleted.filter(d => d.slug).map(d => d.slug!));

  if (firestoreAvailable === false) {
    return readPostsFromFile().filter(p => !deletedIds.has(p.id) && (!p.slug || !deletedSlugs.has(p.slug)));
  }

  const dbsToTry = [];
  if (!useDefaultDatabase && dbPrimary) dbsToTry.push(dbPrimary);
  if (dbDefault && !dbsToTry.includes(dbDefault)) dbsToTry.push(dbDefault);

  for (const db of dbsToTry) {
    try {
      const postsCol = db.collection("posts");
      const snapshot = await postsCol.get();
      if (db === dbDefault && dbPrimary && !useDefaultDatabase) {
        useDefaultDatabase = true;
      }
      firestoreAvailable = true;

      // Read deleted_posts from Firestore
      try {
        const deletedSnapshot = await db.collection("deleted_posts").get();
        if (deletedSnapshot && !deletedSnapshot.empty) {
          deletedSnapshot.forEach((doc: any) => {
            const data = doc.data();
            if (data.id) deletedIds.add(data.id);
            if (data.slug) deletedSlugs.add(data.slug);
            if (data.id) writeDeletedPostToFile(data.id, data.slug);
          });
        }
      } catch (delErr) {
        // Ignore if deleted_posts collection is not initialized
      }

      const rawPosts: BlogPost[] = [];
      if (snapshot && !snapshot.empty) {
        snapshot.forEach((doc: any) => {
          rawPosts.push(doc.data() as BlogPost);
        });
      }

      // Filter out posts that were marked deleted
      const posts = rawPosts.filter(p => !deletedIds.has(p.id) && (!p.slug || !deletedSlugs.has(p.slug)));

      // Merge any local posts from posts.json that aren't in Firestore yet AND aren't deleted
      const localPosts = readPostsFromFile();
      for (const localP of localPosts) {
        const isDeleted = deletedIds.has(localP.id) || (localP.slug && deletedSlugs.has(localP.slug));
        const isAlreadyInPosts = posts.some(p => p.id === localP.id || p.slug === localP.slug);

        if (!isDeleted && !isAlreadyInPosts) {
          posts.push(localP);
          try {
            await db.collection("posts").doc(localP.id).set(localP);
          } catch (e) {
            // silent catch
          }
        }
      }

      posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      writePostsToFile(posts);
      return posts;
    } catch (error: any) {
      const errMsg = error?.message || String(error);
      if (errMsg.includes("NOT_FOUND") || error?.code === 5) {
        if (db === dbPrimary) dbPrimary = null;
      }
    }
  }

  firestoreAvailable = false;
  const filePosts = readPostsFromFile().filter(p => !deletedIds.has(p.id) && (!p.slug || !deletedSlugs.has(p.slug)));
  return filePosts;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Crucial: body parser for post requests
  app.use(express.json());

  // API routes FIRST
  app.post("/api/subscribe", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      console.log(`[Newsletter Subscription] Joined: ${email}`);

      // Send email to Minnie (minnie.ott@gmail.com) asking to subscribe to the newsletter
      const apiKey = process.env.RESEND_API_KEY;
      const subject = "New Newsletter Subscription Request";
      const name = "Newsletter Subscriber";
      const message = `Please add me to the newsletter: ${email}`;

      if (!apiKey) {
        console.log("No RESEND_API_KEY set. Simulating subscription email dispatch.");
      } else {
        try {
          const emailResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              from: "minnieott.com <onboarding@resend.dev>",
              to: ["minnie.ott@gmail.com"],
              reply_to: email,
              subject: subject,
              html: `
                <h3>New Portfolio Message (Newsletter Subscription)</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <div style="white-space: pre-wrap; font-family: sans-serif; background: #f9f9f9; padding: 12px; border-left: 4px solid #E4F0E7;">${message}</div>
              `
            })
          });

          if (!emailResponse.ok) {
            const errorData = await emailResponse.json();
            console.error("Resend API error sending subscription notice:", errorData);
          } else {
            const responseData = await emailResponse.json();
            console.log("Subscription email sent successfully via Resend:", responseData);
          }
        } catch (emailErr) {
          console.error("Failed to send subscription email:", emailErr);
        }
      }

      return res.json({ success: true, message: "Successfully subscribed to the newsletter!" });
    } catch (error: any) {
      console.error("Error in /api/subscribe endpoint:", error);
      return res.status(500).json({ error: "Internal server error", details: error.message });
    }
  });

  app.post("/api/send-email", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ error: "Missing required fields (name, email, message)" });
      }

      console.log(`[Email Request Received] From: ${name} <${email}> | Subject: ${subject}`);
      console.log(`Message Content:\n${message}`);

      const apiKey = process.env.RESEND_API_KEY;

      if (!apiKey) {
        // Safe fallback simulation mode when key is absent
        console.log("No RESEND_API_KEY set. Simulating successful email dispatch.");
        return res.json({
          success: true,
          status: "simulated",
          message: "Email simulated successfully (logged to server console). Configure RESEND_API_KEY in the Secrets panel to send actual emails."
        });
      }

      // Real integration using Resend API
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "minnieott.com <onboarding@resend.dev>",
          to: ["minnie.ott@gmail.com"],
          reply_to: email,
          subject: subject || `Portfolio Message from ${name}`,
          html: `
            <h3>New Portfolio Message</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
            <p><strong>Message:</strong></p>
            <div style="white-space: pre-wrap; font-family: sans-serif; background: #f9f9f9; padding: 12px; border-left: 4px solid #E4F0E7;">${message}</div>
          `
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Resend API error response:", errorData);
        return res.status(500).json({
          error: "Failed to send email via Resend API",
          details: errorData
        });
      }

      const responseData = await response.json();
      console.log("Email sent successfully via Resend:", responseData);

      return res.json({
        success: true,
        status: "sent",
        data: responseData
      });
    } catch (error: any) {
      console.error("Error in /api/send-email endpoint:", error);
      return res.status(500).json({ error: "Internal server error", details: error.message });
    }
  });

  // Lazy-loaded Gemini client initialization
  let mochiAiClient: any = null;
  function getMochiAi() {
    if (!mochiAiClient) {
      mochiAiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return mochiAiClient;
  }

  // Function to dynamically assemble Mochi's system instruction with the latest app content
  async function buildMochiSystemInstruction(): Promise<string> {
    let posts: BlogPost[] = [];
    try {
      posts = await getPostsFromFirestore();
    } catch (e) {
      console.warn("Could not fetch posts for Mochi instruction:", e);
      posts = readPostsFromFile();
    }

    const postsFormatted = posts.length > 0
      ? posts.map(p => `- Title: "${p.title}" (Category: ${p.category || 'General'}, Date: ${p.date || 'N/A'})\n  Excerpt: ${p.excerpt || ''}\n  Link: /blog/${p.slug || p.id}\n  Content Preview: ${(p.content || '').replace(/<[^>]*>/g, '').slice(0, 350)}...`).join('\n\n')
      : 'No blog posts published yet.';

    const appsFormatted = portfolioApps.map(app => 
      `- Name: ${app.name} (${app.url})\n  Role: ${app.role} | Status: ${app.status}\n  Description: ${app.description}\n  Key Accomplishments:\n${app.bulletPoints.map(b => `    * ${b}`).join('\n')}\n  Tech Stack: ${app.tags.join(', ')}`
    ).join('\n\n');

    const expFormatted = experiences.map(exp =>
      `- Role: ${exp.role} at ${exp.company} (${exp.period}, ${exp.type})\n  Description: ${exp.description}\n  Key Achievements:\n${exp.bullets.map(b => `    * ${b}`).join('\n')}\n  Skills: ${exp.skillsUsed.join(', ')}`
    ).join('\n\n');

    const eduFormatted = education.map(e =>
      `- ${e.school}: ${e.degree} (${e.honors.join(', ')})\n  Details: ${e.details}`
    ).join('\n');

    const certsFormatted = certifications.map(c => {
      if (c.links) {
        return `- ${c.title} (${c.issuer}): ${c.links.map(l => `${l.label} (${l.url})`).join(', ')}`;
      }
      return `- ${c.title} (${c.issuer}): ${c.link || ''}`;
    }).join('\n');

    const patentsFormatted = patents.map(p =>
      `- Title: "${p.title}" (${p.id})\n  Link: ${p.link}\n  Description: ${p.description}`
    ).join('\n');

    const speakersFormatted = speakerEvents.map(s =>
      `- Event: ${s.event}\n  Description: ${s.description}\n  Links: ${s.links.map(l => `${l.label} (${l.url})`).join(', ')}`
    ).join('\n');

    const endorsementsFormatted = endorsements.map(e =>
      `- ${e.author} (${e.role}, ${e.company}): "${e.quote}"`
    ).join('\n');

    return `You are Mochi, a warm, clever, and helpful AI chatbot agent who serves as Minnie's (Minerva Tanglao Ott) personal digital companion and portfolio guide. Your visual avatar is a cute, happy pancake character.
You can answer any questions about Minnie using her latest portfolio information, dynamic experience details, blog posts, education, certifications, patents, speaking engagements, and her publication "JMX Programming" (published by Wiley in 2002, authored by Mike Jasnowski, for which Minerva Tanglao Ott served as the Technical Editor).

IMPORTANT: You must keep all responses strictly aligned with her real, up-to-date experience and details provided below. Do not invent achievements. Speak in a friendly, warm, and highly professional tone, occasionally using subtle, adorable pancake/baking metaphors (like "flapping down information", "whipping up an answer", "sweet as maple syrup"), but prioritize clear, expert answers.

=== LATEST REAL-TIME KNOWLEDGE BASE (RE-TRAINED & UPDATED) ===

1. Personal Information & Overview:
   - Name: ${personalInfo.name}
   - Title: ${personalInfo.title}
   - Location: ${personalInfo.location}
   - Tagline: "${personalInfo.tagline}"
   - LinkedIn: ${personalInfo.linkedin}
   - Bio & Journey: ${personalInfo.about}
   - Company Lineage: ${personalInfo.companiesLineage.join(' -> ')}

2. Professional Experience & Leadership (Up-to-Date):
${expFormatted}

3. Portfolio Projects & Platforms (Up-to-Date):
${appsFormatted}

4. Latest Blog Posts (Live Updated):
${postsFormatted}

5. Education:
${eduFormatted}

6. Patents:
${patentsFormatted}

7. Book Publication (*JMX Programming*, John Wiley & Sons, 2002):
   - Title: ${books.title} (${books.link})
   - Role: ${books.role} (Author: ${books.author})
   - Description: ${books.description}
   - Technical Highlights: Java Management Extensions (JMX) architecture, Standard/Dynamic/Open/Model MBeans, MBeanServer registry, Protocol adaptors/connectors (RMI, HTTP/XML, SNMP), Event-driven notification model, application monitoring & connection pools.

8. Certifications:
${certsFormatted}

9. Speaking Engagements & Public Events:
${speakersFormatted}

10. Executive Endorsements:
${endorsementsFormatted}

11. Contact & Scheduling:
    - Google Appointment Calendar: Users can book a 1:1 meeting, consultation, or project advisory session with Minnie using this link: https://calendar.app.google/MCnhZcK56rLJ7fnk8
    - Secure Contact Form: Visitors can write a direct secure message on her Contact page.

Formatting & Guidelines:
- Structure your response beautifully with clear paragraphs, bullet points, markdown links, or bold key terms.
- Always be kind, warm, and helpful.
- If asked about something completely unrelated to Minnie or her work/blog/JMX, politely steer the conversation back to Minnie, saying something like, "While I'd love to chat about that, I am Mochi, Minnie's portfolio helper, so I'm happiest when we talk about Minnie's amazing technology journey!"
- If you don't know the answer, politely state: "Oh, my pancake memory doesn't have details on that! However, you can reach out directly to Minnie via her Contact page, and she'd love to tell you herself! 🥞"`;
  }

  // Dynamic simulated response generator using up-to-date app data
  async function generateSimulatedResponse(userQuery: string): Promise<string> {
    const query = userQuery.toLowerCase();
    let posts: BlogPost[] = [];
    try {
      posts = await getPostsFromFirestore();
    } catch (e) {
      posts = readPostsFromFile();
    }

    if (query.includes('blog') || query.includes('post') || query.includes('article') || query.includes('writing') || query.includes('thought')) {
      if (posts.length > 0) {
        const postList = posts.slice(0, 5).map(p => `* **[${p.title}](/blog/${p.slug || p.id})** (${p.category || 'Tech'}): ${p.excerpt}`).join('\n');
        return `Here are Minnie's latest published articles and insights! 📝\n\n${postList}\n\nYou can click on any title to read the full article! 🥞`;
      } else {
        return "Minnie writes articles on AI transformation, engineering leadership, and product strategy! Check out her Blog section on the website. 🥞";
      }
    }

    if (query.includes('creative blue') || query.includes('growthos') || query.includes('lead generator') || query.includes('brand booster') || query.includes('grex') || query.includes('just ride')) {
      const cbExp = experiences.find(e => e.company === 'Creative Blue');
      const bullets = cbExp ? cbExp.bullets.map(b => `* ${b}`).join('\n') : '';
      return `At **Creative Blue**, Minnie serves as Head of Technology! 🤖 Here are her latest achievements:\n\n${bullets}\n\nKey platforms include [GrowthOS](https://cb-growthos-hub-553545205591.us-west1.run.app/), [Lead Generator](https://creative-blue-lead-gen-1029286255981.us-west1.run.app/), [Brand Booster](https://creative-blue-brand-assessment-553545205591.us-west1.run.app/), [Grex](https://grex.world), and [Just Ride](https://just-ride.ai.studio)!`;
    }

    if (query.includes('google') || query.includes('maps') || query.includes('voice') || query.includes('tpm') || query.includes('service desk')) {
      const googleExp = experiences.find(e => e.company === 'Google');
      const topBullets = googleExp ? googleExp.bullets.slice(0, 6).map(b => `* ${b}`).join('\n') : '';
      return `At **Google** (Jun 2011 – Nov 2025), Minnie served as Senior Engineering Program Manager! 🗺️ Here are highlights of her leadership:\n\n${topBullets}\n\n...plus leading 20+ portfolio programs, establishing Stanford LEAD @ Google, and driving vendor infrastructure transformations!`;
    }

    if (query.includes('apple') || query.includes('job') || query.includes('recruiting')) {
      return `At **Apple** (Jun 2009 – Jun 2011), Minnie served as Technical Project Manager in IS&T! 🍏 She led the software development and launch of Apple HR recruiting systems, including the **Apple Job Search** user interface localized and deployed across 80+ countries!`;
    }

    if (query.includes('jmx') || query.includes('programming') || query.includes('book') || query.includes('publication') || query.includes('wiley')) {
      return `Minnie served as the **Technical Editor** for *JMX Programming* (Wiley, 2002) by Mike Jasnowski! 📘 She provided senior technical review and structural validation of core Java Management Extensions architecture (Standard, Dynamic, Model MBeans), MBeanServer registry, and protocol connectors (RMI, HTTP/XML, SNMP).`;
    }

    if (query.includes('stanford') || query.includes('lead') || query.includes('ateneo') || query.includes('education') || query.includes('degree') || query.includes('school')) {
      return `Minnie holds impressive academic credentials! 🎓\n\n* **Stanford Graduate School of Business**: Stanford LEAD (Distinguished Scholar & Community Advisory Board Member)\n* **Ateneo de Manila University**: BS Computer Science (Dean's List & Lourdes Evangelista Scholarship Award)`;
    }

    if (query.includes('patent') || query.includes('us20020064766') || query.includes('training system')) {
      return `Minnie is the lead inventor of **US Patent 20020064766**: *'Method and Apparatus for Managing Enterprise Employee Training Systems'*. 💡 It covers an automated enterprise training management system that performs skill gap analysis, course scheduling, and compliance tracking.`;
    }

    if (query.includes('speaker') || query.includes('speaking') || query.includes('talk') || query.includes('summit') || query.includes('filipino') || query.includes('ohlone')) {
      return `Minnie is an active tech speaker and student mentor! 🎤\n\n* **SF Bay Area Filipino American Professionals Networking Day** (Covered by Inquirer.net and Positively Filipino)\n* **Ohlone College STEM Summit**: Keynote guidance on bridging academia and industry in STEM.`;
    }

    if (query.includes('certificat') || query.includes('credential') || query.includes('badge') || query.includes('prince2') || query.includes('vanderbilt') || query.includes('mcp')) {
      return `Minnie's active certifications include:\n\n* **AI Agent Development & LLM Fluency (Model Context Protocol)** - Vanderbilt University\n* **Google AI (Professional Specialization & Essentials Badge)** - Google Cloud\n* **PRINCE2 Foundation Project Management** - Office of Government Commerce`;
    }

    return `Hi! I'm Mochi. 🥞 I'm Minnie's AI companion! Minnie is a **Technology Transformation Leader** with rich experience at Creative Blue, Google, Apple, and Sun Microsystems.\n\nYou can ask me about her AI agent platforms (GrowthOS, Lead Generator, Brand Booster), her 14-year Google Maps & GCP career, her *JMX Programming* technical editor role, US Patent 20020064766, or her latest published blog posts! What would you like to explore?`;
  }

  // POST: Chatbot agent Mochi endpoint
  app.post("/api/mochi", async (req, res) => {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      const lastUserMessage = messages[messages.length - 1]?.text || '';

      // Check for GEMINI_API_KEY presence
      if (!process.env.GEMINI_API_KEY) {
        console.log("No GEMINI_API_KEY configured. Running Mochi chatbot in dynamic simulated mode using latest content.");
        const simulatedText = await generateSimulatedResponse(lastUserMessage);
        
        return res.json({
          success: true,
          text: simulatedText,
          simulated: true
        });
      }

      // Format messages into GoogleGenAI standard structure
      const contents = messages.map((m: any) => ({
        role: m.role === "model" ? "model" : "user",
        parts: [{ text: m.text }]
      }));

      // Dynamically build Mochi system instruction using latest content
      const dynamicSystemInstruction = await buildMochiSystemInstruction();

      const ai = getMochiAi();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: dynamicSystemInstruction,
        }
      });

      return res.json({
        success: true,
        text: response.text,
        simulated: false
      });
    } catch (error: any) {
      console.error("Error in /api/mochi chatbot route:", error);
      return res.status(500).json({ error: "Internal server error", details: error.message });
    }
  });

  // Serving llms.txt dynamically to include latest blog posts for AI search engines
  app.get("/llms.txt", async (req, res) => {
    try {
      const publicPath = path.join(process.cwd(), "public", "llms.txt");
      let content = "";
      if (fs.existsSync(publicPath)) {
        content = fs.readFileSync(publicPath, "utf-8");
      } else {
        content = "# Minerva Tanglao Ott (Minnie) - Portfolio & LLM Map\n\n";
      }

      // Append dynamic blog posts for AI search engines!
      try {
        const posts = await getPostsFromFirestore();
        if (posts && posts.length > 0) {
          content += "\n## Latest Publications & Blog Posts\n";
          posts.forEach((post) => {
            const postUrl = `https://ais-pre-mqznufwafvpvxtzyrnuxum-278675378343.us-east1.run.app/blog/${post.slug || post.id}`;
            content += `- [${post.title}](${postUrl}): ${post.excerpt || 'Insightful publication on enterprise AI and leadership.'} (${new Date(post.date).toLocaleDateString()})\n`;
          });
        }
      } catch (err) {
        console.error("Failed to append dynamic blog posts to llms.txt:", err);
      }

      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      return res.send(content);
    } catch (error) {
      console.error("Error serving llms.txt:", error);
      return res.status(500).send("Internal server error");
    }
  });

  // Serving robots.txt
  app.get("/robots.txt", (req, res) => {
    const robotsPath = path.join(process.cwd(), "public", "robots.txt");
    if (fs.existsSync(robotsPath)) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      return res.sendFile(robotsPath);
    }
    return res.status(404).send("Not found");
  });

  // Serving sitemap.xml
  app.get("/sitemap.xml", (req, res) => {
    const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
    if (fs.existsSync(sitemapPath)) {
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      return res.sendFile(sitemapPath);
    }
    return res.status(404).send("Not found");
  });

  // Redirect /resume to https://minnieott.com/work#experience
  app.get(["/resume", "/resume/"], (req, res) => {
    return res.redirect(301, "https://minnieott.com/work#experience");
  });

  // GET: Fetch all blog posts
  app.get("/api/posts", async (req, res) => {
    const posts = await getPostsFromFirestore();
    return res.json({ posts });
  });

  // POST: Verify Firebase ID Token and check if authorized
  app.post("/api/auth/verify", async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: "idToken is required" });
    }
    
    try {
      const firebaseApiKey = firebaseConfig?.apiKey || process.env.FIREBASE_API_KEY || "AIzaSyCDIPQXWmDq81U8BrjbCy8hTDphG_Y45Xc";
      const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseApiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      });
      
      if (!response.ok) {
        const errData = await response.json();
        return res.status(401).json({ error: "Invalid token", details: errData });
      }
      
      const data = await response.json();
      const user = data.users?.[0];
      const email = user?.email;
      
      if (email === "minnie.ott@gmail.com") {
        return res.json({ success: true, user: { email, displayName: user.displayName, photoUrl: user.photoUrl } });
      } else {
        return res.status(403).json({ error: "Forbidden: You are not authorized to access this workspace." });
      }
    } catch (error: any) {
      console.error("Error in /api/auth/verify:", error);
      return res.status(500).json({ error: "Internal server error", details: error.message });
    }
  });

  // POST: Create/Publish a blog post
  app.post("/api/posts", async (req, res) => {
    if (!(await isAdminAuthenticated(req))) {
      return res.status(401).json({ error: "Unauthorized access. Invalid credentials." });
    }

    const { id, title, slug: customSlug, excerpt, content, category, readTime, author, published } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required." });
    }

    const posts = await getPostsFromFirestore();

    // Check if updating an existing post by ID or slug
    const existingIndex = posts.findIndex(p => (id && p.id === id) || (customSlug && p.slug === customSlug));

    if (existingIndex !== -1) {
      const existingPost = posts[existingIndex];
      const updatedPost: BlogPost = {
        ...existingPost,
        title,
        excerpt: excerpt || (content.length > 150 ? content.substring(0, 150) + "..." : content),
        content,
        category: category || "Uncategorized",
        readTime: readTime || `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min read`,
        author: author || "Minerva Tanglao Ott",
        published: published !== false
      };

      posts[existingIndex] = updatedPost;
      writePostsToFile(posts);
      await savePostToFirestore(updatedPost);

      return res.json({ success: true, post: updatedPost, posts });
    }

    // New post creation
    const slug = customSlug || slugify(title);
    let finalSlug = slug;
    let suffix = 1;
    while (posts.some(p => p.slug === finalSlug)) {
      finalSlug = `${slug}-${suffix}`;
      suffix++;
    }

    const newPost: BlogPost = {
      id: id || Math.random().toString(36).substring(2, 9),
      title,
      slug: finalSlug,
      excerpt: excerpt || (content.length > 150 ? content.substring(0, 150) + "..." : content),
      content,
      category: category || "Uncategorized",
      readTime: readTime || `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min read`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      author: author || "Minerva Tanglao Ott",
      published: published !== false
    };

    // Always save locally to posts.json
    posts.unshift(newPost);
    writePostsToFile(posts);

    // Sync to Firestore cloud database
    await savePostToFirestore(newPost);

    return res.json({ success: true, post: newPost, posts });
  });

  // PUT: Update an existing blog post
  app.put("/api/posts/:id", async (req, res) => {
    if (!(await isAdminAuthenticated(req))) {
      return res.status(401).json({ error: "Unauthorized access. Invalid credentials." });
    }

    const { id } = req.params;
    const { title, excerpt, content, category, readTime, author, published } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required." });
    }

    const posts = await getPostsFromFirestore();
    let index = posts.findIndex(p => p.id === id);

    if (index === -1 && req.body.slug) {
      index = posts.findIndex(p => p.slug === req.body.slug);
    }

    if (index === -1) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    // Preserve the original URL (slug) and ID when updating
    const finalSlug = posts[index].slug;

    const updatedPost: BlogPost = {
      ...posts[index],
      title,
      slug: finalSlug,
      excerpt: excerpt || (content.length > 150 ? content.substring(0, 150) + "..." : content),
      content,
      category: category || "Uncategorized",
      readTime: readTime || `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min read`,
      author: author || "Minerva Tanglao Ott",
      published: published !== false
    };

    // Always update local posts.json
    posts[index] = updatedPost;
    writePostsToFile(posts);

    // Sync to Firestore cloud database
    await savePostToFirestore(updatedPost);

    return res.json({ success: true, post: updatedPost, posts });
  });

  // DELETE: Remove a blog post
  app.delete("/api/posts/:id", async (req, res) => {
    if (!(await isAdminAuthenticated(req))) {
      return res.status(401).json({ error: "Unauthorized access. Invalid credentials." });
    }

    const { id } = req.params;
    const posts = await getPostsFromFirestore();
    const index = posts.findIndex(p => p.id === id || p.slug === id);

    if (index !== -1) {
      const postToDelete = posts[index];
      posts.splice(index, 1);
      writePostsToFile(posts);

      // Record deletion locally and in Firestore cloud database
      await deletePostFromFirestore(postToDelete.id, postToDelete.slug);

      return res.json({ success: true, posts });
    }
    return res.status(404).json({ error: "Blog post not found" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
