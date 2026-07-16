import React from 'react';
import { Award, BookOpen, GraduationCap, Scale, ChevronRight, Bookmark, ExternalLink } from 'lucide-react';
import { patents, books, certifications, education } from '../data/resumeData';

export default function EducationCertifications() {
  return (
    <section id="credentials" className="py-24 bg-neutral-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div id="credentials-section-header" className="max-w-3xl mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#3333FF] bg-[#F0F0FF] px-3 py-1 rounded-full">
            Scholastics & IP
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 tracking-tight mt-3 mb-4">
            Education, Patents & Authoring
          </h2>
          <p className="font-sans text-base text-gray-600 leading-relaxed">
            Academic foundations, certified engineering training, and registered intellectual property spanning over two decades of technical leadership.
          </p>
        </div>

        {/* Credentials Grid */}
        <div id="credentials-main-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Education & Patents */}
          <div id="education-patents-col" className="lg:col-span-7 flex flex-col gap-8">
            
            {/* Patents Card */}
            <div id="patent-card-block" className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-3xs relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1 bg-[#3333FF]" />
              <h3 className="font-display font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-500" /> Intellectual Property
              </h3>
              {patents.map((pat) => (
                <div key={pat.id} id={`patent-item-${pat.id.replace(/\s+/g, '-').toLowerCase()}`} className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold text-[#3333FF] bg-[#E6E6FF] px-2 py-0.5 rounded">
                      {pat.id}
                    </span>
                    <a
                      id="view-patent-btn"
                      href={pat.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-gray-400 hover:text-gray-900 underline transition-colors"
                    >
                      View Patent Official
                    </a>
                  </div>
                  <h4 className="font-sans font-bold text-sm text-gray-900 leading-snug mt-1">
                    {pat.title}
                  </h4>
                  <p className="font-sans text-xs text-gray-500 mt-1 leading-relaxed">
                    {pat.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Book Editing Card */}
            <div id="book-card-block" className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-3xs relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1 bg-[#3333FF]" />
              <h3 className="font-display font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" /> Publications
              </h3>
              <div className="flex gap-4">
                <div className="w-12 h-16 bg-[#F0F0FF] rounded-md border border-[#3333FF] flex items-center justify-center shrink-0">
                  <Bookmark className="w-6 h-6 text-[#3333FF]" />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {books.role}
                    </span>
                    <a
                      id="jmx-book-link"
                      href={books.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-gray-400 hover:text-gray-900 underline transition-colors"
                    >
                      Google Books
                    </a>
                  </div>
                  <h4 className="font-sans font-bold text-sm text-gray-900 mt-1.5">
                    {books.title}
                  </h4>
                  <p className="font-sans text-xs text-gray-500 mt-0.5">
                    Authored by {books.author}
                  </p>
                  <p className="font-sans text-xs text-gray-500 mt-2 leading-relaxed">
                    {books.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Education */}
            <div id="education-card-block" className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-3xs relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1 bg-[#3333FF]" />
              <h3 className="font-display font-bold text-gray-900 text-base mb-6 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" /> Education
              </h3>

              <div className="flex flex-col gap-6">
                {education.map((edu, idx) => (
                  <div key={edu.school} id={`edu-item-${idx}`} className="flex flex-col gap-1 pb-6 last:pb-0 last:border-b-0 border-b border-gray-100/60">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <h4 className="font-display font-bold text-sm text-gray-900">
                        {edu.school}
                      </h4>
                      {edu.period && (
                        <span className="font-mono text-[10px] text-gray-400">
                          {edu.period}
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-xs font-semibold text-[#3333FF] mt-0.5">
                      {edu.degree}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {edu.honors?.map((honor) => (
                        <span
                          key={honor}
                          className="px-2 py-0.5 bg-[#F0F0FF] border border-[#3333FF] rounded-md text-[10px] font-mono text-gray-600"
                        >
                          {honor}
                        </span>
                      ))}
                    </div>
                    <p className="font-sans text-xs text-gray-500 mt-3 leading-relaxed">
                      {edu.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Certifications */}
          <div id="certifications-col" className="lg:col-span-5">
            <div id="certifications-card-block" className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-3xs relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-accent" />
              <h3 className="font-display font-bold text-gray-900 text-base mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" /> Certifications
              </h3>

              <div className="flex flex-col gap-4">
                {certifications.map((cert, idx) => (
                  <div
                    key={cert.title}
                    id={`cert-item-${idx}`}
                    className="flex flex-col p-4 rounded-xl border border-gray-50 hover:border-[#3333FF]/30 bg-neutral-50/50 hover:bg-white transition-all duration-200"
                  >
                    <div className="flex gap-3.5 items-start">
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0">
                        <Award className="w-4.5 h-4.5 text-[#3333FF]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {cert.link ? (
                          <a
                            href={cert.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link inline-flex items-center gap-1 hover:text-[#3333FF] transition-colors"
                          >
                            <h4 className="font-sans font-bold text-xs text-gray-900 leading-normal group-hover/link:text-[#3333FF] transition-colors">
                              {cert.title}
                            </h4>
                            <ExternalLink className="w-3.5 h-3.5 text-gray-400 shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                          </a>
                        ) : (
                          <h4 className="font-sans font-bold text-xs text-gray-900 leading-normal">
                            {cert.title}
                          </h4>
                        )}
                        <p className="font-mono text-[10px] text-gray-400 mt-1">
                          Issued by {cert.issuer}
                        </p>
                      </div>
                    </div>
                    {/* Render secondary links if they exist */}
                    {cert.links && cert.links.length > 0 && (
                      <div className="mt-3 pl-11 flex flex-wrap gap-2">
                        {cert.links.map((lnk) => (
                          <a
                            key={lnk.url}
                            href={lnk.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-[10px] text-[#3333FF] hover:text-indigo-800 bg-white hover:bg-[#F0F0FF] border border-gray-100 hover:border-[#3333FF]/30 px-2.5 py-1 rounded transition-all"
                          >
                            <span>{lnk.label}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
