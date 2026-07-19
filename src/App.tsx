import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Speaker from './components/Speaker';
import EducationCertifications from './components/EducationCertifications';
import Contact from './components/Contact';
import Blog from './components/Blog';
import { personalInfo } from './data/resumeData';
import MochiChat from './components/MochiChat';
import Newsletter from './components/Newsletter';
import { initGA, trackPageView } from './lib/analytics';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Initialize Google Analytics on mount
  useEffect(() => {
    initGA();
  }, []);

  // Track page view on route/path changes
  useEffect(() => {
    trackPageView(currentPath);
  }, [currentPath]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isBlog = currentPath === '/' || currentPath.startsWith('/blog');
  const blogSlug = currentPath.match(/^\/blog\/([^/]+)/)?.[1] || null;

  return (
    <div id="personal-website-root" className="min-h-screen bg-neutral-bg selection:bg-accent selection:text-white flex flex-col justify-between">
      {/* Dynamic Header */}
      <Header currentPath={currentPath} onNavigate={navigate} />

      {/* Main Sections */}
      <main id="main-content-regions">
        {isBlog ? (
          <Blog currentSlug={blogSlug} onNavigate={navigate} />
        ) : (
          <>
            {/* Hero Segment */}
            <Hero />

            {/* Apps Portfolio Bento Segment */}
            <Portfolio />

            {/* Interactive Staggered Experience Segment */}
            <Experience />

            {/* Skill Inventory Progress Segment */}
            <Skills />

            {/* Keynotes & Mentorship Speaker Segment */}
            <Speaker />

            {/* Scholastics, Patents, Book Authoring, and Certifications Segment */}
            <EducationCertifications />

            {/* Contact form & direct information channels */}
            <Contact />
          </>
        )}
      </main>

      {/* Newsletter Subscription Component */}
      <Newsletter />

      {/* Modern Minimalist Footer */}
      <footer id="main-site-footer" className="bg-neutral-50 border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span id="footer-brand" className="font-display font-normal text-gray-900 text-sm">
              Minerva Tanglao Ott (Minnie)
            </span>
            <span id="footer-tagline" className="font-mono text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">
              Technology Transformation Leader
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <p id="footer-copyright" className="font-mono text-[10px] text-gray-400 text-center md:text-right">
              © {new Date().getFullYear()} Minerva Tanglao Ott (Minnie). All Rights Reserved. Deployed with Lavender Accents.
            </p>
          </div>
        </div>
      </footer>
      <MochiChat />
    </div>
  );
}
