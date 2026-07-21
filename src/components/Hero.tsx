import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Mail, Briefcase, Award, CheckCircle } from 'lucide-react';
import { personalInfo } from '../data/resumeData';

interface HeroProps {
  onNavigate?: (path: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const [imageError, setImageError] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 80, damping: 15 },
    },
  };

  const renderTextWithLinks = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const elements = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      const [_, label, url] = match;
      const index = match.index;

      if (index > lastIndex) {
        elements.push(text.substring(lastIndex, index));
      }

      if (url.startsWith('company:')) {
        const companyIndex = parseInt(url.split(':')[1], 10);
        elements.push(
          <button
            key={index}
            onClick={(e) => handleCompanyClick(e, companyIndex)}
            className="text-[#3333FF] hover:text-[#1A1AFF] hover:underline transition-colors cursor-pointer font-semibold bg-transparent border-none p-0 inline align-baseline"
          >
            {label}
          </button>
        );
      } else {
        elements.push(
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 underline transition-colors"
          >
            {label}
          </a>
        );
      }

      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      elements.push(text.substring(lastIndex));
    }

    return elements.length > 0 ? elements : text;
  };

  const renderAboutText = (text: string) => {
    return text.split('\n\n').map((paragraph, pIdx) => {
      const parts = paragraph.split('##');
      return (
        <p key={pIdx} className="mb-4 last:mb-0">
          {parts.map((part, partIdx) => {
            if (partIdx % 2 === 1) {
              return (
                <strong key={partIdx} className="font-semibold text-indigo-950 bg-indigo-50/70 px-1.5 py-0.5 rounded-md border border-indigo-100/60">
                  {renderTextWithLinks(part)}
                </strong>
              );
            }
            return renderTextWithLinks(part);
          })}
        </p>
      );
    });
  };

  const handleCompanyClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    const el = document.getElementById('experience');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.dispatchEvent(new CustomEvent('select-experience-company', { detail: { index } }));
    } else if (onNavigate) {
      onNavigate('/work');
      
      let attempts = 0;
      const interval = setInterval(() => {
        const newEl = document.getElementById('experience');
        attempts++;
        if (newEl) {
          newEl.scrollIntoView({ behavior: 'smooth' });
          window.dispatchEvent(new CustomEvent('select-experience-company', { detail: { index } }));
          clearInterval(interval);
        } else if (attempts > 20) {
          clearInterval(interval);
        }
      }, 50);
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen pt-32 pb-24 md:pt-40 md:pb-32 bg-radial from-white via-neutral-50 to-neutral-100 flex items-center overflow-hidden"
    >
      {/* Decorative clean background subtle accent blob */}
      <div
        id="bg-accent-blob-1"
        className="absolute top-1/4 right-[-10%] w-[500px] h-[500px] rounded-full bg-[#3333FF] opacity-10 blur-[120px] pointer-events-none"
      />
      <div
        id="bg-accent-blob-2"
        className="absolute bottom-10 left-[-5%] w-[350px] h-[350px] rounded-full bg-[#3333FF] opacity-5 blur-[90px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10">
        <motion.div
          id="hero-content-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          {/* Text/Intro Column */}
          <div className="lg:col-span-9 flex flex-col items-start text-left">
            {/* Profile Picture */}
            <motion.div
              id="hero-profile-container"
              variants={itemVariants}
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden mb-6 border border-gray-150 bg-white p-1 shadow-sm"
            >
              {!imageError ? (
                <img
                  src="/minnieott.jpg"
                  alt={personalInfo.name}
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-gradient-to-tr from-[#3333FF]/20 to-indigo-50/50 flex items-center justify-center text-[#3333FF] font-display font-bold text-xl sm:text-2xl border border-[#3333FF]/30">
                  MO
                </div>
              )}
            </motion.div>

            {/* Status Pill */}
            <motion.div
              id="status-pill"
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-100 rounded-full shadow-xs mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-[11px] font-mono text-gray-600 font-semibold uppercase tracking-wider">
                Now Scaling Agentic Workflows @{' '}
                <button
                  onClick={(e) => handleCompanyClick(e, 0)}
                  className="font-bold text-[#3333FF] hover:text-[#1A1AFF] hover:underline cursor-pointer inline align-baseline font-mono uppercase text-[11px]"
                >
                  Creative Blue
                </button>
              </span>
            </motion.div>

            {/* Display Headings */}
            <motion.h1
              id="hero-main-name"
              variants={itemVariants}
              className="font-display font-normal text-3xl sm:text-4xl md:text-5xl text-gray-900 tracking-tight leading-none mb-4"
            >
              {personalInfo.name}
            </motion.h1>

            <motion.h2
              id="hero-main-title"
              variants={itemVariants}
              className="font-display text-lg sm:text-xl md:text-2xl font-medium text-gray-600 tracking-wide mb-6"
            >
              {personalInfo.title}
            </motion.h2>

            {/* Elegant Lineage flow chart instead of a generic card */}
            <motion.div
              id="career-lineage-flow"
              variants={itemVariants}
              className="w-full flex flex-wrap items-center gap-2 mb-8 text-[11px] font-mono text-gray-500"
            >
              <button
                id="link-creative-blue"
                onClick={(e) => handleCompanyClick(e, 0)}
                className="inline-flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-100 hover:border-gray-300 rounded-md shadow-2xs font-semibold text-gray-800 hover:text-[#5B5BFF] transition-all duration-200 hover:scale-[1.04] cursor-pointer text-left"
              >
                <img
                  src="/creativeblue-favicon.png"
                  alt="Creative Blue"
                  className="w-3.5 h-3.5 rounded-full object-cover border border-gray-100"
                />
                Creative Blue
              </button>
              <span className="text-gray-300">←</span>
              <button
                id="link-google"
                onClick={(e) => handleCompanyClick(e, 1)}
                className="inline-flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-100 hover:border-gray-300 rounded-md shadow-2xs font-semibold text-blue-600 hover:text-blue-800 transition-all duration-200 hover:scale-[1.04] cursor-pointer text-left"
              >
                <img
                  src="/google-favicon.png"
                  alt="Google"
                  className="w-3.5 h-3.5 rounded-full object-cover border border-gray-100"
                />
                Google
              </button>
              <span className="text-gray-300">←</span>
              <button
                id="link-apple"
                onClick={(e) => handleCompanyClick(e, 2)}
                className="inline-flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-100 hover:border-gray-300 rounded-md shadow-2xs font-semibold text-red-500 hover:text-red-700 transition-all duration-200 hover:scale-[1.04] cursor-pointer text-left"
              >
                <img
                  src="/apple-favicon.png"
                  alt="Apple"
                  className="w-3.5 h-3.5 rounded-full object-cover border border-gray-100"
                />
                Apple
              </button>
              <span className="text-gray-300">←</span>
              <button
                id="link-sun-oracle"
                onClick={(e) => handleCompanyClick(e, 3)}
                className="inline-flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-100 hover:border-gray-300 rounded-md shadow-2xs font-semibold text-orange-500 hover:text-orange-700 transition-all duration-200 hover:scale-[1.04] cursor-pointer text-left"
              >
                <img
                  src="/sun-favicon.png"
                  alt="Sun / Oracle"
                  className="w-3.5 h-3.5 rounded-full object-cover border border-gray-100"
                />
                Sun / Oracle
              </button>
            </motion.div>

            {/* Structured About Summary */}
            <motion.div
              id="hero-about-text"
              variants={itemVariants}
              className="font-sans text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mb-8"
            >
              {renderAboutText(personalInfo.about)}
            </motion.div>

            {/* Call to Actions */}
            <motion.div
              id="hero-cta-group"
              variants={itemVariants}
              className="flex flex-wrap gap-4 items-center"
            >
              <a
                id="cta-blog-btn"
                href="/blog"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) {
                    onNavigate('/blog');
                  } else {
                    window.location.href = '/blog';
                  }
                }}
                className="px-6 py-3 bg-[#3333FF] hover:bg-[#2222DD] text-[#E4F0E7] font-sans font-medium text-sm rounded-lg shadow-sm border border-[#3333FF] transition-all duration-200 accent-glow hover:accent-glow-strong hover:scale-[1.01]"
              >
                Architecting Humanity
              </a>
              <a
                id="cta-portfolio-btn"
                href="/work"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) {
                    onNavigate('/work');
                  } else {
                    window.location.href = '/work';
                  }
                }}
                className="px-6 py-3 bg-[#E4F0E7] hover:bg-[#d6eade] text-[#3333FF] font-sans font-medium text-sm rounded-lg shadow-sm border border-[#3333FF]/10 transition-all duration-200 hover:scale-[1.01]"
              >
                App Portfolio
              </a>
              <a
                id="cta-contact-btn"
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) {
                    onNavigate('/contact');
                  } else {
                    window.location.href = '/contact';
                  }
                }}
                className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-sans font-medium text-sm rounded-lg border border-gray-200 shadow-2xs transition-all duration-200 hover:scale-[1.01]"
              >
                Get in Touch
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <div id="scroll-down-indicator" className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block">
          <a
            href="/work"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) {
                onNavigate('/work');
              } else {
                window.location.href = '/work';
              }
            }}
            aria-label="Scroll down"
            className="flex flex-col items-center gap-2 text-xs text-gray-400 font-mono tracking-widest hover:text-gray-600 transition-colors"
          >
            SCROLL DOWN
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
