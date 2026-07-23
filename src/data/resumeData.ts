import { AppPortfolioItem, ExperienceItem, SkillCategory, PatentItem, CertificationItem, EducationItem, SpeakerEvent, EndorsementItem } from '../types';

export const personalInfo = {
  name: 'Minerva Tanglao Ott (Minnie)',
  title: 'Technology Transformation Leader',
  email: '',
  phone: '',
  linkedin: 'https://www.linkedin.com/in/minnieott/',
  github: '#', // placeholder as none listed
  location: 'San Francisco Bay Area, CA',
  tagline: 'Bridging Engineering Operations & Agentic AI Transformation',
  about: `My path into technology started with a simple act of curiosity: helping a high school friend set up her first Apple computer, which meant teaching myself BASIC along the way. That early spark earned me a full-ride scholarship in Computer Science and eventually carried me to the heart of Silicon Valley where I worked for big tech companies like [Google](company:1) who sponsored my completion of the [Stanford LEAD](https://grow.stanford.edu/browse/stanford-lead-online-business-program) executive education program.

I've led global enterprise deployments spanning Japan, Taiwan, Bahrain, Philippines, Europe and India. Working across such different cultures taught me as much about people as it did about technology, and shaped how I think about collaboration to this day. Alongside that career, I built a life with my husband and raised a [daughter](https://carissaott.com) who is now forging her own path in software engineering. Our Samoyed dog, [Mochi Pancake](https://youtu.be/NzH5PaEgjOs), inspired the creation of Mochi AI chatbot on this website. Feel free to ask Mochi questions about me by clicking on his icon on the lower right-hand corner.

Today, I focus on ##leading technology transformations that put people at the center of progress.## I help companies put AI to work at scale, while investing just as much in the growth of the teams behind that innovation.`,
  companiesLineage: ['Creative Blue', 'Google', 'Apple', 'Sun Microsystems', 'Oracle']
};

export const portfolioApps: AppPortfolioItem[] = [
  {
    name: 'Creative Blue GrowthOS',
    url: 'https://cb-growthos-hub-553545205591.us-west1.run.app',
    description: 'A cutting-edge agentic platform that automates critical business operations, generating marketing campaign ideas, orchestrating AI-driven SEO, and facilitating lead generation with a unified manager cockpit.',
    role: 'Head of Technology / Architect',
    bulletPoints: [
      'Engineered an integrated dashboard that centralizes multiple agentic workflows.',
      'Optimized payroll forecasting using dynamic dashboards pulling data from diverse cloud and internal sources.',
      'Pioneered human-in-the-loop agency models ensuring guardrails, safety, and transparency.'
    ],
    tags: ['Generative AI', 'Agentic Workflows', 'Business Automation', 'React', 'TypeScript'],
    isFlagship: true,
    status: 'Ready to use'
  },
  {
    name: 'Lead Generator',
    url: 'https://creative-blue-lead-gen-1029286255981.us-west1.run.app',
    description: 'An AI-powered sales-intelligence agent that automatically finds, analyzes, and scores target prospects based on a company\'s ideal client profile (ICP).',
    role: 'Head of Technology',
    bulletPoints: [
      'Implemented intelligent matching algorithms to scan and index prospective business data.',
      'Created custom recommendation engines mapping lead signals to hyper-personalized outreach strategies.',
      'Streamlined business development workflow, reducing manual prospecting by over 80%.'
    ],
    tags: ['AI Agents', 'Sales Intelligence', 'Lead Qualification', 'Google Cloud Platform'],
    isFlagship: false,
    status: 'Ready to use'
  },
  {
    name: 'Brand Assessment',
    url: 'https://creative-blue-brand-assessment-553545205591.us-west1.run.app',
    description: 'An analytical agentic engine (also referred to as Brand Assessment) that measures a brand\'s market share, sentiment score, and cross-channel visibility, providing direct recommendations for optimization.',
    role: 'Head of Technology / System Designer',
    bulletPoints: [
      'Designed NLP frameworks to analyze social, search, and marketing signals.',
      'Developed an automated branding scorecard detailing actionable, prioritized improvements.',
      'Provided clear visual representation of brand metrics for marketing executives.'
    ],
    tags: ['NLP', 'Brand Intelligence', 'Sentiment Analysis', 'Executive Dashboard'],
    isFlagship: false,
    status: 'Ready to use'
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
    status: 'Work In Progress'
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
    status: 'Ready to use'
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
    status: 'Work In Progress'
  }
];

export const experiences: ExperienceItem[] = [
  {
    role: 'Head of Technology',
    company: 'Creative Blue',
    period: 'Dec 2025 – Present',
    type: 'Contractor',
    description: 'Driving product technology strategy and agentic AI deployments, building advanced platforms ([GrowthOS](https://cb-growthos-hub-553545205591.us-west1.run.app/), [Lead Generator](https://creative-blue-lead-gen-1029286255981.us-west1.run.app/), [Brand Booster](https://creative-blue-brand-assessment-553545205591.us-west1.run.app/)) that automate enterprise workflows with human-in-the-loop oversight.',
    bullets: [
      'Organized unstructured workflows by building [GrowthOS](https://cb-growthos-hub-553545205591.us-west1.run.app/) as an integrated platform that generates marketing campaign ideas, AI search engine optimization (SEO), lead generation. Improved payroll forecasting using dashboards with data from various sources. Leading hands-on AI upskilling sprints focused on practical automation.',
      'Spearheading the design and deployment of agentic AI transformation frameworks and advising on ethical policy considerations for emerging AI solutions, including [Lead Generator](https://creative-blue-lead-gen-1029286255981.us-west1.run.app/) (AI finds leads based on ideal client profile) and [Brand Booster](https://creative-blue-brand-assessment-553545205591.us-west1.run.app/) (AI measures brand score and provides recommendations for improvement).',
      'Pioneered [Grex](https://grex.world) which uses AI for companies to post problems that can be solved by workers, which can potentially become investable opportunities. Defining partnerships for independent workers to obtain health insurance.',
      'Architecting the AI framework for Just Ride to unify cycling race data with automated pro intelligence and a single source of truth for the global peloton.'
    ],
    skillsUsed: ['Generative AI', 'Agentic Workflows', 'LLM Ops', 'Python', 'Cloud Dashboards', 'Team Upskilling'],
    logoColor: 'text-[#3333FF]'
  },
  {
    role: 'Senior Engineering Program Manager',
    company: 'Google',
    period: 'Jun 2011 – Nov 2025',
    type: 'Full-time',
    description: 'Led large-scale engineering operations and full lifecycle program management within Google Engineering, delivering crucial features for Google Maps and leading massive infrastructure and SDLC transformations.',
    bullets: [
      'Managed full product lifecycle from requirements to production for 50+ Google Maps features with Gemini Voice Navigation on Google Cloud Platform.',
      'Led cross-functional execution across engineering, product, QA, and release stakeholders to deliver scaled launches on time.',
      'Championed rapid prototyping and AI evaluation workshops for 30+ TPMs, building fluency in AI-driven program management. Provided consultation on leveraging Google AI tools for SDLC governance.',
      'Built TPM culture centered on technical rigor, mentoring, and execution, contributing to the promotion of senior TPM talent.',
      'Drove AI Service Desk transformation, migrating ticket routing workflows contributing to $150M in organization-wide efficiencies.',
      'Led transformation of Finance SDLC governance for SAP on Google Cloud Platform, providing consultation service for 40+ TPMs; improved time-to-market to 90+%, compliance to 82+%, and reduced defects by 21,000+.',
      'Established program review cadences for a portfolio of 20+ programs, driving cross-functional executive visibility into status, risks, dependencies, and prioritization decisions.',
      'Led infrastructure programs with 50+ TPMs at scale: SAP entity automation with 98% SLO, 67% testing cost reduction via server consolidation, and global IT standardization for vendor offices that reduced millions in operational cost.',
      'Pioneered portfolio management for Finance Engineering using a single source of truth that enabled dashboard reporting for managing projects/programs and identifying risks that need leadership attention.',
      'Led cross-functional teams in implementing lightweight SDLC which improves compliance, timeliness, quality and traceability of Finance system releases.',
      'Built dashboards to monitor monthly releases, building AI/ML solutions for efficiency.',
      'Led 12 cross-functional teams in completing configurations and dashboards for 100 new entities with 304 subledger requests. Improved closure rate to 96%, accelerated burn rate by 65%.',
      'Established Stanford LEAD @ Google to challenge employees to change lives, change organizations, change the world. Negotiated with Stanford GSB, leveraged Google Educational Reimbursement to provide employees up to 72% savings after reimbursement. Participants improved leadership skills which resulted in some promotions.',
      'Improved HR Engineering intake closure to 96%, burn rate 84% with simple intake/backlog management process for 200+ customers from 91 product areas. Automated intake ticket generation, built dashboards to improve service levels.',
      'Built Return to Office dashboard and led full cycle enhancement of Staffing Requests, internal and external job sites to show remote work locations.',
      'Led cross-functional teams in retrofitting 126 HR systems for the Oracle to SAP chart of accounts migration in May 2021.',
      'Led cross-functional teams in implementing integrations for Workday, SAP and homegrown payroll systems in Ireland, Poland, Singapore.',
      'Led cross-functional team from CorpEng, People Operations, Legal, and Information Security to ensure that HR systems are compliant to General Data Protection Regulation (EU GDPR).',
      'Managed software releases for Google\'s HR integration platform, Workday Payroll integrations and HR Ops API.',
      'Led a cross-functional team from Corporate Engineering, Extended Workforce Solutions, Finance, Legal, and Product Areas to implement a new vendor management system from inception through design. The mission was to drive value, reduce risk, and make it simpler to manage contingent workers.',
      'Delivered XWM Business Intelligence to provide a single source of truth for managing cost, risk, and operational efficiency in contingent workforce engagements.',
      'Brought together subject matter experts from REWS, xWS, NetOps, AV Eng, Vendor Solutions, Physical Security, and Finance to standardize Google Owned Vendor Offices (GOVO) and efficiently build them at a lower cost than Googler offices. Streamlined GOVO operations by creating a guide for GOVO Site Managers to manage Temp/Vendor/Contractor (TVC) migrations and have Equipment Maintenance Technicians as the "smart hands onsite". This saved thousands of dollars in travel cost for Vendor Solutions as it allowed escalations to be handled remotely.',
      'Spearheaded cross-functional collaboration among BizApps, REWS, xWS, PeopleOps, Vendor Solutions, Googler Experience, SecOps, Compliance, and FieldTechs to define the method for tracking information about facilities where TVCs work. This made it possible to verify if TVC facilities follow Google\'s Vendor Site Checklist with adherence to the User Data Access Policy.',
      'Conceptualized PSH+ to automatically determine TVC access by job function and upload application list into Lantern for provisioning, thus reducing manual work for managers.'
    ],
    skillsUsed: ['Google Cloud Platform', 'Google Maps', 'Gemini AI', 'SDLC Governance', 'SAP Integration', 'Program Portfolio Management'],
    logoColor: 'text-blue-500'
  },
  {
    role: 'Technical Project Manager',
    company: 'Apple',
    period: 'Jun 2009 – Jun 2011',
    type: 'Full-time',
    description: 'Managed critical development and cross-functional deployment of international recruitment and HR systems within Apple\'s IS&T division.',
    bullets: [
      'Led the software development and launch of Apple HR recruiting systems, including the Apple Job Search user interface.',
      'Successfully deployed application experiences localized and active in 80+ countries.',
      'Collaborated closely with cross-functional design, security, and infrastructure engineering teams.'
    ],
    skillsUsed: ['UI Development', 'Internationalization', 'HR IS&T', 'Project Management'],
    logoColor: 'text-gray-900'
  },
  {
    role: 'Technical Project Manager / Consultant',
    company: 'Sun Microsystems / Oracle',
    period: 'Apr 2000 – Jun 2009',
    type: 'Consultant',
    description: 'Directed software implementations and consultancies, providing deep engineering expertise for enterprise-scale platforms.',
    bullets: [
      'Led the end-to-end implementation of HP Project & Portfolio Management (PPM) software at Sun Microsystems to optimize outsourcing workflows.',
      'Served as senior consultant at Sun Java Center, architecting robust Java-based architectures for premier clients including eBay, American Express, and the Chicago Board Options Exchange.'
    ],
    skillsUsed: ['Java EE', 'HP PPM', 'Enterprise Architecture', 'Systems Consulting'],
    logoColor: 'text-orange-500'
  },
  {
    role: 'Software Engineering Consultant',
    company: 'IBM, DHL, Infogain',
    period: 'Prior Experience',
    type: 'Consultant',
    description: 'Built core transactional software and back-office systems for global enterprise leaders as an expert engineering contractor.',
    bullets: [
      'Infogain Consultant: Led the full-cycle development of specialized Data Transfer Systems and Loan Collection Systems.',
      'DHL: Co-developed the global Shipment Control System for real-time parcel and logistics tracking.',
      'IBM Consultant: Led critical technical enhancements of TECSYS Financials & Distribution Systems for international clients.'
    ],
    skillsUsed: ['Financial Systems', 'Logistics Software', 'Data Transfer', 'COBOL / Java'],
    logoColor: 'text-blue-700'
  }
];

export const skillCategories: SkillCategory[] = [
  {
    name: 'Technical & AI/ML',
    skills: [
      { name: 'Google AI/ML & LLM Ops', level: 95 },
      { name: 'Agentic Workflows & Multi-Agent systems', level: 98 },
      { name: 'Google Cloud Platform (GCP)', level: 92 },
      { name: 'Python & LLM Integration', level: 90 },
      { name: 'SQL & Database Architecture', level: 85 },
      { name: 'API Integration & Middleware', level: 94 },
      { name: 'Software Development Lifecycle (SDLC)', level: 96 }
    ]
  },
  {
    name: 'Leadership & Governance',
    skills: [
      { name: 'Transformational Programs & Operations', level: 97 },
      { name: 'Strategic Planning & Execution', level: 94 },
      { name: 'Product Lifecycle Governance', level: 95 },
      { name: 'Risk Management & Mitigation', level: 90 },
      { name: 'Change Management & Upskilling', level: 93 },
      { name: 'TPM Culture & Mentorship', level: 96 }
    ]
  },
  {
    name: 'Domain Expertise',
    skills: [
      { name: 'Google Maps Platform & Telemetry', level: 95 },
      { name: 'Corporate Engineering & HR IS&T', level: 90 },
      { name: 'Finance SDLC & SAP Integrations', level: 88 },
      { name: 'Enterprise SaaS & Cloud Dashboards', level: 92 }
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
    issuer: 'Google Cloud',
    links: [
      { label: 'Professional', url: 'https://www.coursera.org/account/accomplishments/specialization/ESJ09OCIXG9Y' },
      { label: 'Essentials', url: 'https://www.credly.com/badges/d101f754-d0e8-4da3-b787-c464320df9a6/public_url' }
    ],
    badgeType: 'ai'
  },
  {
    title: 'PRINCE2 Foundation Project Management',
    issuer: 'Office of Government Commerce',
    link: 'https://drive.google.com/file/d/0B_9ZUKe9gx67eThhbDRFZGptYTJ2c2c0T1k4N01RRTctcXdN/view?resourcekey=0-XbfvNl996HCzEJeou3W8AA',
    badgeType: 'pm'
  }
];

export const education: EducationItem[] = [
  {
    school: 'Stanford Graduate School of Business',
    degree: 'Stanford LEAD',
    honors: ['Distinguished Scholar', 'Community Advisory Board Member'],
    details: 'Rigorous executive leadership certification focusing on design thinking, strategic development, and driving innovation within corporate organizations.'
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
      { label: 'Ohlone STEM Summit Facebook Post', url: 'https://www.facebook.com/ohlonecollege/posts/pfbid037txouR56THqakGJ4CUAi9P5VovxwnweMRpK5mppqetWfGuFG65Scsb8ZhqJBq51Ml' },
      { label: 'Ohlone STEM Summit Instagram Post', url: 'https://www.instagram.com/p/DQXvB2OjJ8k/?img_index=2&igsh=NTc4MTIwNjQ2YQ==' }
    ]
  }
];

export const endorsements: EndorsementItem[] = [
  {
    id: 'google-rec',
    author: 'Director of Product Management',
    role: 'Product Lead',
    company: 'Google',
    quote: 'Minnie is a powerhouse of execution and strategic vision. At Google, she spearheaded complex features for Google Maps with Gemini Voice Navigation. Her unique ability to bridge highly technical systems with cross-functional team alignment saved months of engineering cycles. She brings an empathetic, people-first leadership style to the most demanding technology environments.',
    relation: 'Collaborated on Google Maps Gemini integrations'
  },
  {
    id: 'cb-rec',
    author: 'Managing Director & Co-Founder',
    role: 'Managing Director',
    company: 'Creative Blue',
    quote: "Minnie's introduction of the agentic AI transformation framework was a turning point for our company. As Head of Technology, she didn't just architect high-performance platforms like GrowthOS, but also ran hands-on upskilling sprints that empowered our entire development team. She has a rare, brilliant capability to turn speculative AI concepts into real, highly-optimized enterprise operations.",
    relation: 'Worked directly as head agency partners'
  },
  {
    id: 'apple-rec',
    author: 'Senior Manager, IS&T Division',
    role: 'IS&T Program Director',
    company: 'Apple',
    quote: 'During her time as a TPM at Apple, Minnie successfully managed the software development and international rollouts of our major global HR and recruitment platforms. Her attention to detail, strong grasp of system architecture, and ability to coordinate across cross-functional engineering teams in 80+ countries were absolutely stellar.',
    relation: 'Supervised Minnie on corporate portal rollouts'
  },
  {
    id: 'sun-rec',
    author: 'Senior Partner & Director',
    role: 'Java Center Principal Architect',
    company: 'Sun Microsystems / Oracle',
    quote: 'Minnie was an exceptional consultant and technical architect. Her work building enterprise-scale architectures for premier clients like the Chicago Board Options Exchange and eBay proved her deep understanding of robust Java EE systems and organizational scalability. She is a consummate professional who excels under complex constraints.',
    relation: 'Managed Minnie on strategic consulting engagements'
  }
];

