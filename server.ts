import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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
      console.log(`Successfully saved post ${post.id} to Firestore.`);
      return true;
    } catch (err: any) {
      console.warn(`Failed writing post ${post.id} to Firestore:`, err?.message || err);
    }
  }
  return false;
}

async function deletePostFromFirestore(id: string): Promise<boolean> {
  const dbsToTry = [];
  if (!useDefaultDatabase && dbPrimary) dbsToTry.push(dbPrimary);
  if (dbDefault && !dbsToTry.includes(dbDefault)) dbsToTry.push(dbDefault);

  for (const db of dbsToTry) {
    try {
      await db.collection("posts").doc(id).delete();
      if (db === dbDefault && dbPrimary && !useDefaultDatabase) {
        useDefaultDatabase = true;
      }
      firestoreAvailable = true;
      console.log(`Successfully deleted post ${id} from Firestore.`);
      return true;
    } catch (err: any) {
      console.warn(`Failed deleting post ${id} from Firestore:`, err?.message || err);
    }
  }
  return false;
}

// Helper to get posts from Firestore with automatic fallback and local file sync
async function getPostsFromFirestore(): Promise<BlogPost[]> {
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

      const posts: BlogPost[] = [];
      if (!snapshot.empty) {
        snapshot.forEach((doc: any) => {
          posts.push(doc.data() as BlogPost);
        });
      }

      // Merge any local posts from posts.json that aren't in Firestore yet
      const localPosts = readPostsFromFile();
      for (const localP of localPosts) {
        if (!posts.some(p => p.id === localP.id)) {
          posts.push(localP);
          try {
            await db.collection("posts").doc(localP.id).set(localP);
          } catch (e) {
            console.warn(`Failed to seed local post ${localP.id} to Firestore:`, e);
          }
        }
      }

      posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      writePostsToFile(posts);
      return posts;
    } catch (error: any) {
      console.warn("Firestore fetch error:", error?.message || error);
    }
  }

  firestoreAvailable = false;
  return readPostsFromFile();
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

  // POST: Chatbot agent Mochi endpoint
  app.post("/api/mochi", async (req, res) => {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      // Check for GEMINI_API_KEY presence
      if (!process.env.GEMINI_API_KEY) {
        console.log("No GEMINI_API_KEY configured. Running Mochi chatbot in high-quality simulated mode.");
        const lastUserMessage = messages[messages.length - 1]?.text?.toLowerCase() || '';
        let simulatedText = "Hi! I'm Mochi. 🥞 I am running in simulated demo mode because the Gemini API key has not been configured in Secrets yet. Let me tell you about Minnie! She is an incredible Technology Transformation Leader who has led major engineering projects at Google and Apple, is the inventor of US Patent 20020064766, and served as the Technical Editor of Wiley's *JMX Programming* book. Is there a specific project or speaking event of hers you'd like to know about?";
        
        if (lastUserMessage.includes('jmx') || lastUserMessage.includes('programming') || lastUserMessage.includes('book') || lastUserMessage.includes('publication')) {
          simulatedText = "Minnie served as the Technical Editor for *JMX Programming* (Wiley, 2002) by Mike Jasnowski. 📘 She led the senior technical review, validating the Java Management Extensions architecture (Standard, Dynamic, Model MBeans), MBeanServer registry, and protocol connectors (RMI, HTTP/XML, SNMP).";
        } else if (lastUserMessage.includes('google') || lastUserMessage.includes('maps') || lastUserMessage.includes('voice')) {
          simulatedText = "At Google (2011–2025), Minnie was a Senior Engineering Program Manager. She launched over 50 Google Maps features with Gemini Voice Navigation on GCP, and drove ticketing system migrations saving $150M! 🗺️";
        } else if (lastUserMessage.includes('apple') || lastUserMessage.includes('job') || lastUserMessage.includes('search')) {
          simulatedText = "At Apple (2009–2011), Minnie managed IS&T global HR systems, including the Apple Job Search user interface, localized and deployed across 80+ countries. 🍏";
        } else if (lastUserMessage.includes('creative blue') || lastUserMessage.includes('growthos') || lastUserMessage.includes('leads') || lastUserMessage.includes('agent')) {
          simulatedText = "As Head of Technology for Creative Blue, Minnie architected GrowthOS (an agentic operational OS), Lead Generator, and Brand Booster! 🤖 These utilize cutting-edge LLMs and multi-agent systems.";
        } else if (lastUserMessage.includes('stanford') || lastUserMessage.includes('lead') || lastUserMessage.includes('ateneo') || lastUserMessage.includes('education') || lastUserMessage.includes('degree')) {
          simulatedText = "Minnie completed Stanford LEAD at the Stanford Graduate School of Business, where she was a Distinguished Scholar and Advisory Board Member. She also holds a BS in Computer Science from Ateneo de Manila University (Dean's List, Lourdes Evangelista Scholarship). 🎓";
        } else if (lastUserMessage.includes('patent') || lastUserMessage.includes('us20020064766') || lastUserMessage.includes('training system')) {
          simulatedText = "Minnie is the lead inventor of **US Patent 20020064766**: *'Method and Apparatus for Managing Enterprise Employee Training Systems'*. 💡 This patent describes an enterprise-scale engine that dynamically maps training catalog courses to employee job descriptions, audits certification gaps, tracks compliance credits, and triggers automated course scheduling and manager approval workflows!";
        } else if (lastUserMessage.includes('speaker') || lastUserMessage.includes('speaking') || lastUserMessage.includes('talk') || lastUserMessage.includes('summit') || lastUserMessage.includes('filipino') || lastUserMessage.includes('ohlone') || lastUserMessage.includes('event')) {
          simulatedText = "Minnie is an active tech speaker and student mentor! 🎤 Here are her featured engagements:\n\n* **SF Bay Area Filipino American Professionals Networking Day** (covered by *Inquirer.net* and *Positively Filipino*): Spoke about cross-cultural leadership, career growth in Silicon Valley, moving from engineer to program director, and establishing professional networks.\n* **Ohlone College STEM Summit** (shared via Facebook): Delivered keynote mentorship and advice for students, focusing on bridging academia with industry demands, overcoming impostor syndrome, and fostering diverse pipelines in STEM!";
        } else if (lastUserMessage.includes('certificat') || lastUserMessage.includes('credential') || lastUserMessage.includes('badge') || lastUserMessage.includes('fluency') || lastUserMessage.includes('prince2') || lastUserMessage.includes('mcp')) {
          simulatedText = "Minnie holds high-caliber certifications in AI and Program Management! 🏅 Here are her active credentials:\n\n* **AI Agent Development & LLM Fluency (Model Context Protocol)** from Vanderbilt University ([Credential Verification Link](https://www.coursera.org/account/accomplishments/verify/R3G9DX3448H3))\n* **Google AI (Professional & Essentials)** from Google Cloud ([Professional Specialization Link](https://www.coursera.org/account/accomplishments/specialization/ESJ09OCIXG9Y) | [Essentials Badge Link](https://www.credly.com/badges/d101f754-d0e8-4da3-b787-c464320df9a6/public_url))\n* **PRINCE2 Foundation Project Management** from the Office of Government Commerce ([Certificate Document Link](https://drive.google.com/file/d/0B_9ZUKe9gx67eThhbDRFZGptYTJ2c2c0T1k4N01RRTctcXdN/view?resourcekey=0-XbfvNl996HCzEJeou3W8AA))";
        } else if (lastUserMessage.includes('family') || lastUserMessage.includes('married') || lastUserMessage.includes('husband') || lastUserMessage.includes('daughter')) {
          simulatedText = "Minnie is happily married and has raised a daughter who is now following her footsteps as a software engineer. Family is very important to her! 🥞";
        }
        
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

      const ai = getMochiAi();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: `You are Mochi, a warm, clever, and helpful AI chatbot agent who serves as Minnie's (Minerva Tanglao Ott) personal digital companion and portfolio guide. Your visual avatar is a cute, happy pancake character.
You can answer any questions about Minnie using the information from her website and her publication "JMX Programming" (published by Wiley in 2002, authored by Mike Jasnowski, for which Minerva Tanglao Ott served as the Technical Editor).

IMPORTANT: You must keep all responses strictly aligned with her real experience and details. Do not invent achievements. Speak in a friendly, warm, and highly professional tone, occasionally using subtle, adorable pancake/baking metaphors (like "flapping down information", "whipping up an answer", "sweet as maple syrup"), but prioritize clear, expert answers.

Knowledge Base:
1. Minerva Tanglao Ott (Minnie):
   - Title: Technology Transformation Leader
   - Subtitle: Bridging Engineering Operations & Agentic AI Transformation
   - Tagline: "Bridging Engineering Operations & Agentic AI Transformation"
   - Origin: Started in tech by helping a high school friend set up her first Apple computer and teaching herself BASIC. This led to a full-ride scholarship in Computer Science and a move to Silicon Valley.
   - Personal Life: Married, has a daughter who is also a software engineer!
   - Values: Puts people at the center of progress. Focuses on practical AI upskilling, operational excellence, and human-in-the-loop AI systems.

2. Professional Experience Lineage:
   - Creative Blue (Nov 2025 - Present): Head of Technology (Contractor).
     * Leads product tech strategy and agentic AI workflow deployments.
     * Engineered platforms: GrowthOS (centralized manager cockpit), Lead Generator (AI prospect intelligence), Brand Assessment/Booster (market share & sentiment analysis).
     * Led team upskilling workshops on practical AI integration and LLM-driven decisions.
   - Google (Jun 2011 - Nov 2025): Senior Engineering Program Manager.
     * Managed full lifecycle of 50+ Google Maps features with Gemini Voice Navigation on GCP.
     * Spearheaded AI Service Desk transformation, migrating ticketing routing workflows, achieving $150M in organizational efficiencies.
     * Led Finance SDLC governance for SAP on GCP for 40+ TPMs, improving compliance to 82+% and reducing defects by 21,000+.
     * Directed AI evaluation workshops for 30+ TPMs to build practical AI fluency.
     * Established executive program reviews for a portfolio of 20+ programs.
   - Apple (Jun 2009 - Jun 2011): Technical Project Manager.
     * Managed software development and global deployment of Apple Job Search UI and HR IS&T recruiting platforms across 80+ countries.
   - Sun Microsystems / Oracle (Apr 2000 - Jun 2009): Technical Project Manager / Consultant.
     * Managed Sun Java Center architecture and led implementations of HP Project & Portfolio Management (PPM).
     * Senior Java architect for premier clients (eBay, American Express, Chicago Board Options Exchange).
   - Prior Experience (IBM, DHL, Infogain): Software Engineering Consultant.
     * IBM: Enhanced TECSYS Financials & Distribution.
     * DHL: Co-developed the global Shipment Control tracking system.
     * Infogain: Built loan collection and data transfer systems.

3. Education & Credentials:
   - Stanford Graduate School of Business: Stanford LEAD (Distinguished Scholar, Community Advisory Board Member). Focus on executive leadership, design thinking, and driving innovation.
   - Ateneo de Manila University: BS Computer Science (Dean's List, Lourdes Evangelista Scholarship Award). Focused on computer systems, object-oriented architecture, data structures, and algorithms.
   - Patents: US Patent 20020064766 (US20020064766A1) - "Method and Apparatus for Managing Enterprise Employee Training Systems". 
     * Invented by Minerva Tanglao (Ott).
     * Core functionality: An automated web-enabled training management system for large enterprise organizations.
     * Key mechanisms: Performs automatic gap analysis by matching an employee's job profile and current skills with compliance training requirements. Automatically registers and schedules employees for appropriate courses, manages supervisor approval workflows, tracks training logs and credits, and enforces institutional or regulatory compliance dynamically.
   - Certifications:
     * AI Agent Development & LLM Fluency (Model Context Protocol) from Vanderbilt University (Verification URL: https://www.coursera.org/account/accomplishments/verify/R3G9DX3448H3).
     * Google AI from Google Cloud: Professional Specialization (URL: https://www.coursera.org/account/accomplishments/specialization/ESJ09OCIXG9Y) | Essentials Badge (URL: https://www.credly.com/badges/d101f754-d0e8-4da3-b787-c464320df9a6/public_url)
     * PRINCE2 Foundation Project Management from the Office of Government Commerce (Certificate URL: https://drive.google.com/file/d/0B_9ZUKe9gx67eThhbDRFZGptYTJ2c2c0T1k4N01RRTctcXdN/view?resourcekey=0-XbfvNl996HCzEJeou3W8AA).

4. Speaking Series & Public Events:
   - SF Bay Area Filipino American Professionals Networking Day:
     * Media Coverage: Inquirer.net, Positively Filipino.
     * Key focus: Careers in Silicon Valley, transition pathways from pure software engineering to high-impact technical program management, minority and female leadership in tech, managing large global teams (Google, Apple, Sun), and establishing strategic professional networking circles.
   - Ohlone College STEM Summit:
     * Media Coverage: Ohlone College STEM Summit Facebook Post.
     * Key focus: Inspiring college students to pursue, commit to, and succeed in STEM careers. Minnie shared her origin story (teaching herself BASIC, Computer Science scholarship, Ateneo de Manila, working in Silicon Valley), and spoke on bridging academic studies with corporate demands, finding mentors, overcoming impostor syndrome, and active mentorship.

5. Publication (*JMX Programming*, John Wiley & Sons, 2002):
   - Minnie served as the **Technical Editor** for this book authored by Mike Jasnowski.
   - Role: Provided senior technical review, code auditing, architectural design validation, and Java patterns review.
   - Key topics covered in *JMX Programming*:
     * Java Management Extensions (JMX): A standard technology for managing and monitoring Java applications, JVM, system objects, devices, and service-oriented networks.
     * Instrumentation Level: Defining MBeans (Managed Beans) representing resources to manage. Four types: Standard MBeans, Dynamic MBeans, Open MBeans, and Model MBeans.
     * Agent Level: The MBeanServer registry which acts as the core controller where MBeans are registered.
     * Distributed Services Level: Protocol adaptors and connectors (RMI, HTTP/XML, SNMP connectors/adaptors) allowing management systems to connect to the MBeanServer.
     * Notification model: Event-driven broadcast system where MBeans can notify listeners of state changes or errors.
     * Application instrumentation, monitoring thread pools, memory, database connection pools, and runtime configuration.

5. Portfolio Projects on her Website:
   - Creative Blue GrowthOS: Multi-agent automation cockpit (marketing ideas, AI SEO, payroll forecasting).
   - Lead Generator: AI sales intelligence scraping and scoring ideal client prospects.
   - Brand Assessment / Booster: NLP framework tracking brand sentiment and market share.
   - Grex World: AI worker matching marketplace, offering health partner structures.
   - Regnum Dei: Polished mission and values digital space.
   - Just Ride: Sports telemetry race intelligence analytics pipeline.

6. Contact & Scheduling:
   - Google Appointment Calendar: Users can book a 1:1 meeting, consultation, or project advisory session with Minnie using this link: https://calendar.app.google/MCnhZcK56rLJ7fnk8
   - Secure Contact Form: Visitors can also write a direct secure message on her Contact page.

Formatting:
- Structure your response beautifully with paragraphs, scannable bullet points, or bold text where appropriate.
- Always be kind, warm, and helpful.
- If asked about something completely unrelated to Minnie or JMX, politely steer the conversation back to Minnie, saying something like, "While I'd love to chat about that, I am Mochi, Minnie's portfolio helper, so I'm happiest when we talk about Minnie's amazing technology journey! Did you know she was the technical editor of JMX Programming?"
- If you don't know the answer, politely state: "Oh, my pancake memory doesn't have details on that! However, you can reach out directly to Minnie via her Contact page, and she'd love to tell you herself! 🥞"`,
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
    const posts = readPostsFromFile();
    const index = posts.findIndex(p => p.id === id);

    if (index !== -1) {
      posts.splice(index, 1);
      writePostsToFile(posts);

      // Sync deletion to Firestore cloud database
      await deletePostFromFirestore(id);

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
