import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
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
} from '../src/data/resumeData.js';

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

function parseMarkdownToHtml(text: string): string {
  if (!text) return '';
  try {
    return marked.parse(text, { async: false }) as string;
  } catch (e) {
    let html = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, url) => {
      const isInternal = url.startsWith('#');
      return `<a href="${url}" ${isInternal ? '' : 'target="_blank" rel="noopener noreferrer"'} style="color: #2563eb; font-weight: 600; text-decoration: underline;">${label}</a>`;
    });
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    return html;
  }
}

export function generateSeoHtml(): string {
  const postsFilePath = path.join(process.cwd(), 'src', 'data', 'posts.json');
  let posts: BlogPost[] = [];
  try {
    if (fs.existsSync(postsFilePath)) {
      posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf-8'));
    }
  } catch (e) {
    console.error('Error loading posts for SEO generator:', e);
  }

  const baseUrl = 'https://ais-pre-mqznufwafvpvxtzyrnuxum-278675378343.us-east1.run.app';

  // JSON-LD Schemas
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": personalInfo.name,
    "alternateName": "Minnie Ott",
    "jobTitle": personalInfo.title,
    "description": personalInfo.tagline,
    "image": `${baseUrl}/minnieott.jpg`,
    "url": baseUrl,
    "sameAs": [personalInfo.linkedin],
    "knowsAbout": [
      "Technical Program Management",
      "Artificial Intelligence",
      "Agentic Workflows",
      "Model Context Protocol (MCP)",
      "Google Cloud Platform",
      "Global Team Leadership",
      "Software Development Lifecycle (SDLC)"
    ],
    "worksFor": experiences.map(exp => ({
      "@type": "Organization",
      "name": exp.company,
      "jobTitle": exp.role
    }))
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Minerva Tanglao Ott Portfolio",
    "url": baseUrl,
    "description": personalInfo.tagline,
    "author": {
      "@type": "Person",
      "name": personalInfo.name
    }
  };

  const blogPostsSchema = posts.map(post => ({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "author": {
      "@type": "Person",
      "name": post.author || personalInfo.name
    },
    "datePublished": post.date,
    "url": `${baseUrl}/#blog-${post.slug || post.id}`
  }));

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-KH1F2ZJ32Y"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-KH1F2ZJ32Y');
  </script>

  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/jpeg" href="/minnieott.jpg" />

  <!-- Primary SEO Metadata -->
  <title>Minerva Tanglao Ott (Minnie) | Technology Transformation & TPM Leader</title>
  <meta name="description" content="Official SEO-Optimized Portfolio of Minerva Tanglao Ott (Minnie), Head of Technology at Creative Blue & former Sr. TPM at Google & Apple. Specialized in Agentic AI, Model Context Protocol (MCP), and enterprise SDLC governance." />
  <meta name="keywords" content="Minerva Tanglao Ott, Minerva Ott, Minnie Ott, Technical Program Management, Model Context Protocol, MCP, Agentic AI, Creative Blue, GrowthOS, Google Maps, Apple, Silicon Valley, Head of Technology" />
  <meta name="author" content="Minerva Tanglao Ott (Minnie)" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  <link rel="canonical" href="${baseUrl}/index-seo.html" />
  <link rel="alternate" type="text/plain" title="LLM-friendly content summary" href="/llms.txt" />
  <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="profile" />
  <meta property="og:title" content="Minerva Tanglao Ott (Minnie) | Technology Transformation & TPM Leader" />
  <meta property="og:description" content="Explore the full career portfolio, AI frameworks (GrowthOS, Lead Generator, Brand Assessment), Google Maps leadership, JMX publication, and tech insights of Minerva Tanglao Ott." />
  <meta property="og:image" content="${baseUrl}/minnieott.jpg" />
  <meta property="og:url" content="${baseUrl}/index-seo.html" />
  <meta property="og:site_name" content="Minerva Tanglao Ott Portfolio" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Minerva Tanglao Ott (Minnie) | Technology Transformation & TPM Leader" />
  <meta name="twitter:description" content="Official portfolio and AI technical insights of Minerva Tanglao Ott (Minnie)." />
  <meta name="twitter:image" content="${baseUrl}/minnieott.jpg" />

  <!-- JSON-LD Structured Data (Rich Snippets) -->
  <script type="application/ld+json">
    ${JSON.stringify(personSchema, null, 2)}
  </script>
  <script type="application/ld+json">
    ${JSON.stringify(websiteSchema, null, 2)}
  </script>
  <script type="application/ld+json">
    ${JSON.stringify(blogPostsSchema, null, 2)}
  </script>

  <!-- Embedded Self-Contained High-Performance Stylesheet -->
  <style>
    :root {
      --primary: #1e293b;
      --accent: #2563eb;
      --accent-hover: #1d4ed8;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #0f172a;
      --text-muted: #475569;
      --border: #e2e8f0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 0;
      margin: 0;
    }
    a { color: var(--accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
    header {
      background: #0f172a;
      color: #ffffff;
      padding: 1rem 2rem;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    header h1 { font-size: 1.25rem; font-weight: 700; color: #ffffff; }
    nav a { color: #cbd5e1; margin-left: 1.5rem; font-size: 0.95rem; font-weight: 500; }
    nav a:hover { color: #ffffff; text-decoration: none; }
    .container { max-width: 1100px; margin: 0 auto; padding: 2.5rem 1.5rem; }
    .hero {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 2.5rem;
      margin-bottom: 2.5rem;
      display: flex;
      gap: 2rem;
      align-items: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .hero img {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #eff6ff;
    }
    .hero-content h2 { font-size: 2rem; margin-bottom: 0.5rem; color: #0f172a; }
    .hero-content p.subtitle { font-size: 1.1rem; color: #2563eb; font-weight: 600; margin-bottom: 0.75rem; }
    .hero-content p.tagline { color: var(--text-muted); font-size: 1rem; margin-bottom: 1rem; }
    .badge {
      display: inline-block;
      background: #eff6ff;
      color: #1d4ed8;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1.25rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e2e8f0;
      color: #0f172a;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1.75rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    }
    .card-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem; flex-wrap: wrap; }
    .card-title { font-size: 1.2rem; font-weight: 700; color: #0f172a; }
    .card-subtitle { color: #2563eb; font-weight: 600; font-size: 0.95rem; }
    .card-period { color: var(--text-muted); font-size: 0.875rem; font-weight: 500; }
    ul.bullet-list { margin-left: 1.25rem; margin-top: 0.75rem; color: var(--text-muted); }
    ul.bullet-list li { margin-bottom: 0.5rem; font-size: 0.95rem; line-height: 1.5; }
    .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 2rem; }
    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; }
    .blog-post { background: var(--card-bg); border: 1px solid var(--border); border-radius: 10px; padding: 1.5rem; margin-bottom: 1.25rem; }
    .blog-meta { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem; }
    .blog-content {
      font-size: 0.95rem;
      color: #334155;
      line-height: 1.75;
      background: #f8fafc;
      padding: 1.25rem 1.5rem;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    .blog-content h1, .blog-content h2, .blog-content h3, .blog-content h4 {
      color: #0f172a;
      margin-top: 1.25rem;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }
    .blog-content h1 { font-size: 1.4rem; }
    .blog-content h2 { font-size: 1.25rem; }
    .blog-content h3 { font-size: 1.1rem; }
    .blog-content p {
      margin-bottom: 1rem;
    }
    .blog-content p:last-child {
      margin-bottom: 0;
    }
    .blog-content ul, .blog-content ol {
      margin-left: 1.5rem;
      margin-bottom: 1rem;
    }
    .blog-content li {
      margin-bottom: 0.35rem;
    }
    .blog-content blockquote {
      border-left: 4px solid #cbd5e1;
      padding-left: 1rem;
      margin: 1rem 0;
      font-style: italic;
      color: #475569;
    }
    .blog-content code {
      background: #e2e8f0;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.85em;
    }
    .blog-content pre {
      background: #0f172a;
      color: #f8fafc;
      padding: 1rem;
      border-radius: 6px;
      overflow-x: auto;
      margin: 1rem 0;
    }
    .blog-content pre code {
      background: transparent;
      padding: 0;
      color: inherit;
    }
    .blog-content a {
      color: #2563eb;
      font-weight: 600;
      text-decoration: underline;
    }
    footer {
      background: #0f172a;
      color: #94a3b8;
      text-align: center;
      padding: 2rem;
      margin-top: 4rem;
      font-size: 0.9rem;
    }
    @media (max-width: 640px) {
      .hero { flex-direction: column; text-align: center; }
      nav { display: none; }
    }
  </style>
</head>
<body>

  <header>
    <h1>Minerva Tanglao Ott (Minnie)</h1>
    <nav>
      <a href="#about">About</a>
      <a href="#experience">Experience</a>
      <a href="#portfolio">Portfolio</a>
      <a href="#skills">Skills</a>
      <a href="#publications">Publications</a>
      <a href="#blog">Blog</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>

  <div class="container">

    <!-- HERO SECTION -->
    <section id="about" class="hero">
      <img src="/minnieott.jpg" alt="Minerva Tanglao Ott (Minnie)" />
      <div class="hero-content">
        <h2>${personalInfo.name}</h2>
        <p class="subtitle">${personalInfo.title}</p>
        <p class="tagline">${personalInfo.tagline}</p>
        <div>
          ${personalInfo.companiesLineage.map(c => `<span class="badge">${c}</span>`).join('')}
        </div>
        <p style="margin-top: 1rem; color: var(--text-muted); font-size: 0.95rem;">
          ${personalInfo.about}
        </p>
        <div style="margin-top: 1.25rem;">
          <a href="${personalInfo.linkedin}" target="_blank" rel="noopener noreferrer" style="background: #2563eb; color: #fff; padding: 0.5rem 1rem; border-radius: 6px; font-weight: 600; display: inline-block;">LinkedIn Profile</a>
          <a href="https://calendar.app.google/MCnhZcK56rLJ7fnk8" target="_blank" rel="noopener noreferrer" style="background: #0f172a; color: #fff; padding: 0.5rem 1rem; border-radius: 6px; font-weight: 600; display: inline-block; margin-left: 0.5rem;">Schedule 1:1 Advisory</a>
        </div>
      </div>
    </section>

    <!-- PROFESSIONAL EXPERIENCE -->
    <section id="experience" style="margin-bottom: 3rem;">
      <h2 class="section-title">Professional Experience & Leadership</h2>
      ${experiences.map(exp => `
        <article class="card">
          <div class="card-header">
            <div>
              <div class="card-title">${exp.role}</div>
              <div class="card-subtitle">${exp.company} &bull; <span style="font-weight: 400; color: #64748b;">${exp.type}</span></div>
            </div>
            <div class="card-period">${exp.period}</div>
          </div>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 0.5rem;">${parseMarkdownToHtml(exp.description)}</p>
          <ul class="bullet-list">
            ${exp.bullets.map(b => `<li>${parseMarkdownToHtml(b)}</li>`).join('')}
          </ul>
          <div style="margin-top: 1rem;">
            ${exp.skillsUsed.map(s => `<span class="badge" style="background: #f1f5f9; color: #334155;">${s}</span>`).join('')}
          </div>
        </article>
      `).join('')}
    </section>

    <!-- PORTFOLIO APPLICATIONS -->
    <section id="portfolio" style="margin-bottom: 3rem;">
      <h2 class="section-title">Portfolio Applications & AI Frameworks</h2>
      <div class="grid-2">
        ${portfolioApps.map(app => `
          <div class="card" style="margin-bottom: 0;">
            <div class="card-title" style="margin-bottom: 0.25rem;">${app.name}</div>
            <div style="font-size: 0.85rem; color: #2563eb; font-weight: 600; margin-bottom: 0.75rem;">${app.role} &bull; ${app.status}</div>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.75rem;">${app.description}</p>
            <ul class="bullet-list" style="margin-left: 1rem; font-size: 0.875rem;">
              ${app.bulletPoints.map(b => `<li>${parseMarkdownToHtml(b)}</li>`).join('')}
            </ul>
            ${app.cta ? `
            <div style="margin-top: 1rem;">
              <a href="${app.cta.url}" target="_blank" rel="noopener noreferrer" style="font-weight: 600; font-size: 0.9rem;">${app.cta.label} &rarr;</a>
            </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </section>

    <!-- TECHNICAL SKILLS -->
    <section id="skills" style="margin-bottom: 3rem;">
      <h2 class="section-title">Technical Skills & Leadership Capabilities</h2>
      <div class="skills-grid">
        ${skillCategories.map(cat => `
          <div class="card" style="margin-bottom: 0;">
            <div class="card-title" style="font-size: 1.1rem; margin-bottom: 1rem;">${cat.name}</div>
            <div>
              ${cat.skills.map(s => `
                <div style="margin-bottom: 0.75rem;">
                  <div style="display: flex; justify-content: space-between; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.25rem;">
                    <span>${s.name}</span>
                    <span style="color: #2563eb;">${s.level}%</span>
                  </div>
                  <div style="background: #e2e8f0; height: 6px; border-radius: 3px; overflow: hidden;">
                    <div style="background: #2563eb; height: 100%; width: ${s.level}%;"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- PUBLICATIONS & PATENTS -->
    <section id="publications" style="margin-bottom: 3rem;">
      <h2 class="section-title">Publications & Patents</h2>
      <div class="grid-2">
        <div class="card">
          <div class="card-title">${books.title}</div>
          <div style="color: #2563eb; font-weight: 600; font-size: 0.9rem; margin-bottom: 0.5rem;">Role: ${books.role} (Author: ${books.author}, John Wiley & Sons)</div>
          <p style="font-size: 0.9rem; color: var(--text-muted);">${books.description}</p>
          <div style="margin-top: 1rem;">
            <a href="${books.link}" target="_blank" rel="noopener noreferrer" style="font-weight: 600; font-size: 0.9rem;">View Book on Google Books &rarr;</a>
          </div>
        </div>

        ${patents.map(p => `
          <div class="card">
            <div class="card-title">${p.title}</div>
            <div style="color: #2563eb; font-weight: 600; font-size: 0.9rem; margin-bottom: 0.5rem;">${p.id}</div>
            <p style="font-size: 0.9rem; color: var(--text-muted);">${p.description}</p>
            <div style="margin-top: 1rem;">
              <a href="${p.link}" target="_blank" rel="noopener noreferrer" style="font-weight: 600; font-size: 0.9rem;">View Patent on Google Patents &rarr;</a>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- CERTIFICATIONS & EDUCATION -->
    <section style="margin-bottom: 3rem;">
      <h2 class="section-title">Certifications & Education</h2>
      <div class="grid-2">
        <div class="card">
          <div class="card-title" style="margin-bottom: 1rem;">Certifications & Credentials</div>
          ${certifications.map(c => `
            <div style="margin-bottom: 1rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.75rem;">
              <div style="font-weight: 700; font-size: 0.95rem;">${c.title}</div>
              <div style="color: var(--text-muted); font-size: 0.85rem;">Issuer: ${c.issuer}</div>
              ${c.link ? `<a href="${c.link}" target="_blank" rel="noopener noreferrer" style="font-size: 0.85rem; font-weight: 600;">Verify Credential &rarr;</a>` : ''}
              ${c.links ? c.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.85rem; font-weight: 600; margin-right: 0.75rem;">${l.label} &rarr;</a>`).join('') : ''}
            </div>
          `).join('')}
        </div>

        <div class="card">
          <div class="card-title" style="margin-bottom: 1rem;">Education</div>
          ${education.map(e => `
            <div style="margin-bottom: 1.25rem;">
              <div style="font-weight: 700; font-size: 1rem; color: #0f172a;">${e.school}</div>
              <div style="color: #2563eb; font-weight: 600; font-size: 0.9rem;">${e.degree} &bull; ${e.honors.join(', ')}</div>
              <p style="color: var(--text-muted); font-size: 0.875rem; margin-top: 0.25rem;">${e.details}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- SPEAKING ENGAGEMENTS & KEYNOTES -->
    <section style="margin-bottom: 3rem;">
      <h2 class="section-title">Speaking Engagements & Keynotes</h2>
      <div class="card">
        <div class="card-title" style="margin-bottom: 1rem;">Speaker Series & Keynotes</div>
        ${speakerEvents.map(s => `
          <div style="margin-bottom: 1.25rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 1rem;">
            <div style="font-weight: 700; font-size: 1rem;">${s.event}</div>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.25rem;">${s.description}</p>
            <div style="margin-top: 0.5rem;">
              ${s.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.85rem; font-weight: 600; margin-right: 1rem;">${l.label} &rarr;</a>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- LIVE BLOG ARTICLES -->
    <section id="blog" style="margin-bottom: 3rem;">
      <h2 class="section-title">Technology Blog & Executive Insights</h2>
      ${posts.length > 0 ? posts.map(post => `
        <article id="blog-${post.slug || post.id}" class="blog-post">
          <div class="blog-meta">${post.date} &bull; ${post.category} &bull; ${post.readTime} &bull; By ${post.author || personalInfo.name}</div>
          <h3 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem;">${post.title}</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1rem; font-weight: 500;">${post.excerpt}</p>
          <div class="blog-content">
            ${parseMarkdownToHtml(post.content)}
          </div>
        </article>
      `).join('') : '<p style="color: var(--text-muted);">No blog posts published yet.</p>'}
    </section>

    <!-- CONTACT SECTION -->
    <section id="contact">
      <h2 class="section-title">Contact & Advisory Scheduling</h2>
      <div class="card" style="text-align: center; padding: 3rem 1.5rem;">
        <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Connect with Minerva Tanglao Ott</h3>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem; max-width: 600px; margin-left: auto; margin-right: auto;">
          Interested in technology transformation consulting, agentic AI frameworks, or executive advisory? Book a 1:1 session or connect via LinkedIn.
        </p>
        <div>
          <a href="https://calendar.app.google/MCnhZcK56rLJ7fnk8" target="_blank" rel="noopener noreferrer" style="background: #2563eb; color: #fff; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 1rem;">Book 1:1 Google Calendar Appointment</a>
          <a href="${personalInfo.linkedin}" target="_blank" rel="noopener noreferrer" style="background: #0f172a; color: #fff; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 1rem; margin-left: 0.75rem;">Connect on LinkedIn</a>
        </div>
      </div>
    </section>

  </div>

  <footer>
    <p>&copy; ${new Date().getFullYear()} Minerva Tanglao Ott (Minnie). All rights reserved.</p>
    <p style="margin-top: 0.5rem; font-size: 0.8rem; color: #64748b;">SEO-Optimized Static & Dynamic Web Export for ${personalInfo.name}</p>
  </footer>

  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;

  return htmlContent;
}

export function writeSeoHtmlFile(): string {
  const content = generateSeoHtml();
  const targetPath = path.join(process.cwd(), 'index-seo.html');
  fs.writeFileSync(targetPath, content, 'utf-8');

  // Also write to dist/index-seo.html if dist directory exists
  const distDir = path.join(process.cwd(), 'dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'index-seo.html'), content, 'utf-8');
  }

  console.log('Successfully generated /index-seo.html with full SEO metadata and content.');
  return targetPath;
}

if (process.argv[1] && process.argv[1].includes('generateSeo')) {
  writeSeoHtmlFile();
}
