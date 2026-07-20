import React from 'react';
import { Cpu, Users, Globe2, BookOpen, Layers } from 'lucide-react';
import { skillCategories } from '../data/resumeData';

export default function Skills() {
  const getCategoryIcon = (name: string) => {
    if (name.includes('Technical')) return <Cpu className="w-5 h-5 text-indigo-600" />;
    if (name.includes('Leadership')) return <Users className="w-5 h-5 text-emerald-600" />;
    return <Globe2 className="w-5 h-5 text-amber-500" />;
  };

  return (
    <section id="skills" className="py-24 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div id="skills-section-header" className="max-w-3xl mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#3333FF] bg-[#E4F0E7] px-3 py-1 rounded-full">
            Technical Stack & Core Focus
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 tracking-tight mt-3 mb-4">
            Skill Inventory & Domain Expertise
          </h2>
          <p className="font-sans text-base text-gray-600 leading-relaxed">
            Combining direct technical AI/ML systems knowledge with elite executive program management. Explore my structured domains of mastery.
          </p>
        </div>

        {/* Skill Panels Grid */}
        <div id="skills-panel-grid" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillCategories.map((cat) => (
            <div
              key={cat.name}
              id={`skills-card-${cat.name.replace(/\s+/g, '-').toLowerCase()}`}
              className="bg-neutral-50 rounded-2xl border border-gray-100 p-6 md:p-8 hover:shadow-xs transition-shadow duration-300 relative overflow-hidden"
            >
              {/* Subtle top decoration */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#3333FF]" />

              {/* Title & Icon */}
              <div className="flex items-center gap-3 pb-6 border-b border-gray-100/60 mb-6">
                <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center shadow-3xs">
                  {getCategoryIcon(cat.name)}
                </div>
                <h3 className="font-display font-bold text-gray-900 text-base tracking-tight">
                  {cat.name}
                </h3>
              </div>

              {/* Skill bars */}
              <div className="flex flex-col gap-5">
                {cat.skills.map((skill) => (
                  <div key={skill.name} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs font-medium">
                      <span className="font-sans text-gray-700 font-semibold">{skill.name}</span>
                      <span className="font-mono text-gray-400">{skill.level}%</span>
                    </div>
                    {/* Background track */}
                    <div className="w-full h-1.5 bg-gray-200/60 rounded-full overflow-hidden">
                      {/* Active indicator */}
                      <div
                        className="h-full bg-[#3333FF] rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Methodology Footer Quote */}
        <div id="skills-methodology-quote" className="mt-12 bg-[#E4F0E7]/30 border border-[#3333FF]/40 rounded-xl p-6 flex flex-col md:flex-row items-center gap-5 max-w-4xl mx-auto">
          <div className="w-12 h-12 shrink-0 rounded-full bg-white border border-[#3333FF] flex items-center justify-center shadow-3xs">
            <BookOpen className="w-6 h-6 text-[#3333FF]" />
          </div>
          <div>
            <h4 className="font-display font-bold text-gray-900 text-sm tracking-tight">
              A Culture of Hands-On Technical Competency
            </h4>
            <p className="font-sans text-xs text-gray-500 mt-1 leading-relaxed">
              Minerva believes that great program management stems from deep technical fluency. Through direct software design at Apple and Google, and continuing development of Generative AI platforms, she leads from the front.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
