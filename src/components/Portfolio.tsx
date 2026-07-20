import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ExternalLink, Layers, Target, ShieldCheck, Globe, Bike, Award, Sparkles, Check, CheckCircle, 
  Sliders, Play, PlayCircle, Terminal, Code, Activity, Zap, RefreshCw, X, Search 
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

  const [expandedDemos, setExpandedDemos] = React.useState<Record<string, boolean>>({
    'Creative Blue GrowthOS': true, // Open flagship by default
  });

  const [isLargeScreen, setIsLargeScreen] = React.useState(true);

  React.useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    setIsLargeScreen(media.matches);
    
    const listener = (e: MediaQueryListEvent) => {
      setIsLargeScreen(e.matches);
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const toggleDemo = (name: string) => {
    setExpandedDemos(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // --- Interactive Simulator States ---
  
  // 1. Creative Blue GrowthOS States
  const [growthTab, setGrowthTab] = React.useState<'seo' | 'lead' | 'forecast'>('seo');
  const [growthSeoKeyword, setGrowthSeoKeyword] = React.useState('sustainable fashion');
  const [growthSeoResult, setGrowthSeoResult] = React.useState<string[]>([]);
  const [isGrowthSeoLoading, setIsGrowthSeoLoading] = React.useState(false);
  
  const [growthLeadSector, setGrowthLeadSector] = React.useState('e-commerce');
  const [growthLeads, setGrowthLeads] = React.useState<{ name: string; fit: string; contact: string }[]>([]);
  const [isGrowthLeadLoading, setIsGrowthLeadLoading] = React.useState(false);

  // 2. Lead Generator States
  const [icpIndustry, setIcpIndustry] = React.useState('SaaS');
  const [icpMinScore, setIcpMinScore] = React.useState(85);
  const [icpLeads, setIcpLeads] = React.useState<{ name: string; score: number; strategy: string }[]>([]);
  const [isIcpLoading, setIsIcpLoading] = React.useState(false);

  // 3. Brand Assessment States
  const [brandNameInput, setBrandNameInput] = React.useState('MinnieTech');
  const [brandReport, setBrandReport] = React.useState<{ sentiment: string; sov: string; recommendation: string } | null>(null);
  const [isBrandLoading, setIsBrandLoading] = React.useState(false);

  // 4. Grex World States
  const [grexCategory, setGrexCategory] = React.useState('software');
  const [grexMatch, setGrexMatch] = React.useState<{ project: string; bounty: string; healthTier: string; desc: string } | null>(null);
  const [isGrexLoading, setIsGrexLoading] = React.useState(false);

  // 5. Regnum Dei States
  const [rdTheme, setRdTheme] = React.useState<'default' | 'warm' | 'dark'>('default');
  const [rdWidth, setRdWidth] = React.useState(100);

  // 6. Just Ride States
  const [jrWeather, setJrWeather] = React.useState<'sunny' | 'rainy' | 'windy'>('sunny');
  const [jrRacerCount, setJrRacerCount] = React.useState(150);
  const [jrActiveTelemetry, setJrActiveTelemetry] = React.useState(false);
  const [jrLogs, setJrLogs] = React.useState<string[]>([]);

  // --- Handlers for Simulator Executions ---

  const handleRunSeo = () => {
    setIsGrowthSeoLoading(true);
    setTimeout(() => {
      setIsGrowthSeoLoading(false);
      setGrowthSeoResult([
        `Campaign Concept: Eco-Thread Revolution (${growthSeoKeyword})`,
        `Key Strategy: Highlight LCA metrics & carbon transparency in search snippets.`,
        `Targeting: Millennial focus groups in major urban hubs.`,
        `Suggested URL: /ethical-fashion-${growthSeoKeyword.toLowerCase().replace(/\s+/g, '-')}`
      ]);
    }, 700);
  };

  const handleRunGrowthLeads = () => {
    setIsGrowthLeadLoading(true);
    setTimeout(() => {
      setIsGrowthLeadLoading(false);
      setGrowthLeads([
        { name: 'GreenWear Inc.', fit: '94% Confidence', contact: 'CEO / Founder' },
        { name: 'SustainaThread Labs', fit: '88% Confidence', contact: 'Head of Growth' },
        { name: 'PureOrigin Apparel', fit: '81% Confidence', contact: 'Marketing VP' }
      ]);
    }, 700);
  };

  const handleRunIcpProspector = () => {
    setIsIcpLoading(true);
    setTimeout(() => {
      setIsIcpLoading(false);
      const allLeads = [
        { name: 'ApexData Solutions', score: 94, strategy: 'Hyper-personalized outbound sequence focusing on API customer ingestion pipelines.' },
        { name: 'NovaSphere AI', score: 89, strategy: 'Direct outreach addressing operational overhead bottlenecks in middle office ticketing.' },
        { name: 'CloudSift Corp', score: 81, strategy: 'Inbound positioning centered around secure cloud database deployments.' }
      ];
      setIcpLeads(allLeads.filter(l => l.score >= icpMinScore));
    }, 700);
  };

  const handleRunBrandReport = () => {
    setIsBrandLoading(true);
    setTimeout(() => {
      setIsBrandLoading(false);
      const score = Math.min(100, Math.max(70, 75 + (brandNameInput.length % 5) * 5));
      setBrandReport({
        sentiment: `${score}% Positive Sentiment Score`,
        sov: `${(5.2 + (brandNameInput.length % 3) * 3).toFixed(1)}% Share of Voice`,
        recommendation: `Increase technical authority by publishing regular updates on ${brandNameInput}'s medium-specific engineering milestones.`
      });
    }, 700);
  };

  const handleRunGrexMatching = () => {
    setIsGrexLoading(true);
    setTimeout(() => {
      setIsGrexLoading(false);
      if (grexCategory === 'software') {
        setGrexMatch({
          project: 'Advanced Maps Voice Navigation Orchestrator',
          bounty: '$12,500 + Equity Option',
          healthTier: 'Kaiser Silver Plan Coverage (Fully Funded)',
          desc: 'Implements complex stream parser algorithms matching Stanford LEAD / Google lineages.'
        });
      } else if (grexCategory === 'pm') {
        setGrexMatch({
          project: 'Enterprise AI Service Desk Deployment',
          bounty: '$18,000 Contract',
          healthTier: 'Blue Shield Comprehensive Tier',
          desc: 'Orchestrating ticketing routing across 50,000+ seat enterprise deployments.'
        });
      } else {
        setGrexMatch({
          project: 'Responsive Brand Booster UI Design',
          bounty: '$6,200 Retainer',
          healthTier: 'Cigna Wellness Essential Package',
          desc: 'High-contrast desktop-first layout styling and modular SVG component library.'
        });
      }
    }, 600);
  };

  // Just Ride Telemetry Logging Timer Effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (jrActiveTelemetry) {
      setJrLogs([`[Parser] Starting race telemetry parsing stream...`]);
      let step = 0;
      interval = setInterval(() => {
        const timestamp = new Date().toLocaleTimeString();
        const telemetryEvents = [
          `[${timestamp}] Unified cycling race data from GPX stream.`,
          `[${timestamp}] Tracking telemetry performance for ${jrRacerCount} virtual racers.`,
          `[${timestamp}] Weather adjustment applied: ${jrWeather.toUpperCase()} weather factors loaded.`,
          `[${timestamp}] ${jrWeather === 'rainy' ? '[Warning] Adding +4.2s lap penalty due to rain drag.' : jrWeather === 'windy' ? '[Info] Adjusting draft multiplier: heavy headwind penalty.' : '[Info] Clear weather. Track speed normal.'}`,
          `[${timestamp}] Stream active. Parser state OK. 0 latency.`
        ];
        setJrLogs(prev => [...prev, telemetryEvents[step % telemetryEvents.length]].slice(-6));
        step++;
      }, 1500);
    } else {
      setJrLogs([]);
    }
    return () => clearInterval(interval);
  }, [jrActiveTelemetry, jrWeather, jrRacerCount]);

  // Render correct simulation widget
  const renderSimulatorContent = (appName: string) => {
    switch (appName) {
      case 'Creative Blue GrowthOS':
        return (
          <div className="flex flex-col gap-4 h-full justify-between">
            <div className="space-y-4">
              <div className="flex gap-1.5 p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setGrowthTab('seo')}
                  className={`flex-1 text-[11px] py-1 px-1.5 rounded-md font-medium transition-all cursor-pointer ${
                    growthTab === 'seo' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  SEO Agent
                </button>
                <button
                  onClick={() => setGrowthTab('lead')}
                  className={`flex-1 text-[11px] py-1 px-1.5 rounded-md font-medium transition-all cursor-pointer ${
                    growthTab === 'lead' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Lead Radar
                </button>
                <button
                  onClick={() => setGrowthTab('forecast')}
                  className={`flex-1 text-[11px] py-1 px-1.5 rounded-md font-medium transition-all cursor-pointer ${
                    growthTab === 'forecast' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Forecast
                </button>
              </div>

              {growthTab === 'seo' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Target Keyword</label>
                    <input
                      type="text"
                      value={growthSeoKeyword}
                      onChange={(e) => setGrowthSeoKeyword(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#3333FF]"
                    />
                  </div>
                  <button
                    onClick={handleRunSeo}
                    disabled={isGrowthSeoLoading}
                    className="w-full py-1.5 px-3 bg-[#3333FF] text-white hover:bg-[#2222DD] text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isGrowthSeoLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                    Orchestrate AI
                  </button>
                  {growthSeoResult.length > 0 && (
                    <div className="bg-white border border-gray-100 rounded-lg p-2.5 space-y-1">
                      {growthSeoResult.map((res, i) => (
                        <p key={i} className="text-[11px] text-gray-600 leading-normal border-b border-gray-50 pb-1 last:border-0 last:pb-0 font-sans">
                          {res}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {growthTab === 'lead' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Business Sector</label>
                    <input
                      type="text"
                      value={growthLeadSector}
                      onChange={(e) => setGrowthLeadSector(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#3333FF]"
                    />
                  </div>
                  <button
                    onClick={handleRunGrowthLeads}
                    disabled={isGrowthLeadLoading}
                    className="w-full py-1.5 px-3 bg-[#3333FF] text-white hover:bg-[#2222DD] text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isGrowthLeadLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                    Scan Radar
                  </button>
                  {growthLeads.length > 0 && (
                    <div className="bg-white border border-gray-100 rounded-lg p-2.5 space-y-2">
                      {growthLeads.map((l, i) => (
                        <div key={i} className="flex justify-between items-center text-[11px] border-b border-gray-50 pb-1.5 last:border-0 last:pb-0">
                          <div>
                            <p className="font-semibold text-gray-800 font-sans">{l.name}</p>
                            <p className="text-[10px] text-gray-400 font-sans">{l.contact}</p>
                          </div>
                          <span className="text-[10px] font-semibold bg-[#E4F0E7] text-[#3333FF] px-1.5 py-0.5 rounded font-mono">
                            {l.fit}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {growthTab === 'forecast' && (
                <div className="space-y-3 bg-white p-3 rounded-lg border border-gray-150">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Efficiency Forecast</span>
                    <span className="font-bold text-[#3333FF]">+22%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#3333FF] h-full" style={{ width: '78%' }} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-[11px]">
                    <div>
                      <p className="text-gray-400">Payroll Saved</p>
                      <p className="font-semibold text-gray-800 font-sans">$14,200/mo</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Agents Active</p>
                      <p className="font-semibold text-gray-800 font-sans">4 Instances</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-2.5 flex gap-2 items-start mt-4">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-[10px] text-amber-700 leading-normal font-sans">
                <strong>GrowthOS Cockpit coming soon in v2.0.</strong> This simulator demonstrates the live orchestration model that aggregates background pipelines into a unified view.
              </div>
            </div>
          </div>
        );

      case 'Lead Generator':
        return (
          <div className="flex flex-col gap-4 h-full justify-between">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Target Segment</label>
                  <input
                    type="text"
                    value={icpIndustry}
                    onChange={(e) => setIcpIndustry(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#3333FF]"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-gray-500">
                    <span>Min Fit Score</span>
                    <span>{icpMinScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="100"
                    value={icpMinScore}
                    onChange={(e) => setIcpMinScore(Number(e.target.value))}
                    className="w-full accent-[#3333FF] cursor-pointer"
                  />
                </div>
              </div>

              <button
                onClick={handleRunIcpProspector}
                disabled={isIcpLoading}
                className="w-full py-1.5 px-3 bg-[#3333FF] text-white hover:bg-[#2222DD] text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isIcpLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                Run Prospect Scanner
              </button>

              {icpLeads.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-lg p-2.5 space-y-3">
                  <p className="text-[10px] font-mono text-gray-400">Scanned 419 firms matching "{icpIndustry}"</p>
                  {icpLeads.map((l, i) => (
                    <div key={i} className="space-y-1 border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span className="text-gray-800 font-sans">{l.name}</span>
                        <span className="text-[#3333FF] font-mono">{l.score}% score</span>
                      </div>
                      <p className="text-[10px] text-gray-500 leading-normal font-sans">{l.strategy}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-2.5 flex gap-2 items-start mt-4">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-[10px] text-amber-700 leading-normal font-sans">
                <strong>Sales Agentic playground coming soon.</strong> Set ICP criteria to instantly scan, qualify, and score mock market targets in real time.
              </div>
            </div>
          </div>
        );

      case 'Brand Assessment':
        return (
          <div className="flex flex-col gap-4 h-full justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Brand / Competitor Name</label>
                <input
                  type="text"
                  value={brandNameInput}
                  onChange={(e) => setBrandNameInput(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#3333FF]"
                />
              </div>

              <button
                onClick={handleRunBrandReport}
                disabled={isBrandLoading}
                className="w-full py-1.5 px-3 bg-[#3333FF] text-white hover:bg-[#2222DD] text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isBrandLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                Verify Sentiment Index
              </button>

              {brandReport && (
                <div className="bg-white border border-gray-100 rounded-lg p-2.5 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-gray-50 p-2 rounded border border-gray-100 text-center">
                      <p className="text-gray-400 text-[9px] uppercase tracking-wider font-mono">Sentiment</p>
                      <p className="font-semibold text-emerald-600 mt-0.5 font-sans">{brandReport.sentiment.split(' ')[0]}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded border border-gray-100 text-center">
                      <p className="text-gray-400 text-[9px] uppercase tracking-wider font-mono">Share of Voice</p>
                      <p className="font-semibold text-[#3333FF] mt-0.5 font-sans">{brandReport.sov.split(' ')[0]}</p>
                    </div>
                  </div>
                  <div className="pt-1.5 text-[10px] text-gray-500 leading-normal font-sans">
                    <strong>Next Action:</strong> {brandReport.recommendation}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-2.5 flex gap-2 items-start mt-4">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-[10px] text-amber-700 leading-normal font-sans">
                <strong>NLP Sentiment Index playground coming soon.</strong> Feed a handle or tag to index across global sentiment, search volumes, and cross-channel visibility.
              </div>
            </div>
          </div>
        );

      case 'Grex World':
        return (
          <div className="flex flex-col gap-4 h-full justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Expertise / Category</label>
                <div className="flex flex-wrap gap-1.5">
                  {['software', 'pm', 'design'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setGrexCategory(cat)}
                      className={`text-[10px] py-1 px-2.5 rounded-full border cursor-pointer font-medium transition-colors ${
                        grexCategory === cat
                          ? 'bg-[#3333FF] border-[#3333FF] text-white'
                          : 'bg-white border-gray-200 text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      {cat === 'software' ? 'Software Eng.' : cat === 'pm' ? 'Technical PM' : 'UX Design'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleRunGrexMatching}
                disabled={isGrexLoading}
                className="w-full py-1.5 px-3 bg-[#3333FF] text-white hover:bg-[#2222DD] text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isGrexLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                Find Gig & Health Match
              </button>

              {grexMatch && (
                <div className="bg-white border border-gray-100 rounded-lg p-2.5 space-y-2 text-[11px]">
                  <div>
                    <span className="text-gray-400 font-sans">Match Award:</span>
                    <p className="font-semibold text-gray-800 font-sans">{grexMatch.project}</p>
                  </div>
                  <div className="flex justify-between items-center bg-[#E4F0E7] text-[#3333FF] p-2 rounded border border-emerald-150">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider font-semibold font-mono">Funded Health Plan</p>
                      <p className="font-bold text-[10px] font-sans">{grexMatch.healthTier}</p>
                    </div>
                    <span className="font-bold text-xs font-mono">{grexMatch.bounty.split(' ')[0]}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-normal font-sans">{grexMatch.desc}</p>
                </div>
              )}
            </div>

            <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-2.5 flex gap-2 items-start mt-4">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-[10px] text-amber-700 leading-normal font-sans">
                <strong>Grex AI Matchmaker coming soon.</strong> Connect freelancer portfolios to projects to yield immediate, co-funded healthcare partnership coverage.
              </div>
            </div>
          </div>
        );

      case 'Regnum Dei':
        return (
          <div className="flex flex-col gap-4 h-full justify-between">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Aesthetic Palette</label>
                  <div className="flex gap-2">
                    {['default', 'warm', 'dark'].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => setRdTheme(theme as any)}
                        className={`flex-1 text-[10px] py-1 px-1.5 rounded border font-medium cursor-pointer transition-colors ${
                          rdTheme === theme
                            ? 'bg-gray-900 border-gray-900 text-white'
                            : 'bg-white border-gray-200 text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        {theme === 'default' ? 'Divine Light' : theme === 'warm' ? 'Amber Sun' : 'Mystic Dark'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-gray-500">
                    <span>Mock Screen Size</span>
                    <span>{rdWidth}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={rdWidth}
                    onChange={(e) => setRdWidth(Number(e.target.value))}
                    className="w-full accent-gray-900 cursor-pointer"
                  />
                </div>
              </div>

              <div className="border border-gray-150 rounded-lg overflow-hidden bg-white h-24 flex items-center justify-center p-3 relative">
                <div
                  className="rounded-md border p-2 flex flex-col gap-1 shadow-3xs transition-all duration-300"
                  style={{
                    width: `${rdWidth}%`,
                    backgroundColor: rdTheme === 'default' ? '#FCFDFB' : rdTheme === 'warm' ? '#FFFBEB' : '#111827',
                    borderColor: rdTheme === 'default' ? '#3333FF' : rdTheme === 'warm' ? '#F59E0B' : '#4F46E5',
                    color: rdTheme === 'dark' ? '#F3F4F6' : '#1F2937'
                  }}
                >
                  <p className="font-display font-bold text-[9px] tracking-tight">Regnum Dei Mission</p>
                  <p className="text-[7px] leading-tight font-sans">Representing values & authentic connection with absolute visual precision.</p>
                  <span className="text-[6px] font-mono px-1 py-0.5 rounded self-start mt-1" style={{
                    backgroundColor: rdTheme === 'default' ? '#E4F0E7' : rdTheme === 'warm' ? '#FEF3C7' : '#374151',
                    color: rdTheme === 'default' ? '#3333FF' : rdTheme === 'warm' ? '#D97706' : '#818CF8',
                  }}>
                    Responsive layout OK
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-2.5 flex gap-2 items-start mt-4">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-[10px] text-amber-700 leading-normal font-sans">
                <strong>Divine Gallery coming soon.</strong> Reshaping the digital presence with advanced typographic scales, custom theme tokens, and dynamic, ultra-clean web views.
              </div>
            </div>
          </div>
        );

      case 'Just Ride':
        return (
          <div className="flex flex-col gap-4 h-full justify-between">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Race Environment</label>
                  <select
                    value={jrWeather}
                    onChange={(e: any) => setJrWeather(e.target.value)}
                    className="w-full text-xs px-2 py-1 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#3333FF]"
                  >
                    <option value="sunny">Sunny 22°C</option>
                    <option value="rainy">Heavy Rain</option>
                    <option value="windy">Heavy Headwind</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Racers Tracked</label>
                  <input
                    type="number"
                    value={jrRacerCount}
                    onChange={(e) => setJrRacerCount(Number(e.target.value))}
                    className="w-full text-xs px-2 py-1 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#3333FF]"
                  />
                </div>
              </div>

              <button
                onClick={() => setJrActiveTelemetry(!jrActiveTelemetry)}
                className={`w-full py-1.5 px-3 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  jrActiveTelemetry
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'bg-[#3333FF] hover:bg-[#2222DD] text-white'
                }`}
              >
                {jrActiveTelemetry ? <X className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                {jrActiveTelemetry ? 'Stop Telemetry Stream' : 'Sync Telemetry Pipeline'}
              </button>

              {jrActiveTelemetry && jrLogs.length > 0 && (
                <div className="bg-gray-950 border border-gray-800 rounded-lg p-2.5 font-mono text-[9px] text-green-400 space-y-1 h-28 overflow-y-auto">
                  {jrLogs.map((log, i) => (
                    <div key={i} className="leading-normal">
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-2.5 flex gap-2 items-start mt-4">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-[10px] text-amber-700 leading-normal font-sans">
                <strong>Just Ride Telemetry Dashboard coming soon.</strong> Stream, aggregate, and process multi-source cycling metrics through our unified athlete telemetry broker.
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 text-xs text-gray-500 text-center font-sans">
            Demo Simulator Coming Soon
          </div>
        );
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
                  Pioneered <a href="#portfolio-creative-blue-growthos" className="text-[#3333FF] hover:underline font-medium">GrowthOS</a>, <a href="#portfolio-lead-generator" className="text-[#3333FF] hover:underline font-medium">Lead Generator</a>, and <a href="https://creative-blue-brand-assessment-553545205591.us-west1.run.app/" target="_blank" rel="noopener noreferrer" className="text-[#3333FF] hover:underline font-medium font-sans">Brand Booster</a> platforms using advanced LLM pipelines.
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

        {/* Portfolio Rows */}
        <div id="portfolio-rows" className="flex flex-col gap-8">
          {portfolioApps.map((app: AppPortfolioItem, index: number) => {
            const isFlagship = app.isFlagship;
            const hasLiveUrl = app.url && app.url !== '#';
            const isDemoOpen = !!expandedDemos[app.name];
            
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
                className="group bg-neutral-50 hover:bg-white rounded-2xl border border-gray-150 hover:border-[#3333FF]/40 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col lg:flex-row items-stretch relative overflow-hidden scroll-mt-24"
              >
                {/* Visual Left Highlight Accent for Flagship on Desktop */}
                {isFlagship && (
                  <div className="absolute top-0 left-0 right-0 lg:right-auto lg:bottom-0 lg:w-1.5 h-1.5 lg:h-auto bg-[#3333FF] z-10" />
                )}

                {/* Left Side: App Contribution Details */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
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
                      {/* Interactive Demo Toggle */}
                      <button
                        onClick={() => toggleDemo(app.name)}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${
                          isDemoOpen
                            ? 'border-[#3333FF]/30 bg-[#E4F0E7] text-[#3333FF] hover:bg-white'
                            : 'border-gray-200 text-gray-700 hover:border-[#3333FF] hover:text-[#3333FF]'
                        }`}
                        title="Toggle sandbox simulator widget"
                      >
                        <Sliders className="w-3.5 h-3.5 animate-pulse" />
                        {isDemoOpen ? 'Close Simulator' : 'Interactive Demo'}
                      </button>

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

                {/* Right Side: Retractable Demo Panel (Coming Soon) */}
                <AnimatePresence initial={false}>
                  {isDemoOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: isLargeScreen ? 380 : '100%', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                      className="w-full shrink-0 border-t lg:border-t-0 lg:border-l border-gray-150 bg-neutral-100/50 overflow-hidden relative"
                    >
                      {/* Fixed-width internal wrapper prevents text layout shift during slide width animation */}
                      <div className="w-full lg:w-[380px] p-6 flex flex-col justify-between h-full space-y-6">
                        
                        {/* Demo Panel Header */}
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 font-mono">
                              Coming Soon
                            </span>
                            <h4 className="font-display font-bold text-gray-900 text-sm tracking-tight flex items-center gap-1.5">
                              <Terminal className="w-4 h-4 text-[#3333FF]" /> Demo Simulator
                            </h4>
                          </div>
                          <button
                            onClick={() => toggleDemo(app.name)}
                            className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors cursor-pointer"
                            title="Collapse panel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Interactive Simulation Sandbox Widget */}
                        <div className="flex-1 bg-white border border-gray-150 rounded-xl p-4 shadow-3xs overflow-y-auto">
                          {renderSimulatorContent(app.name)}
                        </div>

                        {/* Sandbox Notice Footer */}
                        <div className="text-[9px] font-mono text-gray-400 leading-normal flex items-center gap-1.5 border-t border-gray-200/60 pt-3">
                          <Code className="w-3.5 h-3.5 text-gray-300" />
                          <span>Simulation Sandbox Env (Isolated)</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Slim retractable Vertical Handle on desktop when closed */}
                {!isDemoOpen && (
                  <button
                    onClick={() => toggleDemo(app.name)}
                    className="hidden lg:flex items-center justify-center w-9 shrink-0 border-l border-gray-100 hover:bg-[#E4F0E7] transition-colors cursor-pointer group/handle"
                    title="Open Interactive Demo Panel"
                  >
                    <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-gray-400 group-hover/handle:text-[#3333FF] [writing-mode:vertical-lr] select-none">
                      Interactive Sandbox Demo
                    </span>
                  </button>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
