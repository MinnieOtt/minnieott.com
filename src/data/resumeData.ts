import { AppPortfolioItem, ExperienceItem, SkillCategory, PatentItem, CertificationItem, EducationItem, SpeakerEvent, EndorsementItem } from '../types';

export const personalInfo = {
  name: 'Minerva Tanglao Ott (Minnie)',
  title: 'Technical Program Manager | Launch & Cross-Functional Programs | AI & Agentic Products',
  linkedin: 'https://www.linkedin.com/in/minnieott/',
  instagram: 'https://www.instagram.com/minnie.halohalo/',
  facebook: 'https://www.facebook.com/minerva.t.ott',
  x: 'https://x.com/ottminnie',
  youtube: 'https://www.youtube.com/@MinnieOtt',
  tiktok: 'https://www.tiktok.com/@minnie.halohalo',
  github: '#', // placeholder as none listed
  location: 'San Francisco Bay Area, CA',
  tagline: 'Creative Blue | Google | Apple | Sun/Oracle',
  summary: `Technical Program Management leader with 15+ years driving large-scale, cross-functional launch and AI programs across engineering, product, marketing, legal, privacy, and executive stakeholders. Currently architecting and delivering Creative Blue’s GrowthOS, an agentic AI platform on GCP integrating Vertex AI and Model Context Protocol (MCP), including the governance framework for how new agentic features are evaluated, approved, and launched. Spent 14 years at Google Engineering managing a 20+ program portfolio spanning AI/ML (including Gemini-adjacent Google Maps features), cloud infrastructure, and enterprise systems – building the processes, dashboards, and status reporting that keep high volumes of complex, cross-functional launches on track. Comfortable operating in ambiguity, prioritizing competing requests, and influencing senior engineering, product, and cross-functional leaders. Known for bringing structure to ambiguity and using AI tools and automation to make program execution more efficient and scalable.`,
  about: `My path into technology started with a simple act of curiosity: helping a high school friend set up her first Apple computer, which meant teaching myself BASIC along the way. That early spark earned me a full-ride scholarship in Computer Science and eventually carried me to the heart of Silicon Valley where I worked for big tech companies like [Google](company:1) who sponsored my completion of the [Stanford LEAD](https://grow.stanford.edu/browse/stanford-lead-online-business-program) executive education program.

I've led global enterprise deployments spanning Japan, Taiwan, Bahrain, Philippines, Europe and India. Working across such different cultures taught me as much about people as it did about technology, and shaped how I think about collaboration to this day. Alongside that career, I built a life with my husband and raised a [daughter](https://carissaott.com) who is now forging her own path in software engineering. Our Samoyed dog, [Mochi Pancake](https://www.youtube.com/shorts/2T1lhjRaovY), inspired the creation of Mochi AI chatbot on this website. Feel free to ask Mochi questions about me by clicking on his icon on the lower right-hand corner. In my youth I played Pac-Man in the arcade; try out [Mochi Pac-Man](/pacman) to play this classic video game with Mochi.

Today, I focus on ##leading technology transformations that put people at the center of progress.## I help companies put AI to work at scale, while investing just as much in the growth of the teams behind that innovation.`,
  companiesLineage: ['Creative Blue', 'Google', 'Apple', 'Sun/Oracle', 'IBM, DHL, Infogain']
};

export const portfolioApps: AppPortfolioItem[] = [
  {
    name: 'Creative Blue GrowthOS',
    url: 'https://cb-growthos-hub-553545205591.us-west1.run.app',
    description: 'An agentic AI platform on GCP integrating Vertex AI and Model Context Protocol (MCP), including the governance framework for how new agentic features are evaluated, approved, and launched, with multi-cloud scaling to Amazon Web Services.',
    role: 'Head of Technology Transformation / Architect',
    bulletPoints: [
      'Serve as the primary interface between the CEO, COO, and engineering in architecting and delivering GrowthOS from 0→1, an enterprise agentic AI platform on GCP leveraging Vertex AI, MCP, and custom agentic workflows to unify Apollo, Google Maps, Harvest, Box, and Slack, translating executive priorities into an executable engineering roadmap.',
      'Compressed prospecting and onboarding runtimes from days to minutes, and drove expansion by scaling GrowthOS to Amazon Web Services for resilient multi-cloud deployment.',
      'Established an AI governance framework – review, evaluation, and approval standards for how new agentic features are evaluated, approved, and launched.'
    ],
    tags: ['Generative AI', 'Agentic Workflows', 'GCP', 'Vertex AI', 'MCP', 'AWS Multi-Cloud', 'AI Governance'],
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
    description: 'An emerging AI-driven prospecting solution based on ideal client profiles (ICP), vetted through established AI governance framework standards.',
    role: 'Head of Technology Transformation',
    bulletPoints: [
      'Established and applied AI governance framework standards for vetting agentic solutions before deployment.',
      'AI-driven prospecting based on ideal client profiles (ICP).',
      'Automated qualification scanning and outbound pipeline readiness.'
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
    description: 'An analytical agentic engine delivering AI-driven brand scoring with actionable improvement recommendations.',
    role: 'Head of Technology Transformation / System Designer',
    bulletPoints: [
      'Applied AI governance evaluation and approval standards for emerging brand intelligence agents.',
      'Automated brand scoring analyzing cross-channel presence, sentiment, and competitive visibility.',
      'Generates direct, actionable recommendations for marketing leadership.'
    ],
    tags: ['Brand Intelligence', 'Sentiment Analysis', 'Executive Dashboard', 'NLP'],
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
    description: 'An AI-powered marketplace connecting companies\' problem statements with worker-sourced solutions that can become investable opportunities.',
    role: 'Platform Pioneer / Advisor',
    bulletPoints: [
      'Pioneered Grex, an AI-powered marketplace connecting companies\' problem statements with worker-sourced solutions that can become investable opportunities.',
      'Planning partnerships to offer benefits for members.',
      'Creating frameworks that nurture worker contributions into scalable, investable ventures.'
    ],
    tags: ['Gig Economy', 'AI Marketplace', 'Workplace Innovation', 'Investable Solutions'],
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
    description: 'An AI framework unifying cycling race data into a single source of truth with automated pro-level race intelligence for the global peloton.',
    role: 'AI Architect',
    bulletPoints: [
      'Developed the AI framework for Just Ride, unifying cycling race data into a single source of truth.',
      'Automated pro-level race intelligence for the global peloton.',
      'Architected telemetry parsing systems unifying disparate race metrics.'
    ],
    tags: ['Sports Analytics', 'Race Intelligence', 'Telemetry Processing', 'Data Pipeline'],
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
    description: 'Serve as the primary interface between the CEO, COO, and engineering in architecting and delivering GrowthOS from 0→1, an enterprise agentic AI platform on GCP leveraging Vertex AI, MCP, and custom agentic workflows to unify Apollo, Google Maps, Harvest, Box, and Slack, translating executive priorities into an executable engineering roadmap. Compressed prospecting and onboarding runtimes from days to minutes, and drove expansion by scaling GrowthOS to Amazon Web Services for resilient multi-cloud deployment.',
    bullets: [
      'Serve as the primary interface between the CEO, COO, and engineering in architecting and delivering GrowthOS from 0→1, an enterprise agentic AI platform on GCP leveraging Vertex AI, MCP, and custom agentic workflows to unify Apollo, Google Maps, Harvest, Box, and Slack, translating executive priorities into an executable engineering roadmap. Compressed prospecting and onboarding runtimes from days to minutes, and drove expansion by scaling GrowthOS to Amazon Web Services for resilient multi-cloud deployment.',
      'Established an AI governance framework – review, evaluation, and approval standards for how new agentic solutions are vetted before deployment – and applied it to ship [Lead Generator](/work#portfolio-lead-generator) (AI-driven prospecting) and [Brand Assessment](/work#portfolio-brand-assessment) (AI-driven brand scoring with improvement recommendations).',
      'Pioneered [Grex](/work#portfolio-grex-world), an AI-powered marketplace connecting companies\' problem statements with worker-sourced solutions that can become investable opportunities. Planning partnerships to offer benefits for members.',
      'Developed the AI framework for [Just Ride](/work#portfolio-just-ride), unifying cycling race data into a single source of truth with automated pro-level race intelligence for the global peloton.'
    ],
    skillsUsed: ['Vertex AI', 'Model Context Protocol (MCP)', 'Agent-to-Agent (A2A) Protocol', 'Prompt Engineering', 'Google Cloud Platform (Cloud Run, IAM, VPC, CI/CD, Secrets Management, Firebase)', 'Amazon Web Services (AWS)', 'Agentic Frameworks', 'LLM Ops', 'Python', 'Java', 'SQL', 'APIs'],
    logoColor: 'text-[#3333FF]'
  },
  {
    role: 'Senior Engineering Program Manager',
    company: 'Google',
    period: 'Jun 2011 – Nov 2025',
    type: 'Full-time',
    description: 'Spent 14 years at Google Engineering managing a 20+ program portfolio spanning AI/ML (including Gemini-adjacent Google Maps features), cloud infrastructure, and enterprise systems – building the processes, dashboards, and status reporting that keep high volumes of complex, cross-functional launches on track.',
    sections: [
      {
        title: 'Google Maps & Core AI Platforms',
        bullets: [
          'Orchestrated end-to-end SDLC, capacity planning, and critical path execution for 50+ Google Maps cloud infrastructure and AI/ML features (including Gemini Voice Navigation and Ads platforms) as strategic thought partner to VPs and Directors, serving 2B+ global active users with high availability and stringent Latency/SLO targets.',
          'Served as the translation layer between business commitments and engineering execution, directing cross-functional delivery across Engineering, Product, Marketing, UX, Legal, Security/Privacy, QA, and Release teams to deliver scaled launches on schedule.',
          'Championed rapid prototyping and AI evaluation workshops for 30+ TPMs, building organization-wide fluency in AI-driven program management, and advised teams on applying Google AI tools to SDLC governance.'
        ]
      },
      {
        title: 'Finance Cloud Infrastructure & Service Desk Transformation',
        bullets: [
          'Drove AI-powered Service Desk transformation, migrating ticket-routing workflows and contributing to $150M in organization-wide efficiency gains.',
          'Spearheaded Finance Cloud Infrastructure & SDLC transformation for SAP on GCP across 40+ TPMs; improved timely delivery to 90+%, raised regulatory/security compliance to 82+%, and eliminated 21,000+ technical debt defects.',
          'Owned portfolio governance for a 20+ program portfolio, establishing program review cadences and dashboards that gave executive leadership real-time visibility into status, risk, dependencies, capacity, and prioritization decisions as strategic thought partner to VPs and Directors.',
          'Pioneered a single-source-of-truth portfolio management system for Finance Engineering, enabling real-time capacity-versus-demand tracking, dashboard reporting for project/program status, and risk escalation to VPs and Directors.',
          'Directed infrastructure programs at scale with 50+ TPMs: automated SAP entity provisioning to 98% SLO, cut testing costs 67% via server consolidation, and standardized global IT for vendor offices, reducing operational costs by millions.',
          'Led 12 cross-functional teams to complete configurations and dashboards for 100 new entities and 304 subledger requests, improving closure rate to 96%.'
        ]
      },
      {
        title: 'Corporate Engineering, HR Modernization & Contingent Workforce Governance',
        bullets: [
          'Founded Stanford LEAD @ Google in partnership with Stanford Graduate School of Business, empowering employees to become change agents; participants strengthened leadership skills, with several earning promotions.',
          'Improved HR Engineering intake closure to 95% by designing a streamlined intake/backlog process for 200+ customers across 91 product areas, automating ticket generation, and building performance dashboards.',
          'Built the Return to Office dashboard and led end-to-end enhancement of Staffing Requests and internal/external job sites to surface remote work locations.',
          'Led a financial systems modernization program, orchestrating cross-functional teams to retrofit 126 HR systems for the Oracle-to-SAP chart of accounts migration.',
          'Led cross-functional teams to implement integrations across Workday, SAP, and homegrown payroll systems in Ireland, Poland, and Singapore.',
          'Partnered with People Operations, Legal, and Information Security to ensure HR systems complied with General Data Protection Regulation (GDPR) requirements.',
          'Managed software releases for Google\'s HR integration platform, Workday Payroll integrations and HR Ops API.',
          'Owned vendor and investment management for contingent workforce systems: led a cross-functional team with Finance, Legal, and Product to evaluate, select, and design a new vendor management system, driving value, reducing risk, and simplifying contingent workforce management.',
          'Delivered XWM Business Intelligence to provide a single source of truth for managing cost, risk, and operational efficiency in contingent workforce engagements.',
          'Standardized Google Owned Vendor Offices (GOVO) across REWS, xWS, NetOps, AV Eng, Vendor Solutions, Physical Security, and Finance; cut build costs vs. Google employee offices and saved thousands in travel via remote escalations.',
          'Spearheaded cross-functional tracking for TVC facilities across BizApps, REWS, xWS, PeopleOps, and SecOps to verify Vendor Site Checklist and User Data Access Policy compliance.',
          'Conceptualized PSH+, automating TVC access determination by job function and uploading provisioning application lists to eliminate manual manager overhead.'
        ]
      }
    ],
    bullets: [
      'Orchestrated end-to-end SDLC, capacity planning, and critical path execution for 50+ Google Maps cloud infrastructure and AI/ML features (including Gemini Voice Navigation and Ads platforms) as strategic thought partner to VPs and Directors, serving 2B+ global active users with high availability and stringent Latency/SLO targets.',
      'Served as the translation layer between business commitments and engineering execution, directing cross-functional delivery across Engineering, Product, Marketing, UX, Legal, Security/Privacy, QA, and Release teams to deliver scaled launches on schedule.',
      'Championed rapid prototyping and AI evaluation workshops for 30+ TPMs, building organization-wide fluency in AI-driven program management, and advised teams on applying Google AI tools to SDLC governance.',
      'Drove AI-powered Service Desk transformation, migrating ticket-routing workflows and contributing to $150M in organization-wide efficiency gains.',
      'Spearheaded Finance Cloud Infrastructure & SDLC transformation for SAP on GCP across 40+ TPMs; improved timely delivery to 90+%, raised regulatory/security compliance to 82+%, and eliminated 21,000+ technical debt defects.',
      'Owned portfolio governance for a 20+ program portfolio, establishing program review cadences and dashboards that gave executive leadership real-time visibility into status, risk, dependencies, capacity, and prioritization decisions as strategic thought partner to VPs and Directors.',
      'Pioneered a single-source-of-truth portfolio management system for Finance Engineering, enabling real-time capacity-versus-demand tracking, dashboard reporting for project/program status, and risk escalation to VPs and Directors.',
      'Directed infrastructure programs at scale with 50+ TPMs: automated SAP entity provisioning to 98% SLO, cut testing costs 67% via server consolidation, and standardized global IT for vendor offices, reducing operational costs by millions.',
      'Led 12 cross-functional teams to complete configurations and dashboards for 100 new entities and 304 subledger requests, improving closure rate to 96%.',
      'Founded Stanford LEAD @ Google in partnership with Stanford Graduate School of Business, empowering employees to become change agents; participants strengthened leadership skills, with several earning promotions.',
      'Improved HR Engineering intake closure to 95% by designing a streamlined intake/backlog process for 200+ customers across 91 product areas, automating ticket generation, and building performance dashboards.',
      'Built the Return to Office dashboard and led end-to-end enhancement of Staffing Requests and internal/external job sites to surface remote work locations.',
      'Led a financial systems modernization program, orchestrating cross-functional teams to retrofit 126 HR systems for the Oracle-to-SAP chart of accounts migration.',
      'Led cross-functional teams to implement integrations across Workday, SAP, and homegrown payroll systems in Ireland, Poland, and Singapore.',
      'Partnered with People Operations, Legal, and Information Security to ensure HR systems complied with General Data Protection Regulation (GDPR) requirements.',
      'Managed software releases for Google\'s HR integration platform, Workday Payroll integrations and HR Ops API.',
      'Owned vendor and investment management for contingent workforce systems: led a cross-functional team with Finance, Legal, and Product to evaluate, select, and design a new vendor management system, driving value, reducing risk, and simplifying contingent workforce management.',
      'Delivered XWM Business Intelligence to provide a single source of truth for managing cost, risk, and operational efficiency in contingent workforce engagements.',
      'Standardized Google Owned Vendor Offices (GOVO) across REWS, xWS, NetOps, AV Eng, Vendor Solutions, Physical Security, and Finance; cut build costs vs. Google employee offices and saved thousands in travel via remote escalations.',
      'Spearheaded cross-functional tracking for TVC facilities across BizApps, REWS, xWS, PeopleOps, and SecOps to verify Vendor Site Checklist and User Data Access Policy compliance.',
      'Conceptualized PSH+, automating TVC access determination by job function and uploading provisioning application lists to eliminate manual manager overhead.'
    ],
    skillsUsed: ['Google Cloud Platform', 'Google Maps (2B+ users)', 'Gemini Voice Navigation', 'Capacity Planning & Latency/SLO', 'SAP on GCP', 'Portfolio Governance', 'ERP/CRM Integrations (SAP, Workday)', 'GDPR Compliance', 'Looker', 'Jira / Confluence'],
    logoColor: 'text-blue-500'
  },
  {
    role: 'Technical Project Manager',
    company: 'Apple',
    period: 'Jun 2009 – Jun 2011',
    type: 'Full-time',
    description: 'Led development and launch of Apple HR recruiting systems, including the design of Apple Job Search user interface with localized application experiences in 80+ countries.',
    bullets: [
      'Led development and launch of Apple HR recruiting systems, including the design of Apple Job Search user interface with localized application experiences in 80+ countries.',
      'Partnered closely with cross-functional design, security, and infrastructure engineering teams per launch.'
    ],
    skillsUsed: ['Apple Job Search UI', 'Internationalization (80+ countries)', 'Apple HR Recruiting Systems', 'Cross-Functional Design & Security', 'Infrastructure Engineering'],
    logoColor: 'text-gray-900'
  },
  {
    role: 'Software Engineer / Consultant',
    company: 'IBM, DHL, Infogain, Sun Microsystems',
    period: 'Prior Experience',
    type: 'Engineering',
    description: 'Extensive hands-on software engineering across distributed architectures, enterprise workflow integrations, data transfer systems, and financial logistics.',
    bullets: [
      'Sun Microsystems (Oracle) : Led implementation of HP Project & Portfolio Management software for outsourcing workflows. Co-developed a web-based training registration system and temp/contractor database. Sun Java Center consultant for eBay, American Express, Chicago Board Options Exchange.',
      'Infogain: Led full-cycle development of a Data Transfer System and Loan Collection System.',
      'DHL: Co-developed the Shipment Control System.',
      'IBM: Led enhancement of the TECSYS Financials & Distribution System for clients.'
    ],
    skillsUsed: ['Sun Java Center', 'US Patent 20020064766', 'HP PPM', 'Java', 'Data Transfer System', 'Loan Collection System', 'Shipment Control System', 'TECSYS Financials & Distribution'],
    logoColor: 'text-blue-700'
  }
];

export const skillCategories: SkillCategory[] = [
  {
    name: 'Domain Expertise',
    skills: [
      { name: 'Program Management & Technical Program Management', level: 98 },
      { name: 'Go-to-Market & Launch Management at Scale', level: 98 },
      { name: 'Cross-Functional Stakeholder Management', level: 98 },
      { name: 'AI & Agentic Program Management', level: 98 },
      { name: 'Enterprise AI Platform Architecture', level: 96 },
      { name: 'Cloud Computing (IaaS)', level: 95 },
      { name: 'SDLC & PLC Governance', level: 97 }
    ]
  },
  {
    name: 'AI & Infrastructure Technical Skills',
    skills: [
      { name: 'Agentic Frameworks & LLM Ops', level: 98 },
      { name: 'Prompt Engineering', level: 97 },
      { name: 'Vertex AI & Model Context Protocol (MCP)', level: 98 },
      { name: 'Agent-to-Agent (A2A) Protocol', level: 96 },
      { name: 'Google Cloud Platform (Cloud Run, IAM, VPC, CI/CD, Secrets, Firebase)', level: 97 },
      { name: 'Amazon Web Services (AWS)', level: 94 },
      { name: 'Python, Java, SQL, APIs', level: 95 },
      { name: 'ERP/CRM Integrations (SAP, Workday)', level: 96 }
    ]
  },
  {
    name: 'Leadership',
    skills: [
      { name: 'Launch Management, Status Reporting & Dashboards', level: 98 },
      { name: 'AI Program Leadership at Scale', level: 97 },
      { name: 'Executive Stakeholder Influence & Coaching TPMs', level: 98 },
      { name: 'Cross-Functional Capacity & Demand Management', level: 96 },
      { name: 'Process Improvement & Strategic Planning', level: 97 },
      { name: 'Agile PLC/SDLC Governance & Risk Resolution', level: 98 },
      { name: 'Technical/Business Communication & Consensus Building', level: 97 }
    ]
  },
  {
    name: 'Tools',
    skills: [
      { name: 'Google AI Studio, Claude AI Cowork, OpenAI Codex', level: 98 },
      { name: 'Firebase & GitHub', level: 96 },
      { name: 'Looker, Jira & Confluence', level: 97 },
      { name: 'Smartsheet, Linear, Monday.com', level: 95 },
      { name: 'SAP & Workday', level: 96 }
    ]
  }
];

export const patents: PatentItem[] = [
  {
    title: 'Method and Apparatus for Managing Enterprise Employee Training Systems',
    id: 'US Patent Application 20020064766',
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
    title: 'AI Agent Development & LLM Fluency (AI Agents with Model Context Protocol)',
    issuer: 'Vanderbilt University',
    link: 'https://www.coursera.org/account/accomplishments/verify/R3G9DX3448H3',
    badgeType: 'ai'
  },
  {
    title: 'Architect Reusable AI Agent Systems',
    issuer: 'Coursera / Vanderbilt University',
    link: 'https://coursera.org/verify/4NUOQHYUUEE3',
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
    honors: ['Distinguished Scholar', 'Community Advisory Board'],
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


