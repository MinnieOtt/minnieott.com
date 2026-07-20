import React from 'react';
import { Volume2, ExternalLink, Presentation, Award } from 'lucide-react';
import { speakerEvents } from '../data/resumeData';

export default function Speaker() {
  return (
    <section id="speaker" className="py-24 bg-neutral-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div id="speaker-section-header" className="max-w-3xl mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#3333FF] bg-[#E4F0E7] px-3 py-1 rounded-full">
            Keynotes & Mentorship
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 tracking-tight mt-3 mb-4">
            Speaker Series & Panels
          </h2>
          <p className="font-sans text-base text-gray-600 leading-relaxed">
            Leading conversations on engineering execution, cross-cultural leadership, diversity in STEM, and technology transition. Connecting industry with academia to foster future technical leaders.
          </p>
        </div>

        {/* Speaker Cards Grid */}
        <div id="speaker-cards-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {speakerEvents.map((evt, idx) => (
            <div
              key={evt.event}
              id={`speaker-card-${idx}`}
              className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 hover:shadow-sm transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
            >
              {/* Top border decoration */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3333FF] to-indigo-500" />
              
              <div>
                {/* Icon and Title */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#E4F0E7] border border-[#3333FF]/10 flex items-center justify-center shrink-0">
                    {idx === 0 ? (
                      <Presentation className="w-5 h-5 text-[#3333FF]" />
                    ) : (
                      <Award className="w-5 h-5 text-[#3333FF]" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-gray-900 text-lg sm:text-xl tracking-tight leading-snug">
                      {evt.event}
                    </h3>
                  </div>
                </div>

                <p className="font-sans text-sm text-gray-600 leading-relaxed mb-6">
                  {evt.description}
                </p>
              </div>

              {/* Event Links */}
              <div className="border-t border-gray-100 pt-5 mt-auto flex flex-wrap items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-gray-400 font-bold mr-1">
                  Event Coverage:
                </span>
                {evt.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-[#3333FF] hover:text-indigo-800 bg-neutral-50 border border-gray-100 hover:border-[#3333FF]/30 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
