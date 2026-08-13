import { marked } from 'marked';

export interface BlogPost {
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

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function parseMarkdownToHtml(text: string): string {
  if (!text) return '';
  try {
    return marked.parse(text, { async: false }) as string;
  } catch (e) {
    let html = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, url) => {
      const isInternal = url.startsWith('#');
      return `<a href="${url}" ${isInternal ? '' : 'target="_blank" rel="noopener noreferrer"'}>${label}</a>`;
    });
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    return html;
  }
}

export function renderBlogPostHtml(post: BlogPost, baseUrl = 'https://minnieott.com'): string {
  const postSlug = post.slug || post.id;
  const postUrl = `${baseUrl}/blog/${postSlug}`;
  const parsedContent = parseMarkdownToHtml(post.content || '');
  const publishedDateIso = post.date ? new Date(post.date).toISOString().split('T')[0] : '2026-07-23';

  // Article BlogPosting Schema
  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': postUrl,
    'headline': post.title,
    'description': post.excerpt,
    'articleBody': (post.content || '').replace(/<[^>]*>/g, '').substring(0, 5000),
    'author': {
      '@type': 'Person',
      'name': post.author || 'Minerva Tanglao Ott (Minnie)',
      '@id': `${baseUrl}/#person`
    },
    'publisher': {
      '@type': 'Person',
      'name': 'Minerva Tanglao Ott (Minnie)',
      '@id': `${baseUrl}/#person`
    },
    'datePublished': publishedDateIso,
    'dateModified': publishedDateIso,
    'url': postUrl,
    'mainEntityOfPage': postUrl,
    'keywords': [post.category || 'Technology', 'Agentic AI', 'Engineering Leadership', 'Technical Program Management']
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${baseUrl}/` },
      { '@type': 'ListItem', 'position': 2, 'name': 'Blog & Insights', 'item': `${baseUrl}/blog` },
      { '@type': 'ListItem', 'position': 3, 'name': post.title, 'item': postUrl }
    ]
  };

  return `<!DOCTYPE html>
<html lang="en" itemscope itemtype="https://schema.org/Article">
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

  <!-- Primary Metadata -->
  <title>${escapeHtml(post.title)} | Minerva Tanglao Ott (Minnie)</title>
  <meta name="description" content="${escapeHtml(post.excerpt)}" />
  <meta name="author" content="${escapeHtml(post.author || 'Minerva Tanglao Ott (Minnie)')}" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

  <link rel="canonical" href="${postUrl}" />
  <link rel="alternate" type="text/plain" title="LLM Map" href="/llms.txt" />
  <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />

  <!-- Open Graph / Social -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeHtml(post.title)}" />
  <meta property="og:description" content="${escapeHtml(post.excerpt)}" />
  <meta property="og:image" content="${baseUrl}/minnieott.webp" />
  <meta property="og:url" content="${postUrl}" />
  <meta property="article:published_time" content="${publishedDateIso}" />
  <meta property="article:author" content="${escapeHtml(post.author || 'Minerva Tanglao Ott')}" />
  <meta property="article:section" content="${escapeHtml(post.category || 'Technology')}" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(post.title)}" />
  <meta name="twitter:description" content="${escapeHtml(post.excerpt)}" />
  <meta name="twitter:image" content="${baseUrl}/minnieott.webp" />

  <!-- JSON-LD Structured Data for AI & Search Engines -->
  <script type="application/ld+json">
    ${JSON.stringify(blogPostingSchema, null, 2)}
  </script>
  <script type="application/ld+json">
    ${JSON.stringify(breadcrumbSchema, null, 2)}
  </script>

  <style>
    :root {
      --bg: #faf8f5;
      --card-bg: #ffffff;
      --text: #0f172a;
      --text-muted: #475569;
      --border: #e2e8f0;
      --accent: #2563eb;
      --accent-light: #eff6ff;
    }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.7;
      color: var(--text);
      background-color: var(--bg);
      margin: 0;
      padding: 0;
    }
    header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 50;
      padding: 1rem 1.5rem;
    }
    .header-content {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--text);
      text-decoration: none;
    }
    .nav-links {
      display: flex;
      gap: 1.25rem;
      font-size: 0.9rem;
    }
    .nav-links a {
      color: var(--text-muted);
      text-decoration: none;
      font-weight: 500;
    }
    .nav-links a:hover {
      color: var(--accent);
    }
    main {
      max-width: 820px;
      margin: 2.5rem auto;
      padding: 0 1.5rem 4rem 1.5rem;
    }
    .breadcrumb {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 1.5rem;
    }
    .breadcrumb a {
      color: var(--accent);
      text-decoration: none;
    }
    .post-badge {
      display: inline-block;
      background: var(--accent-light);
      color: var(--accent);
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    h1.post-title {
      font-size: 2.25rem;
      line-height: 1.25;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 1rem 0;
      letter-spacing: -0.02em;
    }
    .post-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.9rem;
      color: var(--text-muted);
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 2rem;
    }
    .excerpt-box {
      background: var(--card-bg);
      border-left: 4px solid var(--accent);
      padding: 1.25rem;
      border-radius: 0 8px 8px 0;
      font-size: 1.1rem;
      color: #334155;
      margin-bottom: 2rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .article-body {
      font-size: 1.05rem;
      line-height: 1.8;
      color: #334155;
      background: var(--card-bg);
      padding: 2.5rem;
      border-radius: 12px;
      border: 1px solid var(--border);
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    .article-body h2 {
      font-size: 1.6rem;
      font-weight: 700;
      color: #0f172a;
      margin-top: 2.25rem;
      margin-bottom: 0.75rem;
      letter-spacing: -0.01em;
    }
    .article-body h3 {
      font-size: 1.3rem;
      font-weight: 600;
      color: #1e293b;
      margin-top: 1.75rem;
      margin-bottom: 0.5rem;
    }
    .article-body p {
      margin-bottom: 1.25rem;
    }
    .article-body ul, .article-body ol {
      margin-bottom: 1.25rem;
      padding-left: 1.5rem;
    }
    .article-body li {
      margin-bottom: 0.5rem;
    }
    .article-body blockquote {
      border-left: 4px solid #cbd5e1;
      margin: 1.5rem 0;
      padding-left: 1rem;
      color: #475569;
      font-style: italic;
    }
    .article-body pre {
      background: #0f172a;
      color: #f8fafc;
      padding: 1.25rem;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 0.9rem;
    }
    .article-body img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 1.5rem 0;
      border: 1px solid var(--border);
    }
    .article-body a {
      color: var(--accent);
      text-decoration: underline;
      font-weight: 600;
    }
    .author-card {
      margin-top: 3rem;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 2rem;
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }
    .author-avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      object-fit: cover;
    }
    .author-info h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1.1rem;
      color: #0f172a;
    }
    .author-info p {
      margin: 0;
      font-size: 0.9rem;
      color: var(--text-muted);
    }
    .cta-buttons {
      margin-top: 1rem;
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-block;
      padding: 0.6rem 1.2rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.875rem;
      text-decoration: none;
    }
    .btn-primary {
      background: var(--accent);
      color: white;
    }
    .btn-secondary {
      background: #0f172a;
      color: white;
    }
    footer {
      text-align: center;
      padding: 2.5rem 1rem;
      color: var(--text-muted);
      font-size: 0.85rem;
      border-top: 1px solid var(--border);
      margin-top: 4rem;
    }
  </style>
</head>
<body>
  <header role="banner">
    <div class="header-content">
      <a href="/" class="logo">Minerva Tanglao Ott (Minnie)</a>
      <nav class="nav-links" aria-label="Main Navigation">
        <a href="/blog">&larr; All Articles</a>
        <a href="/work">Work</a>
        <a href="/contact">Contact</a>
      </nav>
    </div>
  </header>

  <main role="main">
    <div class="breadcrumb">
      <a href="/">Home</a> &gt; <a href="/blog">Blog</a> &gt; <span>${escapeHtml(post.title)}</span>
    </div>

    <article itemscope itemtype="https://schema.org/BlogPosting">
      <span class="post-badge">${escapeHtml(post.category || 'Technology')}</span>
      <h1 class="post-title" itemprop="headline">${escapeHtml(post.title)}</h1>

      <div class="post-meta">
        <span itemprop="author">${escapeHtml(post.author || 'Minerva Tanglao Ott (Minnie)')}</span> &bull;
        <time datetime="${publishedDateIso}" itemprop="datePublished">${escapeHtml(post.date)}</time> &bull;
        <span>${escapeHtml(post.readTime || '5 min read')}</span>
      </div>

      ${post.excerpt ? `<div class="excerpt-box" itemprop="description">${escapeHtml(post.excerpt)}</div>` : ''}

      <div class="article-body" itemprop="articleBody">
        ${parsedContent}
      </div>
    </article>

    <div class="author-card">
      <img src="/minnieott.webp" alt="Minerva Tanglao Ott" class="author-avatar" />
      <div class="author-info">
        <h3>Minerva Tanglao Ott (Minnie)</h3>
        <p>Head of Technology at Creative Blue &bull; Former Sr. Engineering Program Manager at Google & Apple. Leader in Agentic AI, Model Context Protocol, and enterprise SDLC transformations.</p>
        <div class="cta-buttons">
          <a href="https://calendar.app.google/MCnhZcK56rLJ7fnk8" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Book 1:1 Appointment</a>
          <a href="https://www.linkedin.com/in/minnieott/" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">Connect on LinkedIn</a>
        </div>
      </div>
    </div>
  </main>

  <footer>
    <p>&copy; ${new Date().getFullYear()} Minerva Tanglao Ott (Minnie). All rights reserved.</p>
  </footer>

  <!-- React Client Hydration Root -->
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;
}

export function renderBlogIndexHtml(posts: BlogPost[], baseUrl = 'https://minnieott.com'): string {
  const publishedPosts = posts.filter(p => p.published !== false);

  const blogListSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${baseUrl}/blog`,
    'name': 'Minerva Tanglao Ott (Minnie) - Executive Technology Blog',
    'description': 'Articles on Agentic AI, Model Context Protocol, scaling engineering teams, and enterprise technology transformations by Minerva Tanglao Ott.',
    'url': `${baseUrl}/blog`,
    'publisher': {
      '@type': 'Person',
      'name': 'Minerva Tanglao Ott (Minnie)',
      '@id': `${baseUrl}/#person`
    },
    'blogPost': publishedPosts.map(p => ({
      '@type': 'BlogPosting',
      'headline': p.title,
      'description': p.excerpt,
      'url': `${baseUrl}/blog/${p.slug || p.id}`,
      'datePublished': p.date ? new Date(p.date).toISOString().split('T')[0] : '2026-07-23'
    }))
  };

  return `<!DOCTYPE html>
<html lang="en" itemscope itemtype="https://schema.org/Blog">
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

  <!-- Primary Metadata -->
  <title>Blog & Executive Technology Insights | Minerva Tanglao Ott (Minnie)</title>
  <meta name="description" content="Official technical publications and executive insights by Minerva Tanglao Ott (Minnie), Head of Technology at Creative Blue & former Sr. TPM at Google & Apple." />
  <meta name="author" content="Minerva Tanglao Ott (Minnie)" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

  <link rel="canonical" href="${baseUrl}/blog" />
  <link rel="alternate" type="text/plain" title="LLM Map" href="/llms.txt" />
  <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Blog & Executive Technology Insights | Minerva Tanglao Ott" />
  <meta property="og:description" content="Explore publications on Agentic AI, Model Context Protocol, scaling engineering teams, and enterprise systems by Minerva Tanglao Ott." />
  <meta property="og:image" content="${baseUrl}/minnieott.webp" />
  <meta property="og:url" content="${baseUrl}/blog" />

  <!-- JSON-LD -->
  <script type="application/ld+json">
    ${JSON.stringify(blogListSchema, null, 2)}
  </script>

  <style>
    :root {
      --bg: #faf8f5;
      --card-bg: #ffffff;
      --text: #0f172a;
      --text-muted: #475569;
      --border: #e2e8f0;
      --accent: #2563eb;
      --accent-light: #eff6ff;
    }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.7;
      color: var(--text);
      background-color: var(--bg);
      margin: 0;
      padding: 0;
    }
    header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 50;
      padding: 1rem 1.5rem;
    }
    .header-content {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--text);
      text-decoration: none;
    }
    .nav-links {
      display: flex;
      gap: 1.25rem;
      font-size: 0.9rem;
    }
    .nav-links a {
      color: var(--text-muted);
      text-decoration: none;
      font-weight: 500;
    }
    .nav-links a:hover {
      color: var(--accent);
    }
    main {
      max-width: 900px;
      margin: 2.5rem auto;
      padding: 0 1.5rem 4rem 1.5rem;
    }
    .page-title {
      font-size: 2.25rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.02em;
    }
    .page-subtitle {
      font-size: 1.1rem;
      color: var(--text-muted);
      margin-bottom: 2.5rem;
    }
    .posts-grid {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }
    .post-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 2rem;
      transition: box-shadow 0.2s ease, border-color 0.2s ease;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    .post-card:hover {
      border-color: #cbd5e1;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .post-card-meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 0.75rem;
    }
    .post-category {
      background: var(--accent-light);
      color: var(--accent);
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .post-card-title {
      font-size: 1.4rem;
      font-weight: 700;
      margin: 0 0 0.75rem 0;
      line-height: 1.3;
    }
    .post-card-title a {
      color: #0f172a;
      text-decoration: none;
    }
    .post-card-title a:hover {
      color: var(--accent);
    }
    .post-card-excerpt {
      color: var(--text-muted);
      font-size: 1rem;
      margin-bottom: 1.25rem;
      line-height: 1.6;
    }
    .read-more {
      color: var(--accent);
      font-weight: 600;
      text-decoration: none;
      font-size: 0.95rem;
    }
    .read-more:hover {
      text-decoration: underline;
    }
    footer {
      text-align: center;
      padding: 2.5rem 1rem;
      color: var(--text-muted);
      font-size: 0.85rem;
      border-top: 1px solid var(--border);
      margin-top: 4rem;
    }
  </style>
</head>
<body>
  <header role="banner">
    <div class="header-content">
      <a href="/" class="logo">Minerva Tanglao Ott (Minnie)</a>
      <nav class="nav-links" aria-label="Main Navigation">
        <a href="/">Home</a>
        <a href="/work">Work</a>
        <a href="/contact">Contact</a>
      </nav>
    </div>
  </header>

  <main role="main">
    <h1 class="page-title">Technology Blog & Executive Insights</h1>
    <p class="page-subtitle">Articles on Agentic AI, Model Context Protocol, scaling engineering teams, and enterprise technology transformations by Minerva Tanglao Ott.</p>

    <div class="posts-grid">
      ${publishedPosts.map(post => `
        <article class="post-card" itemscope itemtype="https://schema.org/BlogPosting">
          <div class="post-card-meta">
            <span class="post-category">${escapeHtml(post.category || 'Technology')}</span> &bull;
            <time datetime="${post.date ? new Date(post.date).toISOString().split('T')[0] : '2026-07-23'}" itemprop="datePublished">${escapeHtml(post.date)}</time> &bull;
            <span>${escapeHtml(post.readTime || '5 min read')}</span>
          </div>
          <h2 class="post-card-title" itemprop="headline">
            <a href="/blog/${post.slug || post.id}">${escapeHtml(post.title)}</a>
          </h2>
          <p class="post-card-excerpt" itemprop="description">${escapeHtml(post.excerpt)}</p>
          <a href="/blog/${post.slug || post.id}" class="read-more">Read Full Article &rarr;</a>
        </article>
      `).join('')}
    </div>
  </main>

  <footer>
    <p>&copy; ${new Date().getFullYear()} Minerva Tanglao Ott (Minnie). All rights reserved.</p>
  </footer>

  <!-- React Client Hydration Root -->
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;
}

export function renderBlog404Html(slug: string, baseUrl = 'https://minnieott.com'): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Article Not Found | Minerva Tanglao Ott (Minnie)</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #faf8f5; color: #0f172a; text-align: center; padding: 4rem 1rem; }
    h1 { font-size: 2rem; margin-bottom: 1rem; }
    p { color: #475569; margin-bottom: 2rem; }
    a { background: #2563eb; color: white; padding: 0.75rem 1.5rem; border-radius: 6px; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <h1>Article Not Found</h1>
  <p>The requested blog article "${escapeHtml(slug)}" could not be found.</p>
  <a href="/blog">&larr; Return to All Articles</a>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;
}
