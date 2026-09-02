import { AppPortfolioItem, ExperienceItem, SkillCategory, PatentItem, CertificationItem, EducationItem, SpeakerEvent, EndorsementItem } from '../types';

export const personalInfo = {
  name: 'Minerva Tanglao Ott (Minnie)',
  title: 'Principal Technical Program Manager',
  email: 'minnie.ott@gmail.com',
  phone: '+1 (408) 829-3100',
  linkedin: 'https://www.linkedin.com/in/minnieott/',
  instagram: 'https://www.instagram.com/minnie.halohalo/',
  facebook: 'https://www.facebook.com/minerva.t.ott',
  x: 'https://x.com/ottminnie',
  youtube: 'https://www.youtube.com/@MinnieOtt',
  tiktok: 'https://www.tiktok.com/@minnie.halohalo',
  github: '#', // placeholder as none listed
  location: 'San Francisco Bay Area, CA',
  tagline: 'Creative Blue | Google | Apple',
  summary: `Principal Technical Program Manager with 15+ years leading cross-functional engineering teams from inception to production, including 14 years at Google Engineering (Maps, Finance, HR, IT) and 2 years at Apple HR Engineering. Delivered enterprise-scale programs for Google Maps (2 billion+ users), Ads, Legal, Finance, and HR engineering in partnership with UX and Security/Privacy teams. Directed development of Apple's global recruiting systems, including the Recruitment Information Board and Apple Job Search, launched across 80+ countries. Built Finance engineering governance that lifted on-time delivery KPI to 90+% through a quarterly leaderboard incentive program. Founded Stanford LEAD at Google and led integration of home-grown systems with external platforms. Currently architecting GrowthOS, an agentic AI platform on Google Cloud Platform that cut client onboarding time from days to minutes. Core strengths: program management, Agile/SDLC governance, stakeholder management, risk & change management, and AI/ML-driven process transformation.`,
  about: `My path into technology started with a simple act of curiosity: helping a high school friend set up her first Apple computer, which meant teaching myself BASIC along the way. That early spark earned me a full-ride scholarship in Computer Science and eventually carried me to the heart of Silicon Valley where I worked for big tech companies like [Google](company:1) who sponsored my completion of the [Stanford LEAD](https://grow.stanford.edu/browse/stanford-lead-online-business-program) executive education program.

I've led global enterprise deployments spanning Japan, Taiwan, Bahrain, Philippines, Europe and India. Working across such different cultures taught me as much about people as it did about technology, and shaped how I think about collaboration to this day. Alongside that career, I built a life with my husband and raised a [daughter](https://carissaott.com) who is now forging her own path in software engineering. Our Samoyed dog, [Mochi Pancake](https://youtu.be/NzH5PaEgjOs), inspired the creation of Mochi AI chatbot on this website. Feel free to ask Mochi questions about me by clicking on his icon on the lower right-hand corner. In my youth I played Pac-Man in the arcade; try out [Mochi Pac-Man](/pacman) to play this classic video game with Mochi.

Today, I focus on ##leading technology transformations that put people at the center of progress.## I help companies put AI to work at scale, while investing just as much in the growth of the teams behind that innovation.`,
  companiesLineage: ['Creative Blue', 'Google', 'Apple', 'IBM, DHL, Infogain, Sun/Oracle']
};

export const portfolioApps: AppPortfolioItem[] = [
  {
    name: 'Creative Blue GrowthOS',
    url: 'https://cb-growthos-hub-553545205591.us-west1.run.app',
    description: 'A cutting-edge agentic platform that automates critical business operations, generating marketing campaign ideas, orchestrating AI-driven SEO, and facilitating lead generation with a unified manager cockpit.',
    role: 'Head of Technology Transformation / Architect',
    bulletPoints: [
      'Engineered an integrated dashboard that centralizes multiple agentic workflows.',
      'Optimized payroll forecasting using dynamic dashboards pulling data from diverse cloud and internal sources.',
      'Pioneered human-in-the-loop agency models ensuring guardrails, safety, and transparency.'
    ],
    tags: ['Generative AI', 'Agentic Workflows', 'Business Automation', 'React', 'TypeScript'],
    isFlagship: true,
    status: 'Work in progress',
    cta: {
      label: 'Request Demo',
      url: 'https://www.creativeblue.agency/contact'
    }
  },
  {
    name: 'Lead Generator',
    url: 'https://creative-blue-lead-gen-1029286255981.us-west1.run.app',
    description: 'An AI-powered sales-intelligence agent that automatically finds, analyzes, and scores target prospects based on a company\'s ideal client profile (ICP).',
    role: 'Head of Technology Transformation',
    bulletPoints: [
      'Implemented intelligent matching algorithms to scan and index prospective business data.',
      'Created custom recommendation engines mapping lead signals to hyper-personalized outreach strategies.',
      'Streamlined business development workflow, reducing manual prospecting by over 80%.'
    ],
    tags: ['AI Agents', 'Sales Intelligence', 'Lead Qualification', 'Google Cloud Platform'],
    isFlagship: false,
    status: 'Ready to use',
    cta: {
      label: 'Request Demo',
      url: 'https://www.creativeblue.agency/contact'
    }
  },
  {
    name: 'Brand Assessment',
    url: 'https://creative-blue-brand-assessment-553545205591.us-west1.run.app',
    description: 'An analytical agentic engine (also referred to as Brand Assessment) that measures a brand\'s market share, sentiment score, and cross-channel visibility, providing direct recommendations for optimization.',
    role: 'Head of Technology Transformation / System Designer',
    bulletPoints: [
      'Designed NLP frameworks to analyze social, search, and marketing signals.',
      'Developed an automated branding scorecard detailing actionable, prioritized improvements.',
      'Provided clear visual representation of brand metrics for marketing executives.'
    ],
    tags: ['NLP', 'Brand Intelligence', 'Sentiment Analysis', 'Executive Dashboard'],
    isFlagship: false,
    status: 'Ready to use',
    cta: {
      label: 'Request Demo',
      url: 'https://www.creativeblue.agency/contact'
    }
  },
  {
    name: 'Grex World',
    url: 'https://grex.world/',
    description: 'An innovative AI marketplace allowing companies to post complex, unsolved problems that are matched with skilled workers, converting solutions into potentially investable business opportunities.',
    role: 'Platform Pioneer / Advisor',
    bulletPoints: [
      'Integrated intelligent matching models to connect project requirements with expert profiles.',
      'Architected strategic partnership frameworks enabling independent workers on the platform to obtain health insurance.',
      'Created a framework that nurtures individual worker contributions into seed-investable ventures.'
    ],
    tags: ['Gig Economy', 'AI Market Matching', 'Health Partnerships', 'Investments'],
    isFlagship: false,
    status: 'Work In Progress',
    cta: {
      label: 'Check it out',
      url: 'https://grex.world'
    }
  },
  {
    name: 'Regnum Dei',
    url: 'https://regnumdei.co/',
    description: 'A beautifully structured and highly polished digital space representing the mission, values, and community connection of Regnum Dei.',
    role: 'Lead Technical Director',
    bulletPoints: [
      'Designed and deployed an elegant, high-performance web platform utilizing modern UI paradigms.',
      'Ensured flawless responsive layout and fast loading speed to enhance digital engagement.',
      'Maintained extreme visual focus, alignment, and high-quality typographic standard.'
    ],
    tags: ['Web Design', 'Digital Platform', 'Community Engagement', 'Responsive Design'],
    isFlagship: false,
    status: 'Ready to use',
    cta: {
      label: 'Launch App',
      url: 'https://regnumdei.co/'
    }
  },
  {
    name: 'Just Ride',
    url: 'https://just-ride.ai.studio',
    description: 'An advanced athletic-intelligence framework designed to aggregate, unify, and analyze cycling race data across the global peloton with a single source of truth.',
    role: 'AI Architect',
    bulletPoints: [
      'Architected telemetry parser systems unifying disparate cycling race metrics.',
      'Deployed automated pro-level intelligence engines generating race performance insights.',
      'Built data pipelines supporting race analysis, weather impacts, and team strategy simulations.'
    ],
    tags: ['Sports Analytics', 'Telemetry Processing', 'Data Pipeline', 'Race Intelligence'],
    isFlagship: false,
    status: 'Work In Progress',
    cta: {
      label: 'Check it out',
      url: 'https://just-ride.ai.studio/'
    }
  }
];

export const experiences: ExperienceItem[] = [
  {
    role: 'Head of Technology Transformation',
    company: 'Creative Blue',
    period: 'Dec 2025 – Present',
    type: 'Leadership',
    description: 'Architecting agentic AI transformation frameworks, leading enterprise platform development ([GrowthOS](/work#portfolio-creative-blue-growthos), [Lead Generator](/work#portfolio-lead-generator), [Brand Score](/work#portfolio-brand-assessment)), and driving practical automation adoption.',
    bullets: [
      'Architected [GrowthOS](/work#portfolio-creative-blue-growthos), an agentic AI platform integrating Harvest, Box, Slack, Apollo, Pomelli (marketing campaign generation), and Search Atlas (AI search engine optimization) with automated AI lead generation and agent scheduling. Reduced client onboarding time from days to minutes, improved payroll forecasting through data-driven dashboards sourced from multiple systems, and led hands-on AI upskilling sprints to drive practical automation adoption.',
      'Design and deploy agentic AI transformation frameworks, advising on ethical AI policy for emerging solutions such as [Lead Generator](/work#portfolio-lead-generator) (AI-driven lead sourcing based on ideal client profile) and [Brand Score](/work#portfolio-brand-assessment) (automated brand scoring with improvement recommendations).',
      'Architect [Grex](/work#portfolio-grex-world), an AI-powered marketplace connecting companies\' problem statements with worker-sourced solutions that can become investable opportunities, and negotiate partnerships to extend health insurance access to independent workers.',
      'Architect the AI framework for [Just Ride](/work#portfolio-just-ride), unifying cycling race data into a single source of truth with automated pro-level race intelligence for the global peloton.'
    ],
    skillsUsed: ['Google AI Studio', 'Claude Code/Cowork', 'Google Cloud Platform', 'Firebase', 'Agentic Workflows', 'LLM Ops'],
    logoColor: 'text-[#3333FF]'
  },
  {
    role: 'Senior Engineering Program Manager',
    company: 'Google',
    period: 'Jun 2011 – Nov 2025',
    type: 'Full-time',
    description: 'Led 14 years of enterprise-scale engineering operations across Google Maps (2B+ users), Ads, Legal, Finance, HR, and IT Engineering, driving full SDLC execution, Gemini AI navigation, and large-scale infrastructure transformations.',
    bullets: [
      'Managed full SDLC and quarterly business reviews (QBR) while optimizing the roadmap for 50+ Google Maps features, including Gemini Voice Navigation, on cloud infrastructure serving 2 billion+ users. Directed critical path management and bottleneck resolution based on dependency risk, ensuring high-quality, on-time delivery. Landed AI/ML capabilities in production with Security/Privacy approval and incremental deployments/rollback based on Geo Quality metrics.',
      'Directed cross-functional execution across engineering, product, QA, and release teams to deliver scaled launches on schedule.',
      'Championed rapid prototyping and AI evaluation workshops for 30+ TPMs, building organization-wide fluency in AI-driven program management, and advised teams on applying Google AI tools to SDLC governance.',
      'Cultivated a TPM culture centered on technical rigor, mentoring, and execution, contributing to multiple senior TPM promotions.',
      'Drove AI-powered Service Desk transformation, migrating ticket-routing workflows and contributing to $150M in organization-wide efficiency gains.',
      'Transformed Finance SDLC governance for SAP on Google Cloud Platform, consulting for 40+ TPMs; improved timely delivery to 90+%, raised compliance to 82+%, and reduced defects by 21,000+.',
      'Established program review cadences across a 20+ program portfolio, driving executive visibility into status, risk, dependencies, and prioritization decisions.',
      'Directed infrastructure programs at scale with 50+ TPMs: automated SAP entity provisioning to 98% SLO, cut testing costs 67% via server consolidation, and standardized global IT for vendor offices, reducing operational costs by millions.',
      'Pioneered a single-source-of-truth portfolio management system for Finance Engineering, enabling dashboard reporting for project/program tracking and risk escalation to leadership.',
      'Led cross-functional teams to implement a lightweight SDLC, improving compliance, timeliness, quality, and traceability of Finance system releases.',
      'Built dashboards to monitor monthly releases and developed AI/ML solutions to improve operational efficiency.',
      'Led 12 cross-functional teams to complete configurations and dashboards for 100 new entities and 304 subledger requests, improving closure rate to 96% and accelerating burn rate by 65%.',
      'Founded Stanford LEAD @ Google, a leadership development program empowering employees to change lives, organizations, and the world; participants strengthened leadership skills, with several earning promotions.',
      'Improved HR Engineering intake closure rate to 96% and burn rate to 84% by designing a streamlined intake/backlog management process for 200+ customers across 91 product areas; automated ticket generation and built dashboards to elevate service levels.',
      'Built the Return to Office dashboard and led end-to-end enhancement of Staffing Requests and internal/external job sites to surface remote work locations.',
      'Led cross-functional teams to retrofit 126 HR systems for the Oracle-to-SAP chart of accounts migration.',
      'Led cross-functional teams to implement integrations across Workday, SAP, and homegrown payroll systems in Ireland, Poland, and Singapore.',
      'Led a cross-functional team spanning CorpEng, People Operations, Legal, and Information Security to ensure HR systems complied with General Data Protection Regulation (GDPR) requirements.',
      'Managed software releases for Google\'s HR integration platform, including Workday Payroll integrations and the HR Ops API.',
      'Led a cross-functional team across Corporate Engineering, Extended Workforce Solutions, Finance, Legal, and Product Areas to design and implement a new vendor management system from inception, driving value, reducing risk, and simplifying contingent workforce management.',
      'Delivered XWM Business Intelligence to provide a single source of truth for managing cost, risk, and operational efficiency in contingent workforce engagements.',
      'Convened subject matter experts across REWS, xWS, NetOps, AV Eng, Vendor Solutions, Physical Security, and Finance to standardize Google Owned Vendor Offices (GOVO), building them at lower cost than Googler offices; streamlined GOVO operations and saved thousands of dollars in travel costs via remote escalations.',
      'Spearheaded cross-functional collaboration among BizApps, REWS, xWS, PeopleOps, Vendor Solutions, Googler Experience, SecOps, Compliance, and FieldTechs to establish a tracking method for TVC work facilities, enabling verification of compliance with Google\'s Vendor Site Checklist and User Data Access Policy.',
      'Conceptualized PSH+, an automated system that determines TVC access by job function and uploads provisioning application lists, reducing manual work for managers.'
    ],
    skillsUsed: ['Google Cloud Platform', 'Google Maps (2B+ users)', 'Gemini AI', 'SDLC Governance', 'SAP on GCP', 'Portfolio Management', 'RLHF', 'Jira / Confluence'],
    logoColor: 'text-blue-500'
  },
  {
    role: 'Technical Project Manager',
    company: 'Apple',
    period: 'Jun 2009 – Jun 2011',
    type: 'Full-time',
    description: 'Directed development of Apple\'s global recruiting systems, including the Recruitment Information Board and Apple Job Search, launched across 80+ countries.',
    bullets: [
      'Led development and launch of Apple HR recruiting systems, including the Apple Job Search user interface.',
      'Deployed localized application experiences active in 80+ countries.',
      'Partnered closely with cross-functional design, security, and infrastructure engineering teams.'
    ],
    skillsUsed: ['UI Development', 'Internationalization (80+ countries)', 'Apple HR IS&T', 'Agile/SDLC', 'Infrastructure Security'],
    logoColor: 'text-gray-900'
  },
  {
    role: 'Software Engineer',
    company: 'IBM, DHL, Infogain, Sun/Oracle',
    period: 'Prior Experience',
    type: 'Engineering',
    description: 'Co-developed patented enterprise employee training systems, built core shipment control architectures, and provided expert engineering consultancy across enterprise leaders.',
    bullets: [
      'Sun: Co-developed a web-based training registration system (US Patent 20020064766) and temp/contractor database; led implementation of HP Project & Portfolio Management software for outsourcing workflows.',
      'Sun Java Center consultant: eBay, American Express, Chicago Board Options Exchange.',
      'Infogain: Led full-cycle development of a Data Transfer System and Loan Collection System.',
      'DHL: co-developed the Shipment Control System.',
      'IBM: Led enhancement of the TECSYS Financials & Distribution System for clients.'
    ],
    skillsUsed: ['Java EE', 'HP PPM', 'US Patent 20020064766', 'Financial Systems', 'Logistics Systems', 'SQL', 'Data Transfer'],
    logoColor: 'text-blue-700'
  }
];

export const skillCategories: SkillCategory[] = [
  {
    name: 'Technical Skills',
    skills: [
      { name: 'Google AI/ML & LLM Ops', level: 96 },
      { name: 'Claude AI & Claude Code', level: 95 },
      { name: 'Agentic Workflows & Multi-Agent Systems', level: 98 },
      { name: 'A2A Protocol & Model Context Protocol (MCP)', level: 96 },
      { name: 'Cloud Computing (GCP)', level: 94 },
      { name: 'Reinforcement Learning (RLHF)', level: 90 },
      { name: 'SQL & SDLC Governance', level: 95 }
    ]
  },
  {
    name: 'Leadership & Program Management',
    skills: [
      { name: 'Transformational Programs & Execution', level: 98 },
      { name: 'Process Improvement & Operations', level: 96 },
      { name: 'Strategic & Tactical Planning', level: 95 },
      { name: 'Product Lifecycle Governance', level: 96 },
      { name: 'Risk & Change Management', level: 94 },
      { name: 'Technical/Business Communication', level: 97 },
      { name: 'Conflict Resolution & Consensus Building', level: 95 }
    ]
  },
  {
    name: 'Domain Expertise',
    skills: [
      { name: 'Technical Program Management (TPM)', level: 98 },
      { name: 'Cloud Computing IaaS & Scale', level: 93 },
      { name: 'Full-Stack Architecture & Modern UI', level: 92 },
      { name: 'Enterprise Consulting & Governance', level: 95 }
    ]
  },
  {
    name: 'Tools & Platforms',
    skills: [
      { name: 'Google AI Studio', level: 97 },
      { name: 'Claude Code / Cowork', level: 95 },
      { name: 'Google Cloud Platform (GCP)', level: 94 },
      { name: 'Firebase & Firestore', level: 92 },
      { name: 'Jira & Confluence', level: 98 }
    ]
  }
];

export const patents: PatentItem[] = [
  {
    title: 'Method and Apparatus for Managing Enterprise Employee Training Systems',
    id: 'US Patent 20020064766',
    link: 'https://patents.google.com/patent/US20020064766A1/en',
    description: 'An innovative mechanism for auditing, managing, and automated provisioning of organizational training assets for enterprise-scale employee cohorts.'
  }
];

export const books = {
  title: 'JMX Programming',
  role: 'Technical Editor',
  author: 'Mike Jasnowski',
  link: 'https://www.google.com/books/edition/JMX_Programming/baVQAAAAMAAJ',
  description: 'Provided senior technical review and structural validation of core Java Management Extensions (JMX) patterns and implementation guidelines.'
};

export const certifications: CertificationItem[] = [
  {
    title: 'AI Agent Development & LLM Fluency (Model Context Protocol)',
    issuer: 'Vanderbilt University',
    link: 'https://www.coursera.org/account/accomplishments/verify/R3G9DX3448H3',
    badgeType: 'ai'
  },
  {
    title: 'Google AI (Professional & Essentials)',
    issuer: 'Google AI',
    links: [
      { label: 'Professional', url: 'https://www.coursera.org/account/accomplishments/specialization/ESJ09OCIXG9Y' },
      { label: 'Essentials', url: 'https://www.credly.com/badges/d101f754-d0e8-4da3-b787-c464320df9a6/public_url' }
    ],
    badgeType: 'ai'
  },
  {
    title: 'PRINCE2 Foundation (Project Management)',
    issuer: 'Office of Government Commerce',
    link: 'https://drive.google.com/file/d/0B_9ZUKe9gx67eThhbDRFZGptYTJ2c2c0T1k4N01RRTctcXdN/view?resourcekey=0-XbfvNl996HCzEJeou3W8AA',
    badgeType: 'pm'
  }
];

export const education: EducationItem[] = [
  {
    school: 'Stanford Graduate School of Business',
    degree: 'Stanford LEAD',
    honors: ['Distinguished Scholar', 'Community Advisory Board', 'Stanford LEAD Certificate'],
    details: 'Rigorous executive leadership program focusing on design thinking, strategic development, and driving innovation within corporate organizations.'
  },
  {
    school: 'Ateneo de Manila University',
    degree: 'BS Computer Science',
    honors: ['Dean’s List', 'Lourdes Evangelista Scholarship Award'],
    details: 'Rigorous foundation in computer systems, object-oriented architecture, data structures, and algorithms.'
  }
];

export const speakerEvents: SpeakerEvent[] = [
  {
    event: 'SF Bay Area Filipino American Professionals Networking Day',
    description: 'Shared executive career lineage and engineering program insights from roles at Google, Apple, and Sun Microsystems. Focused on bridging cultural leadership patterns with technical transformations in Silicon Valley.',
    links: [
      { label: 'Inquirer.net', url: 'https://globalnation.inquirer.net/138791/fil-am-professionals-in-sf-bay-area-to-gather-for-networking-day' },
      { label: 'Positively Filipino', url: 'https://www.positivelyfilipino.com/community-news/speaker-series-and-fil-am-networking-working-day' }
    ]
  },
  {
    event: 'Ohlone College STEM Summit',
    description: 'Presented keynote guidance and technical mentorship for student pathways in computing and engineering. Spoke about bridging academia and industry, fostering diverse pipelines, and leading with technological curiosity.',
    links: [
      { label: 'Facebook post', url: 'https://www.facebook.com/ohlonecollege/posts/pfbid037txouR56THqakGJ4CUAi9P5VovxwnweMRpK5mppqetWfGuFG65Scsb8ZhqJBq51Ml' },
      { label: 'Instagram post', url: 'https://www.instagram.com/p/DQXvB2OjJ8k/?img_index=2&igsh=NTc4MTIwNjQ2YQ==' }
    ]
  }
];

export const endorsements: EndorsementItem[] = [];


