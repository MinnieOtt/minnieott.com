# Agent Guidelines & Persistent Rules

## Blog Content Preservation
- **Do Not Alter Blog Content**: Never overwrite, modify, rewrite, truncate, or reset existing blog articles, titles, slugs, excerpts, dates, or body content in `src/data/posts.json`, `src/lib/blogSsr.ts`, Firestore, or database storage during deployments, feature additions, or codebase refactors.
- **Durable Persistence**: All blog post edits, creations, and deletions made through the Author Studio or stored in persistence must remain intact across applet rebuilds and deployments.
