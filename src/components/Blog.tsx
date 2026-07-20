import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Search, ArrowLeft, Calendar, Clock, User, Plus, Check, Send, Trash2, ShieldCheck, Lock, Unlock, Eye, Sparkles, Pencil, Linkedin, Twitter, Link, ExternalLink } from 'lucide-react';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import ReactMarkdown from 'react-markdown';

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

interface BlogProps {
  currentSlug: string | null;
  onNavigate: (path: string) => void;
}

export default function Blog({ currentSlug, onNavigate }: BlogProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copied, setCopied] = useState(false);
  
  // Admin Editor States
  const [showEditor, setShowEditor] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [idToken, setIdToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('minerva_portfolio_id_token');
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('minerva_portfolio_unlocked') === 'true';
    } catch {
      return false;
    }
  });
  const [authError, setAuthError] = useState('');
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [bypassPasscode, setBypassPasscode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const isAuthorPage = currentSlug === 'author';

  const [editingPostId, setEditingPostId] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('minerva_portfolio_editing_id');
    } catch {
      return null;
    }
  });

  // Form States
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Technology',
    readTime: '',
    author: 'Minerva Tanglao Ott (Minnie)'
  });

  const stopEditing = () => {
    try {
      sessionStorage.removeItem('minerva_portfolio_editing_id');
    } catch (e) {
      console.error(e);
    }
    setEditingPostId(null);
    setNewPost({
      title: '',
      excerpt: '',
      content: '',
      category: 'Technology',
      readTime: '',
      author: 'Minerva Tanglao Ott (Minnie)'
    });
  };

  useEffect(() => {
    if (editingPostId && posts.length > 0) {
      const postToEdit = posts.find(p => p.id === editingPostId);
      if (postToEdit) {
        setNewPost({
          title: postToEdit.title,
          excerpt: postToEdit.excerpt,
          content: postToEdit.content,
          category: postToEdit.category,
          readTime: postToEdit.readTime,
          author: postToEdit.author
        });
        setShowEditor(true);
      }
    }
  }, [editingPostId, posts]);

  useEffect(() => {
    fetchPosts();

    // Firebase Auth State Listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.email === 'minnie.ott@gmail.com') {
          try {
            const token = await user.getIdToken();
            setCurrentUser(user);
            setIdToken(token);
            setIsAuthenticated(true);
            sessionStorage.setItem('minerva_portfolio_unlocked', 'true');
            sessionStorage.setItem('minerva_portfolio_id_token', token);
          } catch (err) {
            console.error('Error getting ID token:', err);
          }
        } else {
          // Unrecognized user - sign them out immediately
          await firebaseSignOut(auth);
          setCurrentUser(null);
          setIdToken(null);
          setIsAuthenticated(false);
          setAuthError('Access Denied: Only Minerva Tanglao Ott (Minnie) is authorized to access the Workspace.');
          sessionStorage.removeItem('minerva_portfolio_unlocked');
          sessionStorage.removeItem('minerva_portfolio_id_token');
        }
      } else {
        setCurrentUser(null);
        setIdToken(null);
        setIsAuthenticated(false);
        sessionStorage.removeItem('minerva_portfolio_unlocked');
        sessionStorage.removeItem('minerva_portfolio_id_token');
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/posts');
      if (!res.ok) throw new Error('Failed to load blog posts');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err: any) {
      setError(err.message || 'Error loading posts');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    setUnauthorizedDomain(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (user.email === 'minnie.ott@gmail.com') {
        const token = await user.getIdToken();
        setCurrentUser(user);
        setIdToken(token);
        setIsAuthenticated(true);
        sessionStorage.setItem('minerva_portfolio_unlocked', 'true');
        sessionStorage.setItem('minerva_portfolio_id_token', token);
      } else {
        await firebaseSignOut(auth);
        setAuthError('Access Denied: Only Minerva Tanglao Ott (Minnie) is authorized to access the Workspace.');
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.code === 'auth/unauthorized-domain' || (err.message && err.message.includes('auth/unauthorized-domain'))) {
        setUnauthorizedDomain(window.location.hostname);
        setAuthError('Firebase Authentication Error: This sandbox domain is not in your authorized domains list.');
      } else {
        setAuthError(err.message || 'Failed to authenticate with Google.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Error signing out:', err);
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIdToken(null);
    try {
      sessionStorage.removeItem('minerva_portfolio_unlocked');
      sessionStorage.removeItem('minerva_portfolio_id_token');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) {
      alert('Title and Content are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
      } else {
        headers['X-Admin-Passcode'] = 'minnie';
      }

      const url = editingPostId ? `/api/posts/${editingPostId}` : '/api/posts';
      const method = editingPostId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(newPost)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `Failed to ${editingPostId ? 'save' : 'publish'} post`);
      }

      const data = await res.json();
      setPosts(data.posts || []);
      setSubmitSuccess(true);
      
      // Reset form and editing state
      stopEditing();

      setTimeout(() => {
        setSubmitSuccess(false);
        if (!isAuthorPage) {
          setShowEditor(false);
        }
      }, 2000);

    } catch (err: any) {
      alert(err.message || 'Failed to save article.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this blog post?')) return;
    
    const headers: Record<string, string> = {};
    if (idToken) {
      headers['Authorization'] = `Bearer ${idToken}`;
    } else {
      const passcode = prompt('Please enter your administrator passcode to confirm deletion:');
      if (!passcode) return;
      headers['X-Admin-Passcode'] = passcode;
    }

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete post');
      }

      const data = await res.json();
      setPosts(data.posts || []);
      
      // If we are currently reading this post, navigate back to list
      if (currentSlug && currentSlug !== 'author') {
        onNavigate('/blog');
      }
    } catch (err: any) {
      alert(err.message || 'Unauthorized or failed to delete.');
    }
  };

  // Extract categories from existing posts
  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const activePost = currentSlug ? posts.find(p => p.slug === currentSlug) : null;

  // Simple clean renderer that converts paragraphs and headings using markdown
  const renderFormattedContent = (content: string) => {
    return (
      <div className="markdown-body text-left">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="font-display font-bold text-gray-900 dark:text-gray-100 text-2xl sm:text-3xl tracking-tight mt-8 mb-4">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="font-display font-bold text-gray-900 dark:text-gray-100 text-xl sm:text-2xl tracking-tight mt-8 mb-4">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="font-display font-bold text-gray-900 dark:text-gray-100 text-lg sm:text-xl tracking-tight mt-6 mb-3">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="font-sans text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-4 whitespace-pre-wrap">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-5 my-4 space-y-2 text-gray-700 dark:text-gray-300 font-sans text-base leading-relaxed">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-5 my-4 space-y-2 text-gray-700 dark:text-gray-300 font-sans text-base leading-relaxed">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="font-sans text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                {children}
              </li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic text-gray-600 dark:text-gray-400 my-4">
                {children}
              </blockquote>
            ),
            code: ({ children }) => (
              <code className="bg-neutral-100 dark:bg-gray-800 text-[#3333FF] dark:text-[#A5B4FC] font-mono text-sm px-1.5 py-0.5 rounded font-semibold">
                {children}
              </code>
            ),
            a: ({ children, href }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#3333FF] dark:text-[#A5B4FC] hover:underline font-medium inline-flex items-center gap-0.5"
              >
                {children}
              </a>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div id="blog-section-container" className="pt-24 pb-16 min-h-[70vh] max-w-7xl mx-auto px-6 md:px-12">
      
      {/* Blog Detail View */}
      {activePost ? (
        <motion.article 
          id={`blog-post-${activePost.id}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Back Navigation */}
          <button
            id="blog-back-btn"
            onClick={() => onNavigate('/blog')}
            className="group flex items-center gap-2 text-sm text-gray-500 hover:text-gray-950 font-medium mb-8 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </button>

          {/* Post Header */}
          <header className="border-b border-gray-100 pb-8 mb-8 text-left">
            <span className="inline-block text-[10px] bg-accent-light text-gray-900 font-mono font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              {activePost.category}
            </span>
            <h1 className="font-display font-bold text-gray-900 text-3xl sm:text-4xl tracking-tight leading-tight">
              {activePost.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 mt-6 text-xs font-mono text-gray-500">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#3333FF]" />
                <span>{activePost.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{activePost.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{activePost.readTime}</span>
              </div>
              {isAuthenticated && (
                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingPostId(activePost.id);
                      onNavigate('/blog/author');
                    }}
                    className="text-[#3333FF] hover:text-[#1A1AFF] flex items-center gap-1.5 cursor-pointer font-bold border border-[#C9DFCE] bg-[#E4F0E7]/30 hover:bg-[#E4F0E7] px-3 py-1 rounded-md text-xs transition-all"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeletePost(activePost.id)}
                    className="text-rose-500 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer font-bold border border-rose-100 bg-rose-50/30 hover:bg-rose-50 px-3 py-1 rounded-md text-xs transition-all"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* Post Content */}
          <div className="prose max-w-none text-left">
            {renderFormattedContent(activePost.content)}
          </div>

          {/* Social Share Panel */}
          <div className="mt-12 p-6 bg-neutral-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div>
              <h4 className="font-display font-bold text-gray-950 text-sm">Enjoyed this article?</h4>
              <p className="font-sans text-xs text-gray-500 mt-1">Share it with your professional network or developer community.</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + '/blog/' + activePost.slug)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white border border-gray-200 hover:border-[#0077b5] text-gray-500 hover:text-[#0077b5] flex items-center justify-center transition-all duration-200 hover:scale-[1.05] cursor-pointer"
                title="Share on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin + '/blog/' + activePost.slug)}&text=${encodeURIComponent(activePost.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white border border-gray-200 hover:border-[#1DA1F2] text-gray-500 hover:text-[#1DA1F2] flex items-center justify-center transition-all duration-200 hover:scale-[1.05] cursor-pointer"
                title="Share on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + '/blog/' + activePost.slug);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-white border border-gray-200 text-[#3333FF] hover:text-[#1A1AFF] hover:border-gray-300 transition-all duration-200 hover:scale-[1.03] text-xs font-sans font-medium cursor-pointer"
                title="Copy article link"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                    <span className="text-emerald-600 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Link className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer of Post */}
          <footer className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-150 bg-neutral-50 shrink-0 shadow-2xs">
                <img
                  src="/minnieott.jpg"
                  alt={activePost.author}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback: hide the image element and let the text container align normally if not available
                    e.currentTarget.parentElement?.remove();
                  }}
                />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-mono">WRITTEN BY</p>
                <h4 className="font-display font-normal text-gray-900 text-sm mt-1">{activePost.author}</h4>
                <p className="text-xs text-gray-500 mt-0.5">Technology Transformation Leader</p>
              </div>
            </div>
            
            <button
              onClick={() => onNavigate('/blog')}
              className="px-5 py-2.5 rounded-xl border border-gray-200 hover:border-gray-950 font-sans font-semibold text-xs text-[#3333FF] hover:text-[#1A1AFF] transition-all cursor-pointer shadow-3xs"
            >
              See More Articles
            </button>
          </footer>
        </motion.article>
      ) : isAuthorPage ? (
        /* Author Studio Workspace View */
        <motion.div 
          id="author-workspace-view"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Back Navigation */}
          <button
            id="blog-back-btn"
            onClick={() => onNavigate('/blog')}
            className="group flex items-center gap-2 text-sm text-gray-500 hover:text-gray-950 font-medium mb-8 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Public Articles
          </button>

          <header className="border-b border-gray-100 pb-6 mb-8 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display font-bold text-gray-900 text-3xl tracking-tight leading-tight flex items-center gap-2.5">
                <Sparkles className="w-8 h-8 text-[#3333FF]" />
                Author Studio Workspace
              </h1>
              <p className="font-sans text-sm text-gray-500 mt-2 leading-relaxed">
                Compose new publications, edit existing articles, or manage published records.
              </p>
            </div>
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-[10px] font-mono border border-gray-200 text-[#3333FF] hover:text-[#1A1AFF] hover:bg-neutral-50 px-3 py-2 rounded-xl transition-all cursor-pointer self-start sm:self-auto"
              >
                Lock Studio
              </button>
            )}
          </header>

          {!isAuthenticated ? (
            /* Google Authentication Screen inside Author Page */
            <div className="bg-neutral-50/50 rounded-2xl border border-gray-200 p-8 sm:p-12 max-w-md mx-auto text-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4 mx-auto text-blue-500">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-gray-900 text-lg mb-1">
                Author Studio Authentication
              </h4>
              <p className="font-sans text-xs text-gray-500 leading-relaxed mb-6">
                This studio workspace is reserved. Please sign in with your authorized Google account to manage your portfolio articles.
              </p>
              <div className="flex flex-col gap-3 items-center justify-center w-full">
                <button
                  onClick={handleGoogleSignIn}
                  type="button"
                  className="inline-flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-3 text-sm font-bold text-[#3333FF] hover:text-[#1A1AFF] hover:bg-gray-50 hover:border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-[#3333FF] shadow-3xs cursor-pointer transition-all w-full"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.77 14.93 1 12 1 7.42 1 3.51 3.63 1.58 7.46l3.77 2.92C6.27 7.03 8.91 5.04 12 5.04z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.43h6.46c-.28 1.44-1.1 2.66-2.33 3.48l3.62 2.81c2.12-1.95 3.34-4.83 3.34-8.38z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.35 14.38c-.24-.71-.38-1.47-.38-2.38s.14-1.67.38-2.38L1.58 6.7C.57 8.73 0 11.01 0 13.5s.57 4.77 1.58 6.8l3.77-2.92z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.62-2.81c-1.1.74-2.51 1.18-4.34 1.18-3.09 0-5.73-1.99-6.66-5.34L1.58 16.04C3.51 19.87 7.42 23 12 23z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </button>
                {authError && (
                  <span className="text-[11px] text-rose-500 font-bold font-sans mt-2 block bg-rose-50 border border-rose-100 rounded-lg px-3 py-1.5 w-full">
                    {authError}
                  </span>
                )}

                {unauthorizedDomain && (
                  <div className="mt-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200 text-left space-y-3 w-full">
                    <p className="font-sans text-xs text-amber-800 font-medium leading-relaxed">
                      💡 <strong>Domain Authorization Required:</strong> Since you are running in this sandbox, you must add <code>{unauthorizedDomain}</code> to your Firebase Console under:
                      <br />
                      <span className="block mt-1 font-mono text-[10px] text-amber-900">
                        Authentication &rarr; Settings &rarr; Authorized domains
                      </span>
                    </p>
                    <div className="border-t border-amber-100 pt-3">
                      <p className="font-sans text-xs text-gray-600 font-semibold mb-1.5">
                        Or enter your admin passcode directly:
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="password"
                          placeholder="Passcode..."
                          value={bypassPasscode}
                          onChange={(e) => setBypassPasscode(e.target.value)}
                          className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-[#3333FF]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (bypassPasscode === 'minnie') {
                              setIsAuthenticated(true);
                              sessionStorage.setItem('minerva_portfolio_unlocked', 'true');
                              setAuthError('');
                              setUnauthorizedDomain(null);
                            } else {
                              alert('Incorrect Admin Passcode.');
                            }
                          }}
                          className="bg-[#3333FF] hover:bg-[#2222DD] text-[#E4F0E7] px-3.5 py-1.5 rounded-lg font-sans text-xs font-bold transition-all cursor-pointer"
                        >
                          Unlock
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Authenticated Workspace */
            <div className="space-y-10 text-left">
              {/* Form Section */}
              <div id="author-form-anchor" className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs">
                <form onSubmit={handleSavePost} className="flex flex-col gap-6">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#3333FF]" />
                      <h3 className="font-display font-bold text-gray-950 text-base">
                        {editingPostId ? 'Edit Publication Details' : 'Compose New Publication'}
                      </h3>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-100">
                      <ShieldCheck className="w-3 h-3" /> Owner Session Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono font-bold text-gray-600 mb-1 uppercase">
                        Article Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Navigating Microservices migrations..."
                        value={newPost.title}
                        onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#3333FF] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-gray-600 mb-1 uppercase">
                        Category
                      </label>
                      <select
                        value={newPost.category}
                        onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#3333FF] text-sm bg-white"
                      >
                        <option value="Technology">Technology</option>
                        <option value="Leadership">Leadership</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Strategy">Strategy</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-gray-600 mb-1 uppercase">
                      Short Excerpt (Teaser text)
                    </label>
                    <input
                      type="text"
                      placeholder="Brief summary of what this article covers. Will show on the listing page."
                      value={newPost.excerpt}
                      onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#3333FF] text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono font-bold text-gray-600 mb-1 uppercase">
                        Read Time (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5 min read (Auto-calculated if blank)"
                        value={newPost.readTime}
                        onChange={(e) => setNewPost({...newPost, readTime: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#3333FF] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-gray-600 mb-1 uppercase">
                        Author Profile
                      </label>
                      <input
                        type="text"
                        value={newPost.author}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#3333FF] text-sm bg-neutral-50 text-gray-500"
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-mono font-bold text-gray-600 uppercase">
                        Content (Markdown Format Supported)
                      </label>
                      <span className="text-[10px] text-gray-400 font-sans">
                        Use <code className="bg-neutral-100 px-1 py-0.5 rounded">### Title</code> for headings and <code className="bg-neutral-100 px-1 py-0.5 rounded">* list item</code> for bullet points.
                      </span>
                    </div>
                    <textarea
                      rows={12}
                      placeholder="Write your brilliant ideas here... Use double-enters (\n\n) to separate paragraphs."
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#3333FF] text-sm font-sans leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                    {editingPostId ? (
                      <button
                        type="button"
                        onClick={stopEditing}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 border border-rose-100 transition-colors cursor-pointer"
                      >
                        Cancel Editing
                      </button>
                    ) : (
                      <div />
                    )}

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-1.5 bg-[#3333FF] hover:bg-[#2222DD] text-[#E4F0E7] px-6 py-2.5 rounded-xl font-sans font-bold text-xs transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          editingPostId ? 'Saving Changes...' : 'Publishing...'
                        ) : submitSuccess ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" /> Success!
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" /> {editingPostId ? 'Save Changes' : 'Publish Article'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Management List Section */}
              <div className="bg-neutral-50/50 rounded-3xl border border-gray-200 p-6 sm:p-8">
                <div className="border-b border-gray-200 pb-4 mb-6">
                  <h3 className="font-display font-bold text-gray-950 text-base">
                    Manage Publications ({posts.length})
                  </h3>
                  <p className="font-sans text-xs text-gray-500 mt-1">
                    Directly select any article to edit its content or delete it from the system.
                  </p>
                </div>

                {posts.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 font-sans text-xs">
                    No articles published yet. Use the composer above to write your first article.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-150">
                    {posts.map((post) => (
                      <div key={post.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] bg-accent-light text-gray-900 font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
                              {post.category}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {post.date}
                            </span>
                          </div>
                          <h4 className="font-display font-bold text-gray-900 text-sm">
                            {post.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                          <button
                            onClick={() => {
                              setEditingPostId(post.id);
                              document.getElementById('author-form-anchor')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="inline-flex items-center gap-1 text-xs font-bold font-sans border border-gray-200 hover:border-[#C9DFCE] bg-white hover:bg-[#E4F0E7]/30 text-[#3333FF] hover:text-[#1A1AFF] px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
                          >
                            <Pencil className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="inline-flex items-center gap-1 text-xs font-bold font-sans border border-rose-100 hover:border-rose-200 bg-white hover:bg-rose-50/50 text-rose-600 hover:text-rose-800 px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        /* Blog Index View */
        <div id="blog-index">
          <div id="blog-header-banner" className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 text-left items-stretch">
            {/* Left Column: Banner Image */}
            <div className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-xs border border-gray-100 bg-neutral-100 flex items-stretch">
              <img 
                src="/architecting-humanity.png" 
                alt="Architecting Humanity" 
                referrerPolicy="no-referrer"
                className="w-full h-auto lg:h-full object-cover block mx-auto rounded-3xl"
              />
            </div>
            
            {/* Right Column: Definitions */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
              {/* Architecting Card */}
              <div className="relative overflow-hidden rounded-2xl border border-gray-150 bg-[#E4F0E7] p-4 hover:shadow-xs transition-all duration-300 flex-1 flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-24 h-24 bg-radial-gradient(circle_at_top_right,rgba(51,51,255,0.03),transparent) pointer-events-none" />
                
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-baseline gap-1.5">
                      <h2 className="font-display font-bold text-gray-900 text-sm tracking-tight">architecting</h2>
                      <span className="font-sans italic text-[10px] text-gray-500">verb</span>
                    </div>
                    <a 
                      href="https://www.dictionary.com/browse/architect" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-gray-100 hover:border-gray-200 text-gray-400 hover:text-[#3333FF] transition-all cursor-pointer shadow-3xs flex items-center justify-center shrink-0"
                      title="View on Dictionary.com"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="space-y-1.5 font-sans text-[11px] text-gray-600 leading-relaxed border-t border-gray-100 pt-2.5">
                    <p className="flex gap-2">
                      <span className="font-mono text-[9px] text-[#3333FF] font-bold shrink-0 mt-0.5">1.</span>
                      <span>To design, devise, or plan: <span className="italic text-gray-400">to architect a system.</span></span>
                    </p>
                    <p className="flex gap-2">
                      <span className="font-mono text-[9px] text-[#3333FF] font-bold shrink-0 mt-0.5">2.</span>
                      <span>To act as an architect; design.</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="font-mono text-[9px] text-[#3333FF] font-bold shrink-0 mt-0.5">3.</span>
                      <span>Deliberately structuring complex processes.</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Humanity Card */}
              <div className="relative overflow-hidden rounded-2xl border border-gray-150 bg-[#ccccff] p-4 hover:shadow-xs transition-all duration-300 flex-1 flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-24 h-24 bg-radial-gradient(circle_at_top_right,rgba(228,240,231,0.06),transparent) pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-baseline gap-1.5">
                      <h2 className="font-display font-bold text-gray-900 text-sm tracking-tight">humanity</h2>
                      <span className="font-sans italic text-[10px] text-gray-500">noun</span>
                    </div>
                    <a 
                      href="https://www.dictionary.com/browse/humanity" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-gray-100 hover:border-gray-200 text-gray-400 hover:text-[#3333FF] transition-all cursor-pointer shadow-3xs flex items-center justify-center shrink-0"
                      title="View on Dictionary.com"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="space-y-1.5 font-sans text-[11px] text-gray-600 leading-relaxed border-t border-gray-100 pt-2.5">
                    <p className="flex gap-2">
                      <span className="font-mono text-[9px] text-[#3333FF] font-bold shrink-0 mt-0.5">1.</span>
                      <span>All human beings collectively; humankind.</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="font-mono text-[9px] text-[#3333FF] font-bold shrink-0 mt-0.5">2.</span>
                      <span>The quality or state of being human.</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="font-mono text-[9px] text-[#3333FF] font-bold shrink-0 mt-0.5">3.</span>
                      <span>Kindness, benevolence, or compassion.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Header text content and actions */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12 text-left">
            <div className="w-full space-y-3">
              <h1 className="font-display font-bold text-gray-900 text-2xl sm:text-3xl tracking-tight">
                Elevating people at the center of progress.
              </h1>
              <p className="font-sans text-sm text-gray-600 leading-relaxed">
                I’m an engineering leader whose tech journey started with self-taught BASIC as a teen and led to directing global enterprise transformations from Silicon Valley. As a mentor, <a href="https://carissaott.com" target="_blank" rel="noopener noreferrer" className="text-[#3333FF] hover:underline font-medium">mother to a fellow software engineer</a>, and technology strategist, I focus on helping organizations scale AI while ensuring we always elevate people at the center of progress.
              </p>
            </div>
            
            {/* Actions for Admin */}
            {isAuthenticated && (
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleLogout}
                  className="text-[10px] font-mono border border-gray-200 text-[#3333FF] hover:text-[#1A1AFF] hover:bg-neutral-50 px-2.5 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Lock Studio
                </button>
              </div>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-neutral-50/50 p-4 rounded-2xl border border-gray-100 text-left">
            {/* Category selection */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl font-sans font-medium text-xs whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-accent-dark text-white shadow-3xs'
                      : 'text-[#3333FF] hover:text-[#1A1AFF] bg-white border border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-150 rounded-xl font-sans text-xs focus:outline-hidden focus:border-[#3333FF] focus:ring-1 focus:ring-[#3333FF] transition-all"
              />
            </div>
          </div>

          {/* Blog Cards Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-accent-dark animate-spin mb-4" />
              <span className="text-sm font-sans">Syncing articles...</span>
            </div>
          ) : error ? (
            <div className="bg-rose-50/50 border border-rose-100 text-rose-500 rounded-2xl p-8 text-center max-w-md mx-auto">
              <h4 className="font-display font-bold text-base">Error Loading Blog</h4>
              <p className="font-sans text-xs text-gray-500 mt-2">{error}</p>
              <button
                onClick={fetchPosts}
                className="mt-4 bg-rose-500 hover:bg-rose-600 text-white font-sans font-bold text-xs px-4 py-2 rounded-xl transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-neutral-50/50 border border-dashed border-gray-200 rounded-3xl py-16 px-6 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h4 className="font-display font-bold text-gray-900 text-base">No matches found</h4>
              <p className="font-sans text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
                We couldn't find any articles that match your filter or query. Try adjusting your parameters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onNavigate(`/blog/${post.slug}`)}
                  className="bg-white border border-gray-100 rounded-3xl p-6 hover:border-[#3333FF] hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between text-left group"
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[9px] bg-accent-light text-gray-900 font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {post.category}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {post.date}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-gray-900 text-base leading-snug group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="font-sans text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-50 mt-6 pt-4 text-xs font-mono text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-300" />
                      {post.readTime}
                    </span>
                    <span className="text-indigo-500 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      Read &rarr;
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
