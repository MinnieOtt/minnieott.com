import React, { useState, useEffect } from 'react';
import { Menu, X, FileText, Sparkles, Gamepad2 } from 'lucide-react';
import { personalInfo } from '../data/resumeData';
import { BUILD_TIME } from '../version';

interface HeaderProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export default function Header({ currentPath, onNavigate }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [imageError, setImageError] = useState(false);
  const [lastUpdateText, setLastUpdateText] = useState<string>('');

  useEffect(() => {
    const updateTime = (customTime?: string) => {
      const storedTime = typeof customTime === 'string' ? customTime : localStorage.getItem('minerva_portfolio_last_update');
      const timeToUse = storedTime || BUILD_TIME;
      try {
        const date = new Date(timeToUse);
        setLastUpdateText(date.toLocaleString());
      } catch {
        setLastUpdateText(new Date().toLocaleString());
      }
    };

    updateTime();

    const handleBlogUpdated = (e: Event) => {
      const customEv = e as CustomEvent<{ timestamp?: string }>;
      const newTime = customEv.detail?.timestamp || new Date().toISOString();
      updateTime(newTime);
    };

    const handleStorageChange = () => {
      updateTime();
    };

    window.addEventListener('blog-updated', handleBlogUpdated);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('blog-updated', handleBlogUpdated);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    localStorage.removeItem('theme');
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const isBlogPage = currentPath && currentPath.startsWith('/blog');
      if (isBlogPage) {
        setActiveSection('blog');
        return;
      }

      // Track active section on scroll
      const sections = ['home', 'portfolio', 'experience', 'skills', 'credentials', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPath]);

  useEffect(() => {
    const isBlogPage = currentPath && currentPath.startsWith('/blog');
    if (isBlogPage) {
      setActiveSection('blog');
    }
  }, [currentPath]);

  const isNavActive = (itemId: string) => {
    if (itemId === 'blog') {
      return currentPath && currentPath.startsWith('/blog');
    }
    if (itemId === 'portfolio') {
      return currentPath && currentPath.startsWith('/work') && (activeSection === 'portfolio' || !['experience', 'skills', 'credentials', 'contact'].includes(activeSection));
    }
    if (itemId === 'experience') {
      return currentPath && currentPath.startsWith('/work') && ['experience', 'skills', 'credentials'].includes(activeSection);
    }
    if (itemId === 'home') {
      return currentPath && (currentPath === '/' || currentPath.startsWith('/about'));
    }
    if (itemId === 'contact') {
      return (currentPath && currentPath.startsWith('/contact')) || activeSection === 'contact';
    }
    return false;
  };

  const navItems = [
    { label: 'Blog', href: '/blog', id: 'blog' },
    { label: 'Work', href: '/work', id: 'portfolio' },
    { label: 'Resume', href: '/work#experience', id: 'experience' },
    { label: 'Contact', href: '/contact', id: 'contact' },
  ];

  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/minnieott',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/minnie.halohalo/',
      icon: (
        <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/minerva.t.ott',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      name: 'X',
      url: 'https://x.com/ottminnie',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@MinnieOtt',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@minnie.halohalo',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.56-1.36 1.52-1.38 2.52-.01.97.47 1.93 1.25 2.5 1.04.78 2.48.83 3.56.12.82-.52 1.34-1.43 1.37-2.4.03-4.29.01-8.58.02-12.87z" />
        </svg>
      ),
    },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: { label: string; href: string; id: string }) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (item.id === 'blog') {
      if (onNavigate) {
        onNavigate('/blog');
      }
    } else if (item.id === 'contact') {
      if (onNavigate) {
        onNavigate('/contact');
      }
    } else {
      const targetPath = item.href.split('#')[0]; // '/work' or '/about'
      const targetHash = item.href.split('#')[1]; // 'contact' or undefined
      
      if (currentPath && !currentPath.startsWith(targetPath)) {
        if (onNavigate) {
          onNavigate(targetPath);
          if (targetHash) {
            // Give the DOM a moment to mount the sections before scrolling
            setTimeout(() => {
              const el = document.getElementById(targetHash);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 150);
          }
        }
      } else {
        if (targetHash) {
          const el = document.getElementById(targetHash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
  };

  const handleAskMochi = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('open-mochi-chat'));
  };

  const handlePlayPacman = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate('/pacman');
    window.dispatchEvent(new CustomEvent('open-mochi-pacman'));
  };

  return (
    <header
      id="main-site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo/Brand */}
        <a
          id="nav-logo-link"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            if (onNavigate) onNavigate('/');
          }}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div
            id="logo-bubble"
            className="w-10 h-10 rounded-full bg-accent overflow-hidden flex items-center justify-center font-display font-bold text-gray-900 group-hover:bg-accent-hover transition-colors duration-300 border border-gray-100 shadow-2xs"
          >
            {!imageError ? (
              <img
                src="/minnieott.webp"
                alt="MO"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
              />
            ) : (
              'MO'
            )}
          </div>
          <div className="flex flex-col">
            <span id="logo-text-name" className="font-display font-bold text-black leading-none text-base">
              Minerva T. Ott (Minnie)
            </span>
            <span id="logo-text-title" className="text-[10px] text-black font-mono mt-0.5 uppercase tracking-wider">
              Technology Transformation Leader
            </span>
            <span id="logo-text-companies" className="text-[9px] text-black font-mono mt-1 tracking-wide">
              Creative Blue &larr; Google &larr; Apple
            </span>
            {lastUpdateText && (
              <span id="logo-text-last-update" className="text-[9px] text-black font-mono mt-0.5 tracking-wide">
                Last update: {lastUpdateText}
              </span>
            )}
          </div>
        </a>

        {/* Right side Actions (Menu links + Ask Mochi) */}
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Desktop Navigation */}
          <nav id="desktop-nav-menu" className="hidden lg:flex items-center gap-5 xl:gap-6 animate-fade-in">
            {navItems.map((item) => (
              <a
                key={item.href}
                id={`nav-link-${item.id}`}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`font-sans text-sm font-medium transition-all duration-200 relative py-1 hover:text-black ${
                  isNavActive(item.id) ? 'text-black font-semibold text-[#3333FF]' : 'text-black'
                }`}
              >
                {item.label}
                {isNavActive(item.id) && (
                  <span
                    id={`nav-active-indicator-${item.id}`}
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-dark rounded-full"
                  />
                )}
              </a>
            ))}

            {/* Vertical Divider */}
            <div className="h-4 w-px bg-gray-200" />

            {/* Social Media Links */}
            <div id="header-social-links-desktop" className="flex items-center gap-1">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  id={`header-social-link-${social.name.toLowerCase()}`}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Connect on ${social.name}`}
                  aria-label={`Connect on ${social.name}`}
                  className="p-1.5 text-gray-700 hover:text-[#3333FF] hover:bg-blue-50/80 rounded-md transition-all duration-200 hover:scale-110 flex items-center justify-center"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Vertical Divider */}
            <div className="h-4 w-px bg-gray-200" />

            {/* Play Mochi Pac-Man Arcade Button */}
            <button
              id="header-play-pacman-btn-desktop"
              onClick={handlePlayPacman}
              title="Play Mochi Pac-Man Game"
              className="px-3 py-1.5 bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#B45309] hover:text-[#92400E] border border-amber-300/80 font-sans text-xs font-bold rounded-full transition-all duration-200 flex items-center gap-1.5 hover:scale-[1.03] cursor-pointer shadow-3xs"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Mochi Pac-Man</span>
            </button>

            {/* Ask Mochi Button on same line as menu */}
            <button
              id="header-ask-mochi-btn-desktop"
              onClick={handleAskMochi}
              className="px-3.5 py-1.5 bg-[#3333FF] hover:bg-[#1A1AFF] text-[#E4F0E7] font-sans text-xs font-bold rounded-full transition-all duration-200 flex items-center gap-1.5 hover:scale-[1.03] cursor-pointer shadow-3xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Ask Mochi
            </button>
          </nav>

          {/* Play Pac-Man Mobile Button */}
          <button
            id="header-play-pacman-btn-mobile"
            onClick={handlePlayPacman}
            title="Play Mochi Pac-Man Game"
            className="lg:hidden p-1.5 bg-[#FFFBEB] text-[#B45309] border border-amber-300/80 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer shadow-3xs"
          >
            <Gamepad2 className="w-4 h-4 text-amber-600" />
          </button>

          {/* Ask Mochi Mobile Button (shows right on the header line) */}
          <button
            id="header-ask-mochi-btn-mobile"
            onClick={handleAskMochi}
            className="lg:hidden px-3 py-1.5 bg-[#3333FF] hover:bg-[#1A1AFF] text-[#E4F0E7] font-sans text-xs font-bold rounded-full transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-3xs"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Ask Mochi
          </button>

          {/* Mobile Toggle */}
          <button
            id="mobile-nav-toggle-btn"
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-black transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-md py-6 px-6 flex flex-col gap-5 transition-all duration-300 ease-in-out"
        >
          <div className="flex flex-col gap-4 text-left">
            {navItems.map((item) => (
              <a
                key={item.href}
                id={`mobile-nav-link-${item.id}`}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`font-sans text-base font-medium py-1.5 border-b border-gray-50 ${
                  isNavActive(item.id) ? 'text-black pl-2 border-l-2 border-accent-dark' : 'text-black'
                }`}
              >
                {item.label}
              </a>
            ))}

            {/* Social Links Section in Mobile Drawer */}
            <div className="pt-3 pb-1 border-t border-gray-100">
              <span className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-wider block mb-2.5">
                Connect & Follow
              </span>
              <div id="mobile-drawer-social-links" className="flex items-center gap-2 flex-wrap">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    id={`mobile-social-link-${social.name.toLowerCase()}`}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Connect on ${social.name}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-blue-50 hover:text-[#3333FF] text-gray-800 rounded-lg text-xs font-medium border border-gray-100 transition-colors"
                  >
                    {social.icon}
                    <span>{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile Drawer Actions */}
            <div className="flex flex-col gap-2 mt-2">
              <button
                id="mobile-nav-drawer-play-pacman-btn"
                onClick={(e) => {
                  setIsOpen(false);
                  handlePlayPacman(e);
                }}
                className="w-full py-2 bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#B45309] border border-amber-300 font-sans text-sm font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-3xs"
              >
                <Gamepad2 className="w-4 h-4 text-amber-600" />
                Play Mochi Pac-Man 🎮
              </button>

              <button
                id="mobile-nav-drawer-ask-mochi-btn"
                onClick={(e) => {
                  setIsOpen(false);
                  handleAskMochi(e);
                }}
                className="w-full py-2 bg-[#3333FF] hover:bg-[#1A1AFF] text-[#E4F0E7] font-sans text-sm font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                Ask Mochi AI
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
