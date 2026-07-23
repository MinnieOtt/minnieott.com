import React, { useState, useEffect } from 'react';
import { Calendar, Briefcase, MapPin, ChevronRight, Award } from 'lucide-react';
import { experiences } from '../data/resumeData';
import { ExperienceItem } from '../types';

export default function Experience() {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const handleSelectCompany = (e: Event) => {
      const customEvent = e as CustomEvent<{ index: number }>;
      if (customEvent.detail && typeof customEvent.detail.index === 'number') {
        setActiveTab(customEvent.detail.index);
      }
    };

    window.addEventListener('select-experience-company', handleSelectCompany);
    return () => window.removeEventListener('select-experience-company', handleSelectCompany);
  }, []);

  const getCompanyFavicon = (companyName: string) => {
    if (companyName.includes('Creative Blue')) return '/creativeblue-favicon.png';
    if (companyName.includes('Google')) return '/google-favicon.png';
    if (companyName.includes('Apple')) return '/apple-favicon.png';
    if (companyName.includes('Sun Microsystems') || companyName.includes('Oracle')) return '/sun-favicon.png';
    return null;
  };

  const renderCompanyLinks = (companyName: string) => {
    if (companyName.includes(',')) {
      const parts = companyName.split(',');
      return (
        <span>
          {parts.map((part, index) => {
            const trimmed = part.trim();
            let url = '';
            if (trimmed === 'IBM') url = 'https://www.ibm.com/';
            else if (trimmed === 'DHL') url = 'https://www.dhl.com/';
            else if (trimmed === 'Infogain') url = 'https://www.tenarai.com/';

            return (
              <React.Fragment key={trimmed}>
                {index > 0 && <span className="text-gray-400">, </span>}
                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-[#3333FF] hover:underline transition-colors duration-200"
                  >
                    {trimmed}
                  </a>
                ) : (
                  <span>{trimmed}</span>
                )}
              </React.Fragment>
            );
          })}
        </span>
      );
    }

    let url = '';
    if (companyName.includes('Creative Blue')) {
      url = 'https://www.creativeblue.agency/';
    } else if (companyName.includes('Google')) {
      url = 'https://www.google.com/';
    } else if (companyName.includes('Apple')) {
      url = 'https://www.apple.com/';
    } else if (companyName.includes('Sun Microsystems') || companyName.includes('Oracle')) {
      url = 'https://www.oracle.com/';
    }

    if (url) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-[#3333FF] hover:underline transition-colors duration-200"
        >
          {companyName}
        </a>
      );
    }

    return <span>{companyName}</span>;
  };

  const renderTextWithLinks = (text: string) => {
    if (!text) return '';

    // Match markdown links: [label](url)
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        elements.push(text.substring(lastIndex, match.index));
      }

      const label = match[1];
      const url = match[2];
      const isInternal = url.startsWith('#') || url.startsWith('/');

      const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (url.includes('#')) {
          e.preventDefault();
          const targetId = url.split('#')[1];
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      };

      elements.push(
        <a
          key={`link-${match.index}`}
          href={url}
          onClick={handleClick}
          target={isInternal ? undefined : "_blank"}
          rel={isInternal ? undefined : "noopener noreferrer"}
          className="text-[#3333FF] hover:underline font-semibold cursor-pointer"
        >
          {label}
        </a>
      );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      elements.push(text.substring(lastIndex));
    }

    return <>{elements}</>;
  };

  return (
    <section id="experience" className="py-24 bg-neutral-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div id="experience-section-header" className="max-w-3xl mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#3333FF] bg-[#E4F0E7] px-3 py-1 rounded-full">
            15+ Year Career Path
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 tracking-tight mt-3 mb-4">
            Professional Experience & Leadership
          </h2>
          <p className="font-sans text-base text-gray-600 leading-relaxed">
            Leading high-performing engineering organizations and program offices at world-renowned technology companies, delivering enterprise-scale systems and AI products.
          </p>
        </div>

        {/* Interactive Experience Layout */}
        <div id="experience-layout-container" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Tab Selector Column (Left) */}
          <div id="experience-tabs-col" className="lg:col-span-4 flex flex-col gap-2.5">
            <h3 className="font-mono text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 pl-3">
              Organizations & Milestones
            </h3>
            {experiences.map((exp: ExperienceItem, idx: number) => (
              <button
                key={exp.company}
                id={`exp-tab-btn-${idx}`}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-4.5 p-4 rounded-xl text-left border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#3333FF] w-full ${
                  activeTab === idx
                    ? 'bg-white border-[#3333FF] shadow-sm'
                    : 'bg-transparent border-transparent hover:bg-white/50 text-gray-500 hover:text-gray-900'
                }`}
              >
                {/* 3-line spanning circular favicon */}
                <div className="flex-shrink-0">
                  {getCompanyFavicon(exp.company) ? (
                    <img
                      src={getCompanyFavicon(exp.company)!}
                      alt={`${exp.company} favicon`}
                      className="w-12 h-12 rounded-full object-cover border border-gray-200 p-0.5 bg-white shadow-2xs"
                    />
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-2xs`}
                    >
                      <span
                        className={`w-3 h-3 rounded-full ${
                          activeTab === idx ? 'bg-[#3333FF]' : 'bg-gray-300'
                        }`}
                      />
                    </div>
                  )}
                </div>

                {/* Right side: 3 lines of structured content */}
                <div className="flex-1 min-w-0">
                  <span className="block font-display font-bold text-sm tracking-tight text-gray-900">
                    {exp.company}
                  </span>
                  <span className="block font-sans text-xs text-gray-500 mt-1 leading-snug">
                    {exp.role}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[10px] text-gray-400 mt-1.5 leading-none">
                    <Calendar className="w-3 h-3 flex-shrink-0" /> {exp.period}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Tab Content Display Column (Right) */}
          <div id="experience-content-col" className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl p-8 md:p-10 shadow-3xs relative overflow-hidden">
            
            {/* Top Accent Ring */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-accent" />

            {/* Content Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full font-sans mb-3">
                  <Briefcase className="w-3 h-3" /> {experiences[activeTab].type || 'Full-time'}
                </span>
                <h3 className="font-display font-bold text-gray-900 text-xl sm:text-2xl tracking-tight">
                  {experiences[activeTab].role}
                </h3>
                <h4 className="font-display text-base font-semibold text-gray-600 mt-1 flex items-center gap-2">
                  {getCompanyFavicon(experiences[activeTab].company) && (
                    <img
                      src={getCompanyFavicon(experiences[activeTab].company)!}
                      alt={`${experiences[activeTab].company} favicon`}
                      className="w-5 h-5 rounded-full object-contain border border-gray-200"
                    />
                  )}
                  {renderCompanyLinks(experiences[activeTab].company)}
                </h4>
              </div>

              <div className="flex flex-col items-end text-right">
                <span className="font-mono text-xs font-semibold text-gray-700 bg-gray-50 px-3 py-1 rounded-md border border-gray-100 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" /> {experiences[activeTab].period}
                </span>
                <span className="text-[10px] text-gray-400 font-mono mt-1 flex items-center gap-1 justify-end">
                  <MapPin className="w-3 h-3" /> San Francisco Bay Area, CA
                </span>
              </div>
            </div>

            {/* Experience Paragraph */}
            <div className="mt-6">
              <p className="font-sans text-sm text-gray-700 leading-relaxed italic bg-[#E4F0E7]/30 p-4 rounded-lg border-l-4 border-[#3333FF]">
                {renderTextWithLinks(experiences[activeTab].description)}
              </p>
            </div>

            {/* Bullet List accomplishments */}
            <div className="mt-8 flex flex-col gap-4">
              <h5 className="font-mono text-[11px] font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1">
                <Award className="w-4 h-4 text-gray-600" /> Core Accomplishments & Metrics
              </h5>
              
              <ul className="flex flex-col gap-3.5">
                {experiences[activeTab].bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex gap-3 items-start">
                    <ChevronRight className="w-4.5 h-4.5 text-[#3333FF] shrink-0 mt-0.5" />
                    <span className="font-sans text-sm text-gray-600 leading-relaxed">
                      {renderTextWithLinks(bullet)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills Utilized in this Period */}
            <div className="mt-10 pt-6 border-t border-gray-100">
              <h5 className="font-mono text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-3">
                Skills & Technologies Applied
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {experiences[activeTab].skillsUsed.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 bg-[#E4F0E7] hover:bg-[#D4E6D9] text-[#3333FF] border border-[#3333FF] rounded-lg text-xs font-medium transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
