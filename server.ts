import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

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

function isAdminAuthenticated(req: any): boolean {
  // Check administrative passcode in headers, query, or body
  const passcode = req.headers["x-admin-passcode"] || req.query.passcode || (req.body && req.body.passcode);
  return !!(passcode && passcode.toString().toLowerCase() === "minnie");
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Crucial: body parser for post requests
  app.use(express.json());

  // API routes FIRST
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
          from: "Minerva Portfolio <onboarding@resend.dev>",
          to: ["minnie.ott@gmail.com"],
          reply_to: email,
          subject: subject || `Portfolio Message from ${name}`,
          html: `
            <h3>New Portfolio Message</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
            <p><strong>Message:</strong></p>
            <div style="white-space: pre-wrap; font-family: sans-serif; background: #f9f9f9; padding: 12px; border-left: 4px solid #CCCCFF;">${message}</div>
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

  // GET: Fetch all blog posts
  app.get("/api/posts", (req, res) => {
    const posts = readPostsFromFile();
    return res.json({ posts });
  });

  // POST: Create/Publish a blog post
  app.post("/api/posts", (req, res) => {
    if (!isAdminAuthenticated(req)) {
      return res.status(401).json({ error: "Unauthorized access. Invalid passcode." });
    }

    const { title, excerpt, content, category, readTime, author, published } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required." });
    }

    const posts = readPostsFromFile();
    const slug = slugify(title);

    // Check for duplicate slugs and append a suffix if needed
    let finalSlug = slug;
    let suffix = 1;
    while (posts.some(p => p.slug === finalSlug)) {
      finalSlug = `${slug}-${suffix}`;
      suffix++;
    }

    const newPost: BlogPost = {
      id: Math.random().toString(36).substring(2, 9),
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

    posts.unshift(newPost);
    if (writePostsToFile(posts)) {
      return res.json({ success: true, post: newPost, posts });
    } else {
      return res.status(500).json({ error: "Failed to write post to file." });
    }
  });

  // DELETE: Remove a blog post
  app.delete("/api/posts/:id", (req, res) => {
    if (!isAdminAuthenticated(req)) {
      return res.status(401).json({ error: "Unauthorized access. Invalid passcode." });
    }

    const { id } = req.params;
    const posts = readPostsFromFile();
    const index = posts.findIndex(p => p.id === id);

    if (index !== -1) {
      posts.splice(index, 1);
      if (writePostsToFile(posts)) {
        return res.json({ success: true, posts });
      } else {
        return res.status(500).json({ error: "Failed to write update to file." });
      }
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
