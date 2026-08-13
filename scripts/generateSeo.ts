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
import { renderBlogPostHtml, renderBlogIndexHtml } from '../src/lib/blogSsr.js';

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

export function generateSitemapXml(posts: BlogPost[] = []): string {
  const baseUrl = 'https://minnieott.com';
  const today = new Date().toISOString().split('T')[0];

  const staticUrls = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${baseUrl}/work`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/resume`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/contact`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/blog`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/blog/author`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${baseUrl}/llms.txt`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/llms-full.txt`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/index-seo.html`, priority: '0.9', changefreq: 'daily' },
  ];

  const postUrls = posts
    .filter(p => p.published !== false)
    .map(p => {
      const postSlug = p.slug || p.id;
      const postDate = p.date ? new Date(p.date).toISOString().split('T')[0] : today;
      return `  <url>
    <loc>${baseUrl}/blog/${postSlug}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

  const staticXml = staticUrls
    .map(
      u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${staticXml}
${postUrls.join('\n')}
</urlset>`;
}

export function generateSeoHtml(providedPosts?: BlogPost[]): string {
  let posts: BlogPost[] = [];
  if (providedPosts && Array.isArray(providedPosts)) {
    posts = providedPosts;
  } else {
    const postsFilePath = path.join(process.cwd(), 'src', 'data', 'posts.json');
    try {
      if (fs.existsSync(postsFilePath)) {
        posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf-8'));
      }
    } catch (e) {
      console.error('Error loading posts for SEO generator:', e);
    }
  }

  const baseUrl = 'https://minnieott.com';

  // Rich JSON-LD Schemas for GEO / AI Search Engines

  // 1. Person Schema
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}/#person`,
    "name": personalInfo.name,
    "givenName": "Minerva",
    "familyName": "Ott",
    "alternateName": ["Minnie Ott", "Minerva Ott"],
    "jobTitle": personalInfo.title,
    "description": personalInfo.tagline,
    "image": `${baseUrl}/minnieott.webp`,
    "url": baseUrl,
    "sameAs": [
      personalInfo.linkedin,
      "https://minnieott.com"
    ],
    "publishingPrinciples": `${baseUrl}/llms.txt`,
    "alumniOf": [
      {
        "@type": "EducationalOrganization",
        "name": "Stanford Graduate School of Business",
        "description": "Stanford LEAD Executive Education Program Graduate & Community Advisory Board Member"
      },
      {
        "@type": "EducationalOrganization",
        "name": "Ateneo de Manila University",
        "description": "BS Computer Science (Dean's List, Lourdes Evangelista Scholarship Award)"
      }
    ],
    "hasCredential": certifications.map(c => ({
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "Professional Certification",
      "name": c.title,
      "recognizedBy": {
        "@type": "Organization",
        "name": c.issuer
      }
    })),
    "knowsAbout": [
      "Technical Program Management (TPM)",
      "Agentic AI & Agent Workflows",
      "Model Context Protocol (MCP)",
      "Google Cloud Platform (GCP)",
      "Enterprise Software Development Lifecycle (SDLC)",
      "Java Management Extensions (JMX)",
      "Voice Navigation & Gemini AI Integration",
      "Natural Language Processing & Sentiment Analysis",
      "Global Team Leadership"
    ],
    "worksFor": [
      {
        "@type": "Organization",
        "name": "Creative Blue",
        "jobTitle": "Head of Technology & Executive Strategy"
      },
      ...experiences.map(exp => ({
        "@type": "Organization",
        "name": exp.company,
        "jobTitle": exp.role
      }))
    ]
  };

  // 2. WebSite Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    "name": "Minerva Tanglao Ott (Minnie) Portfolio & AI Knowledge Base",
    "url": baseUrl,
    "description": "Official GEO-Optimized Portfolio, Technology Insights, and AI Frameworks of Minerva Tanglao Ott (Minnie).",
    "publisher": {
      "@type": "Person",
      "name": personalInfo.name,
      "@id": `${baseUrl}/#person`
    },
    "author": {
      "@type": "Person",
      "name": personalInfo.name,
      "@id": `${baseUrl}/#person`
    }
  };

  // 3. Organization Schema (Creative Blue)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    "name": "Creative Blue",
    "url": "https://creativeblue.com",
    "description": "Enterprise AI operations platform and agency transformation leader, producing GrowthOS, Lead Generator, and Brand Assessment.",
    "member": {
      "@type": "Person",
      "name": personalInfo.name,
      "jobTitle": "Head of Technology"
    }
  };

  // 4. FAQPage Schema for Direct AI Answers (Google AI Overviews, Perplexity, ChatGPT Search, Claude)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${baseUrl}/#faq`,
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Who is Minerva Tanglao Ott (Minnie)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Minerva Tanglao Ott (Minnie) is a Silicon Valley engineering leader, Head of Technology at Creative Blue, and Senior Technical Program Management (TPM) leader with 20+ years of executive experience spanning Google, Apple, Sun Microsystems, and enterprise startups."
        }
      },
      {
        "@type": "Question",
        "name": "What was Minerva Tanglao Ott's role at Google and Apple?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "At Google (2011–2025), Minnie served as Senior Engineering Program Manager leading Google Maps Voice Navigation integrated with Gemini AI, Service Desk infrastructure for 150,000+ employees, and co-founding Stanford LEAD @ Google. At Apple (2009–2011), she managed global IS&T software releases including the Apple Job Search portal localized across 80+ countries."
        }
      },
      {
        "@type": "Question",
        "name": "What AI frameworks and platforms has Minnie Ott developed at Creative Blue?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "At Creative Blue, Minnie architected GrowthOS (an enterprise AI operations platform), Lead Generator (autonomous AI sales prospecting agent), and Brand Assessment (NLP sentiment and brand equity dashboard)."
        }
      },
      {
        "@type": "Question",
        "name": "What book and patents is Minerva Tanglao Ott associated with?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Minerva Tanglao Ott served as the Technical Editor for 'JMX Programming' (John Wiley & Sons, 2002) and is the lead inventor on US Patent 20020064766 for Enterprise Employee Training Systems."
        }
      },
      {
        "@type": "Question",
        "name": "How can I schedule a 1:1 meeting or advisory consultation with Minnie Ott?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can schedule a direct 1:1 consultation via her Google Appointment Calendar at https://calendar.app.google/MCnhZcK56rLJ7fnk8 or connect via LinkedIn at https://www.linkedin.com/in/minnieott/."
        }
      }
    ]
  };

  // 5. BlogPosting Array Schema
  const blogPostsSchema = posts.filter(p => p.published !== false).map(post => ({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${baseUrl}/blog/${post.slug || post.id}`,
    "headline": post.title,
    "description": post.excerpt,
    "articleBody": post.content.replace(/<[^>]*>/g, '').substring(0, 5000),
    "author": {
      "@type": "Person",
      "name": post.author || personalInfo.name,
      "@id": `${baseUrl}/#person`
    },
    "publisher": {
      "@type": "Person",
      "name": personalInfo.name,
      "@id": `${baseUrl}/#person`
    },
    "datePublished": post.date ? new Date(post.date).toISOString().split('T')[0] : "2026-07-21",
    "dateModified": post.date ? new Date(post.date).toISOString().split('T')[0] : "2026-08-04",
    "url": `${baseUrl}/blog/${post.slug || post.id}`,
    "mainEntityOfPage": `${baseUrl}/blog/${post.slug || post.id}`,
    "keywords": [post.category, "Technical Program Management", "Agentic AI", "Engineering Leadership", "Software Strategy"]
  }));

  // 6. BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${baseUrl}/` },
      { "@type": "ListItem", "position": 2, "name": "Work & Experience", "item": `${baseUrl}/work` },
      { "@type": "ListItem", "position": 3, "name": "Blog & Insights", "item": `${baseUrl}/blog` },
      { "@type": "ListItem", "position": 4, "name": "Contact & Booking", "item": `${baseUrl}/contact` }
    ]
  };

  const htmlContent = `<!DOCTYPE html>
<html lang="en" itemscope itemtype="https://schema.org/WebPage">
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
  <link rel="icon" type="image/webp" href="/minnieott.webp" />

  <!-- Google Fonts Optimization: Pre-connect and combine font requests -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

  <!-- Asynchronous Google Fonts stylesheet loading -->
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=JetBrains+Mono:wght@400;500&family=Montserrat:ital,wght@0,300..900;1,300..900&family=Sacramento&display=swap" crossorigin="anonymous" onload="this.onload=null;this.rel='stylesheet'" />
  <noscript>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=JetBrains+Mono:wght@400;500&family=Montserrat:ital,wght@0,300..900;1,300..900&family=Sacramento&display=swap" />
  </noscript>

  <!-- Primary SEO & GEO Metadata -->
  <title>Minerva Tanglao Ott (Minnie) | Head of Technology, Agentic AI & TPM Leader</title>
  <meta name="description" content="Official GEO-Optimized Portfolio of Minerva Tanglao Ott (Minnie), Head of Technology at Creative Blue & former Sr. TPM at Google & Apple. Leader in Agentic AI, Model Context Protocol (MCP), and enterprise SDLC governance." />
  <meta name="keywords" content="Minerva Tanglao Ott, Minerva Ott, Minnie Ott, Technical Program Management, Model Context Protocol, MCP, Agentic AI, Creative Blue, GrowthOS, Google Maps, Apple, Silicon Valley, Head of Technology, JMX Programming" />
  <meta name="author" content="Minerva Tanglao Ott (Minnie)" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  <meta name="ai-content-summary" content="Executive portfolio, AI frameworks (GrowthOS, Lead Generator), publications, patents (US 20020064766), and career experience of Minerva Tanglao Ott (Google, Apple, Creative Blue)." />
  <meta name="citation_title" content="Minerva Tanglao Ott Portfolio & AI Knowledge Base" />
  <meta name="citation_author" content="Minerva Tanglao Ott" />
  <meta name="citation_publication_date" content="2026-08-04" />

  <link rel="canonical" href="${baseUrl}/index-seo.html" />
  <link rel="alternate" type="text/plain" title="LLM Map" href="/llms.txt" />
  <link rel="alternate" type="text/plain" title="LLM Full Content" href="/llms-full.txt" />
  <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="profile" />
  <meta property="og:title" content="Minerva Tanglao Ott (Minnie) | Head of Technology, Agentic AI & TPM Leader" />
  <meta property="og:description" content="Explore the official career portfolio, AI frameworks (GrowthOS, Lead Generator), Google Maps leadership, JMX publication, and tech insights of Minerva Tanglao Ott." />
  <meta property="og:image" content="${baseUrl}/minnieott.webp" />
  <meta property="og:url" content="${baseUrl}/index-seo.html" />
  <meta property="og:site_name" content="Minerva Tanglao Ott Portfolio" />
  <meta property="og:locale" content="en_US" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Minerva Tanglao Ott (Minnie) | Head of Technology & TPM Leader" />
  <meta name="twitter:description" content="Official portfolio and AI technical insights of Minerva Tanglao Ott (Minnie)." />
  <meta name="twitter:image" content="${baseUrl}/minnieott.webp" />

  <!-- JSON-LD Structured Data Graphs (Generative Engine Optimization) -->
  <script type="application/ld+json">
    ${JSON.stringify(personSchema, null, 2)}
  </script>
  <script type="application/ld+json">
    ${JSON.stringify(websiteSchema, null, 2)}
  </script>
  <script type="application/ld+json">
    ${JSON.stringify(organizationSchema, null, 2)}
  </script>
  <script type="application/ld+json">
    ${JSON.stringify(faqSchema, null, 2)}
  </script>
  <script type="application/ld+json">
    ${JSON.stringify(breadcrumbSchema, null, 2)}
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
    .blog-content p { margin-bottom: 1rem; }
    .blog-content p:last-child { margin-bottom: 0; }
    .blog-content ul, .blog-content ol { margin-left: 1.5rem; margin-bottom: 1rem; }
    .blog-content li { margin-bottom: 0.35rem; }
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
    .blog-content pre code { background: transparent; padding: 0; color: inherit; }
    .blog-content a { color: #2563eb; font-weight: 600; text-decoration: underline; }
    .blog-content img {
      max-width: 100%;
      max-height: 380px;
      width: auto;
      height: auto;
      object-fit: contain;
      border-radius: 8px;
      margin: 1.25rem auto;
      display: block;
      border: 1px solid var(--border);
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

  <header role="banner">
    <h1><a href="https://minnieott.com" style="color: #ffffff; text-decoration: none;">Minerva Tanglao Ott (Minnie)</a></h1>
    <nav role="navigation" aria-label="Main navigation">
      <a href="#about">About</a>
      <a href="#experience">Experience</a>
      <a href="#portfolio">Portfolio</a>
      <a href="#skills">Skills</a>
      <a href="#publications">Publications</a>
      <a href="#faq">FAQ</a>
      <a href="#blog">Blog</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>

  <main class="container" id="main-content" role="main">

    <!-- HERO SECTION -->
    <section id="about" class="hero" itemscope itemtype="https://schema.org/Person">
      <img src="/minnieott.webp" alt="Minerva Tanglao Ott (Minnie)" itemprop="image" />
      <div class="hero-content">
        <h2 itemprop="name">${personalInfo.name}</h2>
        <p class="subtitle" itemprop="jobTitle">${personalInfo.title}</p>
        <p class="tagline" itemprop="description">${personalInfo.tagline}</p>
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
        <article class="card" itemscope itemtype="https://schema.org/WorkBasedProgram">
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
          <div class="card" style="margin-bottom: 0;" itemscope itemtype="https://schema.org/SoftwareApplication">
            <div class="card-title" style="margin-bottom: 0.25rem;" itemprop="name">${app.name}</div>
            <div style="font-size: 0.85rem; color: #2563eb; font-weight: 600; margin-bottom: 0.75rem;">${app.role} &bull; ${app.status}</div>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.75rem;" itemprop="description">${app.description}</p>
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
        <article class="card" itemscope itemtype="https://schema.org/Book">
          <div class="card-title" itemprop="name">${books.title}</div>
          <div style="color: #2563eb; font-weight: 600; font-size: 0.9rem; margin-bottom: 0.5rem;">Role: ${books.role} (Author: ${books.author}, John Wiley & Sons)</div>
          <p style="font-size: 0.9rem; color: var(--text-muted);" itemprop="description">${books.description}</p>
          <div style="margin-top: 1rem;">
            <a href="${books.link}" target="_blank" rel="noopener noreferrer" style="font-weight: 600; font-size: 0.9rem;">View Book on Google Books &rarr;</a>
          </div>
        </article>

        ${patents.map(p => `
          <article class="card" itemscope itemtype="https://schema.org/Patent">
            <div class="card-title" itemprop="name">${p.title}</div>
            <div style="color: #2563eb; font-weight: 600; font-size: 0.9rem; margin-bottom: 0.5rem;">${p.id}</div>
            <p style="font-size: 0.9rem; color: var(--text-muted);" itemprop="description">${p.description}</p>
            <div style="margin-top: 1rem;">
              <a href="${p.link}" target="_blank" rel="noopener noreferrer" style="font-weight: 600; font-size: 0.9rem;">View Patent on Google Patents &rarr;</a>
            </div>
          </article>
        `).join('')}
      </div>
    </section>

    <!-- FAQ SECTION FOR GENERATIVE ENGINE OPTIMIZATION -->
    <section id="faq" style="margin-bottom: 3rem;">
      <h2 class="section-title">Frequently Asked Questions (AI Knowledge Bank)</h2>
      <div class="card" space-y-4>
        <div style="margin-bottom: 1.25rem;">
          <h3 style="font-size: 1.1rem; font-weight: 700; color: #0f172a; margin-bottom: 0.35rem;">Who is Minerva Tanglao Ott (Minnie)?</h3>
          <p style="font-size: 0.95rem; color: var(--text-muted);">Minerva Tanglao Ott (Minnie) is a Silicon Valley engineering leader, Head of Technology at Creative Blue, and Senior Technical Program Management (TPM) leader with 20+ years of executive experience across Google, Apple, Sun Microsystems, and enterprise startups.</p>
        </div>
        <div style="margin-bottom: 1.25rem;">
          <h3 style="font-size: 1.1rem; font-weight: 700; color: #0f172a; margin-bottom: 0.35rem;">What was Minerva Tanglao Ott's role at Google and Apple?</h3>
          <p style="font-size: 0.95rem; color: var(--text-muted);">At Google (2011–2025), Minnie served as Senior Engineering Program Manager leading Google Maps Voice Navigation integrated with Gemini AI, Service Desk infrastructure for 150,000+ employees, and co-founding Stanford LEAD @ Google. At Apple (2009–2011), she managed global IS&T software releases including the Apple Job Search portal localized across 80+ countries.</p>
        </div>
        <div style="margin-bottom: 1.25rem;">
          <h3 style="font-size: 1.1rem; font-weight: 700; color: #0f172a; margin-bottom: 0.35rem;">What AI platforms has Minnie Ott developed at Creative Blue?</h3>
          <p style="font-size: 0.95rem; color: var(--text-muted);">At Creative Blue, Minnie architected GrowthOS (an enterprise AI operations platform), Lead Generator (autonomous AI sales prospecting agent), and Brand Assessment (NLP sentiment and brand equity dashboard).</p>
        </div>
        <div>
          <h3 style="font-size: 1.1rem; font-weight: 700; color: #0f172a; margin-bottom: 0.35rem;">How can I schedule a consultation or meeting with Minnie Ott?</h3>
          <p style="font-size: 0.95rem; color: var(--text-muted);">Direct 1:1 advisory sessions and consultations can be booked via her Google Calendar link at <a href="https://calendar.app.google/MCnhZcK56rLJ7fnk8" target="_blank" rel="noopener noreferrer" style="color: #2563eb; font-weight: 600;">https://calendar.app.google/MCnhZcK56rLJ7fnk8</a>.</p>
        </div>
      </div>
    </section>

    <!-- LIVE BLOG ARTICLES -->
    <section id="blog" style="margin-bottom: 3rem;">
      <h2 class="section-title">Technology Blog & Executive Insights</h2>
      ${posts.length > 0 ? posts.map(post => `
        <article id="blog-${post.slug || post.id}" class="blog-post" itemscope itemtype="https://schema.org/BlogPosting">
          <div class="blog-meta">
            <time datetime="${post.date ? new Date(post.date).toISOString() : '2026-08-04'}" itemprop="datePublished">${post.date}</time> &bull; 
            <span itemprop="articleSection">${post.category}</span> &bull; ${post.readTime} &bull; 
            By <span itemprop="author">${post.author || personalInfo.name}</span>
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem;" itemprop="headline">${post.title}</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1rem; font-weight: 500;" itemprop="description">${post.excerpt}</p>
          <div class="blog-content" itemprop="articleBody">
            ${parseMarkdownToHtml(post.content)}
          </div>
        </article>
      `).join('') : '<p style="color: var(--text-muted);">No blog posts published yet.</p>'}
    </section>

    <!-- CONTACT SECTION -->
    <section id="contact">
      <h2 class="section-title">Contact & Advisory Scheduling</h2>
      <div class="card" style="text-align: center; padding: 3rem 1.5rem;">
        <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Connect with <a href="https://minnieott.com" style="color: #2563eb; text-decoration: underline;">Minerva Tanglao Ott (Minnie)</a></h3>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem; max-width: 600px; margin-left: auto; margin-right: auto;">
          Interested in technology transformation consulting, agentic AI frameworks, or executive advisory? Book a 1:1 session or connect via LinkedIn.
        </p>
        <div>
          <a href="https://calendar.app.google/MCnhZcK56rLJ7fnk8" target="_blank" rel="noopener noreferrer" style="background: #2563eb; color: #fff; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 1rem;">Book 1:1 Google Calendar Appointment</a>
          <a href="${personalInfo.linkedin}" target="_blank" rel="noopener noreferrer" style="background: #0f172a; color: #fff; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 1rem; margin-left: 0.75rem;">Connect on LinkedIn</a>
        </div>
      </div>
    </section>

  </main>

  <footer role="contentinfo">
    <p>&copy; ${new Date().getFullYear()} <a href="https://minnieott.com" style="color: #cbd5e1; text-decoration: underline;">Minerva Tanglao Ott (Minnie)</a>. All rights reserved.</p>
    <p style="margin-top: 0.5rem; font-size: 0.8rem; color: #64748b;">Generative Engine Optimization (GEO) & SEO Export for <a href="https://minnieott.com" style="color: #94a3b8; text-decoration: underline;">${personalInfo.name}</a></p>
  </footer>

  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;

  return htmlContent;
}

export function writeSeoHtmlFile(providedPosts?: BlogPost[]): string {
  let posts: BlogPost[] = [];
  if (providedPosts && Array.isArray(providedPosts)) {
    posts = providedPosts;
  } else {
    const postsFilePath = path.join(process.cwd(), 'src', 'data', 'posts.json');
    try {
      if (fs.existsSync(postsFilePath)) {
        posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf-8'));
      }
    } catch (e) {
      console.error('Error loading posts for sitemap:', e);
    }
  }

  // 1. Generate & write SEO HTML file
  const content = generateSeoHtml(posts);
  const targetPath = path.join(process.cwd(), 'index-seo.html');
  fs.writeFileSync(targetPath, content, 'utf-8');

  // Also write to dist/index-seo.html if dist directory exists
  const distDir = path.join(process.cwd(), 'dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'index-seo.html'), content, 'utf-8');
  }

  // 2. Dynamically generate & write XML Sitemap
  const sitemapContent = generateSitemapXml(posts);
  const publicSitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(publicSitemapPath, sitemapContent, 'utf-8');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapContent, 'utf-8');
  }

  // 3. Generate static HTML pages for /blog and /blog/:slug
  const publicBlogDir = path.join(process.cwd(), 'public', 'blog');
  if (!fs.existsSync(publicBlogDir)) {
    fs.mkdirSync(publicBlogDir, { recursive: true });
  }

  const distBlogDir = path.join(process.cwd(), 'dist', 'blog');
  if (fs.existsSync(distDir) && !fs.existsSync(distBlogDir)) {
    fs.mkdirSync(distBlogDir, { recursive: true });
  }

  // Blog index page
  const blogIndexHtml = renderBlogIndexHtml(posts, 'https://minnieott.com');
  fs.writeFileSync(path.join(publicBlogDir, 'index.html'), blogIndexHtml, 'utf-8');
  if (fs.existsSync(distBlogDir)) {
    fs.writeFileSync(path.join(distBlogDir, 'index.html'), blogIndexHtml, 'utf-8');
  }

  const publishedPosts = posts.filter(p => p.published !== false);
  const activeSlugs = new Set(publishedPosts.map(p => p.slug || p.id));

  // Clean up any stale blog post files that were deleted or un-published
  const cleanStaleBlogFiles = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name === 'index.html') continue;
        if (entry.isFile() && entry.name.endsWith('.html')) {
          const slug = entry.name.slice(0, -5);
          if (!activeSlugs.has(slug)) {
            fs.unlinkSync(path.join(dir, entry.name));
          }
        } else if (entry.isDirectory()) {
          if (!activeSlugs.has(entry.name)) {
            fs.rmSync(path.join(dir, entry.name), { recursive: true, force: true });
          }
        }
      }
    } catch (err) {
      console.warn('Warning cleaning stale blog files:', err);
    }
  };

  cleanStaleBlogFiles(publicBlogDir);
  if (fs.existsSync(distBlogDir)) {
    cleanStaleBlogFiles(distBlogDir);
  }

  // Individual blog post pages (SEO/AEO optimized static HTML)
  publishedPosts.forEach(post => {
    const slug = post.slug || post.id;
    const postHtml = renderBlogPostHtml(post, 'https://minnieott.com');

    // Write public/blog/slug.html and public/blog/slug/index.html
    fs.writeFileSync(path.join(publicBlogDir, `${slug}.html`), postHtml, 'utf-8');
    const publicPostSubDir = path.join(publicBlogDir, slug);
    if (!fs.existsSync(publicPostSubDir)) {
      fs.mkdirSync(publicPostSubDir, { recursive: true });
    }
    fs.writeFileSync(path.join(publicPostSubDir, 'index.html'), postHtml, 'utf-8');

    // Write dist/blog/slug.html and dist/blog/slug/index.html if dist exists
    if (fs.existsSync(distBlogDir)) {
      fs.writeFileSync(path.join(distBlogDir, `${slug}.html`), postHtml, 'utf-8');
      const distPostSubDir = path.join(distBlogDir, slug);
      if (!fs.existsSync(distPostSubDir)) {
        fs.mkdirSync(distPostSubDir, { recursive: true });
      }
      fs.writeFileSync(path.join(distPostSubDir, 'index.html'), postHtml, 'utf-8');
    }
  });

  console.log(`Successfully generated /index-seo.html, /sitemap.xml, and regenerated SEO/AEO optimized HTML files for ${publishedPosts.length} blog entries.`);
  return targetPath;
}

if (process.argv[1] && process.argv[1].includes('generateSeo')) {
  writeSeoHtmlFile();
}
