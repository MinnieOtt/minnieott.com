import React, { useState, useEffect } from 'react';
import { Menu, X, FileText } from 'lucide-react';
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

      if (currentPath && currentPath.startsWith('/blog')) {
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
    if (currentPath && currentPath.startsWith('/blog')) {
      setActiveSection('blog');
    }
  }, [currentPath]);

  const navItems = [
    { label: 'Blog', href: '/blog', id: 'blog' },
    { label: 'Story', href: '#home', id: 'home' },
    { label: 'Apps', href: '#portfolio', id: 'portfolio' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Education & Patents', href: '#credentials', id: 'credentials' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: { label: string; href: string; id: string }) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (item.href.startsWith('#')) {
      if (currentPath && currentPath !== '/') {
        if (onNavigate) {
          onNavigate('/');
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
    } else {
      if (onNavigate) {
        onNavigate(item.href);
      }
    }
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
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            if (currentPath && currentPath !== '/') {
              if (onNavigate) onNavigate('/');
            } else {
              const el = document.getElementById('home');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
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
              Minerva T. Ott
            </span>
            <span id="logo-text-title" className="text-[10px] text-gray-500 font-mono mt-0.5 uppercase tracking-wider">
              Technology Transformation Leader
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav id="desktop-nav-menu" className="hidden lg:flex items-center gap-8 animate-fade-in">
          {navItems.map((item) => (
            <a
              key={item.href}
              id={`nav-link-${item.id}`}
              href={item.href}
              onClick={(e) => handleNavClick(e, item)}
              className={`font-sans text-sm font-medium transition-all duration-200 relative py-1 hover:text-gray-950 ${
                activeSection === item.id ? 'text-gray-950 font-semibold text-[#3333FF]' : 'text-gray-500'
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span
                  id={`nav-active-indicator-${item.id}`}
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-dark rounded-full"
                />
              )}
            </a>
          ))}
        </nav>

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
                  activeSection === item.id ? 'text-gray-950 pl-2 border-l-2 border-accent-dark' : 'text-gray-500'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
