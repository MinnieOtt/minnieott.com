import React from 'react';
import { 
  ExternalLink, Layers, Target, ShieldCheck, Globe, Bike, Sparkles, Check 
} from 'lucide-react';
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
        <div id="key-impact-summary" className="mb-16 p-8 bg-neutral-50 rounded-2xl border border-gray-150 relative overflow-hidden">
          {/* Subtle top border decorative accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#3333FF]" />
          
          <h3 className="font-display font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
            Professional Profile & Engineering Leadership
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
            <div className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                As a hands-on, full-stack systems architect, I balance strategic leadership with tactical software execution. I specialize in building custom ingestion brokers, high-frequency lead routing, automated outreach pipelines, and highly optimized UI environments.
              </p>
            </div>
            <div className="bg-white border border-gray-150 p-6 rounded-xl space-y-4 shadow-3xs">
              <h4 className="font-mono text-xs font-bold text-gray-400 uppercase tracking-widest">
                Academic & Community Roles
              </h4>
              <div className="space-y-3">
                <p className="font-sans text-xs text-gray-600 leading-relaxed">
                  <strong>Stanford University Graduate School of Business</strong>
                </p>
                <p className="font-sans text-xs text-gray-500 mt-1 leading-relaxed">
                  <a 
                    href="https://drive.google.com/file/d/1c7rR9-_DKWr6xtb830n2grkC4RVNF1LE/view" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-[#3333FF] hover:underline transition-colors font-medium text-gray-700"
                  >
                    Distinguished GSB Scholar
                  </a>, serving on the <a 
                    href="https://drive.google.com/file/d/1gVjsnaXSuVHlDPTtdT2gzDKJiPtSEikt/view?usp=sharing" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-[#3333FF] hover:underline transition-colors font-medium text-gray-700"
                  >
                    Community Advisory Board
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Rows */}
        <div id="portfolio-rows" className="flex flex-col gap-8">
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
                className="group bg-neutral-50 hover:bg-white rounded-2xl border border-gray-150 hover:border-[#3333FF]/40 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col relative overflow-hidden scroll-mt-24"
              >
                {/* Visual Left Highlight Accent for Flagship on Desktop */}
                {isFlagship && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#3333FF] z-10" />
                )}

                {/* App Contribution Details */}
                <div className="p-6 md:p-8 flex flex-col justify-between">
                  <div className="flex flex-col gap-6">
                    {/* Card Header Info */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-3xs group-hover:bg-indigo-50 transition-colors duration-300">
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
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E4F0E7] text-[#3333FF] border border-[#3333FF]/40 font-mono">
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
                  <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-4 items-center justify-between">
                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-1.5 max-w-full sm:max-w-[60%]">
                      {app.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-white border border-gray-100 rounded text-[10px] font-mono text-gray-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center gap-3">
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
                        <span className="text-[11px] font-mono font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded">
                          Just Ride Framework
                        </span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
