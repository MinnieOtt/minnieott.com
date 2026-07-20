import React from 'react';
import { ExternalLink, Layers, Target, ShieldCheck, Globe, Bike, Award, Sparkles, Check, CheckCircle } from 'lucide-react';
import { portfolioApps } from '../data/resumeData';
import { AppPortfolioItem } from '../types';

export default function Portfolio() {
  // Map an elegant Lucide icon based on the app name
  const getAppIcon = (name: string) => {
    switch (name) {
      case 'Creative Blue GrowthOS':
        return <Layers className="w-5 h-5 text-indigo-600" />;
      case 'Lead Generator':
        return <Target className="w-5 h-5 text-rose-500" />;
      case 'Brand Assessment':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'Grex World':
        return <Globe className="w-5 h-5 text-emerald-600" />;
      case 'Regnum Dei':
        return <ShieldCheck className="w-5 h-5 text-blue-600" />;
      case 'Just Ride':
        return <Bike className="w-5 h-5 text-sky-500" />;
      default:
        return <Layers className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <section id="portfolio" className="py-24 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div id="portfolio-section-header" className="max-w-3xl mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#3333FF] bg-[#E4F0E7] px-3 py-1 rounded-full">
            Technical Case Studies
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 tracking-tight mt-3 mb-4">
            Deployed Software & AI Solutions
          </h2>
          <p className="font-sans text-base text-gray-600 leading-relaxed">
            Discover the production-ready applications, orchestration pipelines, and client solutions I have conceptualized, designed, and deployed as a Head of Technology and System Architect.
          </p>
        </div>

        {/* Key Impact Summary */}
        <div id="key-impact-summary" className="mb-16 p-8 bg-neutral-50 rounded-2xl border border-gray-100 relative overflow-hidden">
          {/* Subtle top border decorative accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#3333FF]" />
          
          <h3 className="font-display font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-gray-700" /> Key Impact Summary
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Highlight 1 */}
            <div id="impact-item-1" className="bg-white p-5 rounded-xl border border-gray-100 flex gap-4 hover:shadow-xs transition-shadow duration-200">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-[#E4F0E7] flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#3333FF]" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm text-gray-900 leading-tight">
                  50+ Google Maps Features
                </h4>
                <p className="font-sans text-xs text-gray-500 mt-1 leading-relaxed">
                  Led end-to-end SDLC from requirements to global production with Gemini Voice Navigation.
                </p>
              </div>
            </div>

            {/* Highlight 2 */}
            <div id="impact-item-2" className="bg-white p-5 rounded-xl border border-gray-100 flex gap-4 hover:shadow-xs transition-shadow duration-200">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-[#E4F0E7] flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#3333FF]" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm text-gray-900 leading-tight">
                  $150M Operational Efficiencies
                </h4>
                <p className="font-sans text-xs text-gray-500 mt-1 leading-relaxed">
                  Drove AI Service Desk transformation, optimizing tickets with intelligent automated routing.
                </p>
              </div>
            </div>

            {/* Highlight 3 */}
            <div id="impact-item-3" className="bg-white p-5 rounded-xl border border-gray-100 flex gap-4 hover:shadow-xs transition-shadow duration-200">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-[#E4F0E7] flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#3333FF]" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm text-gray-900 leading-tight">
                  Agentic Workflows Specialist
                </h4>
                <p className="font-sans text-xs text-gray-500 mt-1 leading-relaxed">
                  Pioneered <a href="#portfolio-creative-blue-growthos" className="text-[#3333FF] hover:underline font-medium">GrowthOS</a>, <a href="#portfolio-lead-generator" className="text-[#3333FF] hover:underline font-medium">Lead Generator</a>, and <a href="https://creative-blue-brand-assessment-553545205591.us-west1.run.app/" target="_blank" rel="noopener noreferrer" className="text-[#3333FF] hover:underline font-medium">Brand Booster</a> platforms using advanced LLM pipelines.
                </p>
              </div>
            </div>

            {/* Highlight 4 */}
            <div id="impact-item-4" className="bg-white p-5 rounded-xl border border-gray-100 flex gap-4 hover:shadow-xs transition-shadow duration-200">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-[#E4F0E7] flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#3333FF]" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm text-gray-900 leading-tight">
                  Stanford LEAD Scholar
                </h4>
                <p className="font-sans text-xs text-gray-500 mt-1 leading-relaxed">
                  Distinguished GSB Scholar, serving on the Community Advisory Board.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div id="portfolio-bento-grid" className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          {portfolioApps.map((app: AppPortfolioItem, index: number) => {
            const isFlagship = app.isFlagship;
            const hasLiveUrl = app.url && app.url !== '#';
            
            const cardId = app.name === 'Creative Blue GrowthOS' 
              ? 'portfolio-creative-blue-growthos' 
              : app.name === 'Lead Generator' 
              ? 'portfolio-lead-generator' 
              : app.name === 'Brand Assessment' 
              ? 'portfolio-brand-assessment' 
              : `portfolio-card-${index}`;

            return (
              <div
                key={app.name}
                id={cardId}
                className={`group bg-neutral-50 hover:bg-white rounded-2xl border border-gray-100 hover:border-accent shadow-2xs hover:shadow-md transition-all duration-300 p-8 flex flex-col justify-between relative overflow-hidden scroll-mt-24 ${
                  isFlagship ? 'lg:col-span-4' : 'lg:col-span-2'
                }`}
              >
                {/* Visual Top Highlight Accent */}
                {isFlagship && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />
                )}

                <div className="flex flex-col gap-6">
                  {/* Card Header Info */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-3xs group-hover:bg-accent-light transition-colors duration-300">
                        {getAppIcon(app.name)}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-gray-900 text-lg tracking-tight group-hover:text-gray-950">
                          {app.name}
                        </h3>
                        <p className="font-mono text-[10px] text-gray-500 font-semibold uppercase tracking-wider mt-0.5">
                          {app.role}
                        </p>
                      </div>
                    </div>

                    {isFlagship && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E4F0E7] text-[#3333FF] border border-[#3333FF] font-mono">
                        Flagship Platform
                      </span>
                    )}
                  </div>

                  {/* App Description */}
                  <p className="font-sans text-sm text-gray-600 leading-relaxed">
                    {app.description}
                  </p>

                  {/* Achievements/Scope Bullets */}
                  <div className="flex flex-col gap-2.5 mt-2">
                    <h4 className="font-mono text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                      Technical Contributions:
                    </h4>
                    <ul className="flex flex-col gap-2">
                      {app.bulletPoints.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex gap-2.5 items-start">
                          <Check className="w-4 h-4 text-[#3333FF] shrink-0 mt-0.5" />
                          <span className="font-sans text-xs text-gray-500 leading-normal">
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Meta & Actions */}
                <div className="mt-8 pt-6 border-t border-gray-100/60 flex flex-wrap gap-4 items-center justify-between">
                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 max-w-[70%]">
                    {app.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-white border border-gray-100 rounded text-[10px] font-mono text-gray-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Launch Link Button */}
                  {hasLiveUrl ? (
                    <a
                      id={`portfolio-link-${index}`}
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-800 hover:text-[#6666FF] transition-colors group/btn"
                    >
                      Launch App
                      <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </a>
                  ) : (
                    <span className="text-[11px] font-mono font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">
                      Just Ride Framework
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
