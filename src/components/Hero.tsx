import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Mail, Briefcase, Award, CheckCircle } from 'lucide-react';
import { personalInfo } from '../data/resumeData';

export default function Hero() {
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
      transition: { type: 'spring', stiffness: 80, damping: 15 },
    },
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
                  {part}
                </strong>
              );
            }
            return part;
          })}
        </p>
      );
    });
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
          <div className="lg:col-span-7 flex flex-col items-start text-left">
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
                Now Scaling Agentic Workflows @ Creative Blue
              </span>
            </motion.div>

            {/* Display Headings */}
            <motion.h1
              id="hero-main-name"
              variants={itemVariants}
              className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-gray-900 tracking-tight leading-none mb-4"
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
              <a
                id="link-creative-blue"
                href="https://www.creativeblue.agency/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 bg-white border border-gray-100 hover:border-gray-300 rounded-md shadow-2xs font-semibold text-gray-800 hover:text-[#5B5BFF] transition-all duration-200 hover:scale-[1.04]"
              >
                Creative Blue
              </a>
              <span className="text-gray-300">←</span>
              <a
                id="link-google"
                href="https://www.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 bg-white border border-gray-100 hover:border-gray-300 rounded-md shadow-2xs font-semibold text-blue-600 hover:text-blue-800 transition-all duration-200 hover:scale-[1.04]"
              >
                Google (14 yrs)
              </a>
              <span className="text-gray-300">←</span>
              <a
                id="link-apple"
                href="https://www.apple.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 bg-white border border-gray-100 hover:border-gray-300 rounded-md shadow-2xs font-semibold text-red-500 hover:text-red-700 transition-all duration-200 hover:scale-[1.04]"
              >
                Apple
              </a>
              <span className="text-gray-300">←</span>
              <a
                id="link-sun-oracle"
                href="https://www.oracle.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 bg-white border border-gray-100 hover:border-gray-300 rounded-md shadow-2xs font-semibold text-orange-500 hover:text-orange-700 transition-all duration-200 hover:scale-[1.04]"
              >
                Sun / Oracle
              </a>
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
                id="cta-portfolio-btn"
                href="#portfolio"
                className="px-6 py-3 bg-[#3333FF] hover:bg-[#2222DD] text-white font-sans font-medium text-sm rounded-lg shadow-sm border border-[#3333FF] transition-all duration-200 accent-glow hover:accent-glow-strong hover:scale-[1.01]"
              >
                Explore App Portfolio
              </a>
              <a
                id="cta-contact-btn"
                href="#contact"
                className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-sans font-medium text-sm rounded-lg border border-gray-200 shadow-2xs transition-all duration-200 hover:scale-[1.01]"
              >
                Get in Touch
              </a>
            </motion.div>
          </div>

          {/* Core Highlights Column (Bento Card Layout) */}
          <div className="lg:col-span-5 relative">
            <motion.div
              id="hero-highlights-card"
              variants={itemVariants}
              className="p-8 bg-white/75 backdrop-blur-md rounded-2xl border border-gray-100 shadow-md relative overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-accent" />

              <h3 className="font-display font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-gray-700" /> Key Impact Summary
              </h3>

              <div className="flex flex-col gap-5">
                {/* Highlight 1 */}
                <div id="highlight-item-1" className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-accent-light flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-gray-900 leading-tight">
                      50+ Google Maps Features
                    </h4>
                    <p className="font-sans text-xs text-gray-500 mt-1">
                      Led end-to-end SDLC from requirements to global production with Gemini Voice Navigation.
                    </p>
                  </div>
                </div>

                {/* Highlight 2 */}
                <div id="highlight-item-2" className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-accent-light flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-gray-900 leading-tight">
                      $150M Operational Efficiencies
                    </h4>
                    <p className="font-sans text-xs text-gray-500 mt-1">
                      Drove AI Service Desk transformation, optimizing tickets with intelligent automated routing.
                    </p>
                  </div>
                </div>

                {/* Highlight 3 */}
                <div id="highlight-item-3" className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-accent-light flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-gray-900 leading-tight">
                      Agentic Workflows Specialist
                    </h4>
                    <p className="font-sans text-xs text-gray-500 mt-1">
                      Pioneered GrowthOS, Lead Generator, and Brand Booster platforms using advanced LLM pipelines.
                    </p>
                  </div>
                </div>

                {/* Highlight 4 */}
                <div id="highlight-item-4" className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-accent-light flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-gray-900 leading-tight">
                      Stanford LEAD Scholar
                    </h4>
                    <p className="font-sans text-xs text-gray-500 mt-1">
                      Distinguished GSB Scholar, serving on the Community Advisory Board.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <div id="scroll-down-indicator" className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block">
          <a
            href="#portfolio"
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
