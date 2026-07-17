import React, { useState, useEffect } from 'react';
import { Menu, X, FileText, Sparkles } from 'lucide-react';
import { personalInfo } from '../data/resumeData';

interface HeaderProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export default function Header({ currentPath, onNavigate }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const isHomeBlog = !currentPath || currentPath === '/' || currentPath.startsWith('/blog');
      if (isHomeBlog) {
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPath]);

  useEffect(() => {
    const isHomeBlog = !currentPath || currentPath === '/' || currentPath.startsWith('/blog');
    if (isHomeBlog) {
      setActiveSection('blog');
    }
  }, [currentPath]);

  const isNavActive = (itemId: string) => {
    if (itemId === 'blog') return activeSection === 'blog';
    if (itemId === 'portfolio') return activeSection === 'portfolio';
    if (itemId === 'contact') return activeSection === 'contact';
    if (itemId === 'home') {
      return ['home', 'experience', 'skills', 'credentials'].includes(activeSection);
    }
    return false;
  };

  const navItems = [
    { label: 'Blog', href: '/', id: 'blog' },
    { label: 'Work', href: '/about#portfolio', id: 'portfolio' },
    { label: 'About', href: '/about#home', id: 'home' },
    { label: 'Contact', href: '/about#contact', id: 'contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: { label: string; href: string; id: string }) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (item.id === 'blog') {
      if (onNavigate) {
        onNavigate('/');
      }
    } else {
      // It's an about/work/contact section: /about#id
      if (currentPath && !currentPath.startsWith('/about')) {
        if (onNavigate) {
          onNavigate('/about');
          // Give the DOM a moment to mount the sections before scrolling
          setTimeout(() => {
            const el = document.getElementById(item.id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      } else {
        const el = document.getElementById(item.id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAskMochi = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('open-mochi-chat'));
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
                src="/minnieott.jpg"
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
            <span id="logo-text-name" className="font-display font-bold text-gray-900 leading-none text-base">
              Minerva T. Ott (Minnie)
            </span>
            <span id="logo-text-title" className="text-[10px] text-gray-500 font-mono mt-0.5 uppercase tracking-wider">
              Technology Transformation Leader
            </span>
            <span id="logo-text-companies" className="text-[9px] text-gray-400 font-mono mt-1 tracking-wide">
              Creative Blue &larr; Google &larr; Apple &larr; Sun / Oracle
            </span>
          </div>
        </a>

        {/* Right side Actions (Menu links + Ask Mochi) */}
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Desktop Navigation */}
          <nav id="desktop-nav-menu" className="hidden lg:flex items-center gap-8 animate-fade-in">
            {navItems.map((item) => (
              <a
                key={item.href}
                id={`nav-link-${item.id}`}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`font-sans text-sm font-medium transition-all duration-200 relative py-1 hover:text-gray-950 ${
                  isNavActive(item.id) ? 'text-gray-950 font-semibold text-[#3333FF]' : 'text-gray-500'
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
            
            {/* Ask Mochi Button on same line as menu */}
            <button
              id="header-ask-mochi-btn-desktop"
              onClick={handleAskMochi}
              className="px-3.5 py-1.5 bg-[#3333FF]/10 hover:bg-[#3333FF] text-[#3333FF] hover:text-white font-sans text-xs font-bold rounded-full transition-all duration-200 flex items-center gap-1.5 hover:scale-[1.03] cursor-pointer shadow-3xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Ask Mochi
            </button>
          </nav>

          {/* Ask Mochi Mobile Button (shows right on the header line) */}
          <button
            id="header-ask-mochi-btn-mobile"
            onClick={handleAskMochi}
            className="lg:hidden px-3 py-1.5 bg-[#3333FF]/10 hover:bg-[#3333FF] text-[#3333FF] hover:text-white font-sans text-xs font-bold rounded-full transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-3xs"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Ask Mochi
          </button>

          {/* Mobile Toggle */}
          <button
            id="mobile-nav-toggle-btn"
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
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
                  isNavActive(item.id) ? 'text-gray-950 pl-2 border-l-2 border-accent-dark' : 'text-gray-500'
                }`}
              >
                {item.label}
              </a>
            ))}

            {/* Mobile Drawer Ask Mochi Link */}
            <button
              id="mobile-nav-drawer-ask-mochi-btn"
              onClick={(e) => {
                setIsOpen(false);
                handleAskMochi(e);
              }}
              className="mt-2 w-full py-2 bg-[#3333FF] hover:bg-[#1919FF] text-white font-sans text-sm font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              Ask Mochi AI
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
