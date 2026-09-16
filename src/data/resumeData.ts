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
  tagline: 'Creative Blue | Google | Apple | Sun/Oracle',
  summary: `Results-focused Technical Program Manager with 15+ years leading cross-functional teams from inception to production, including 14 years at Google Engineering (Maps, Finance, HR, IT) and 2 years at Apple HR Engineering. Delivered enterprise-scale programs for Google Maps with Ads (2 billion+ users), Finance, and HR engineering in partnership with UX, Legal and Security/Privacy teams. Built Finance engineering governance that lifted on-time delivery KPI to 90+% through a quarterly leaderboard incentive program. Led integration of home-grown systems with external platforms. Founded Stanford LEAD at Google in partnership with Stanford Graduate School of Business. Led the development of Apple's global recruiting systems that launched across 80+ countries. Rooted in hands-on software engineering at Sun Java Center, architected enterprise systems for eBay, American Express, and Chicago Board Options Exchange. Architecting Creative Blue GrowthOS, a GCP-hosted agentic AI platform integrating Apollo, Harvest, Box, Slack, and Search Atlas to compress lead prospecting, client onboarding, and social media analysis from days to minutes.`,
  about: `My path into technology started with a simple act of curiosity: helping a high school friend set up her first Apple computer, which meant teaching myself BASIC along the way. That early spark earned me a full-ride scholarship in Computer Science and eventually carried me to the heart of Silicon Valley where I worked for big tech companies like [Google](company:1) who sponsored my completion of the [Stanford LEAD](https://grow.stanford.edu/browse/stanford-lead-online-business-program) executive education program.

I've led global enterprise deployments spanning Japan, Taiwan, Bahrain, Philippines, Europe and India. Working across such different cultures taught me as much about people as it did about technology, and shaped how I think about collaboration to this day. Alongside that career, I built a life with my husband and raised a [daughter](https://carissaott.com) who is now forging her own path in software engineering. Our Samoyed dog, [Mochi Pancake](https://www.youtube.com/shorts/2T1lhjRaovY), inspired the creation of Mochi AI chatbot on this website. Feel free to ask Mochi questions about me by clicking on his icon on the lower right-hand corner. In my youth I played Pac-Man in the arcade; try out [Mochi Pac-Man](/pacman) to play this classic video game with Mochi.

Today, I focus on ##leading technology transformations that put people at the center of progress.## I help companies put AI to work at scale, while investing just as much in the growth of the teams behind that innovation.`,
  companiesLineage: ['Creative Blue', 'Google', 'Apple', 'Sun Microsystems / Oracle', 'IBM · DHL · Infogain · Sun Microsystems']
};

export const portfolioApps: AppPortfolioItem[] = [
  {
    name: 'Creative Blue GrowthOS',
    url: 'https://cb-growthos-hub-553545205591.us-west1.run.app',
    description: 'An enterprise agentic AI platform on GCP integrating Apollo, Harvest, Box, Slack and Search Atlas; slashed lead prospecting and client onboarding time from days to minutes while automating social media audits via AI-driven URL parsing.',
    role: 'Head of Technology Transformation / Architect',
    bulletPoints: [
      'Built GrowthOS, an enterprise agentic AI platform on GCP integrating Apollo, Harvest, Box, Slack and Search Atlas.',
      'Slashed lead prospecting and client onboarding time from days to minutes while automating social media audits via AI-driven URL parsing.',
      'Modernized operational forecasting through unified data dashboards and led hands-on sprints driving agency-wide AI automation adoption.'
    ],
    tags: ['Generative AI', 'Agentic Workflows', 'GCP', 'Multi-Agent Systems', 'Enterprise Automation'],
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
    description: 'An emerging AI-driven prospecting solution based on ideal client profiles (ICP), deployed with ethical AI policies.',
    role: 'Head of Technology Transformation',
    bulletPoints: [
      'Designed and deployed agentic frameworks with ethical AI policy for emerging solutions.',
      'AI-driven prospecting based on ideal client profile (ICP).',
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
      'Designed and deployed agentic frameworks with ethical AI policy for brand intelligence.',
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
      'Planning partnerships to offer perks for members.',
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
    description: 'Architecting Creative Blue GrowthOS, a GCP-hosted agentic AI platform integrating Apollo, Harvest, Box, Slack, and Search Atlas to compress lead prospecting, client onboarding, and social media analysis from days to minutes.',
    bullets: [
      'Built GrowthOS, an enterprise agentic AI platform on GCP integrating Apollo, Harvest, Box, Slack and Search Atlas; slashed lead prospecting and client onboarding time from days to minutes while automating social media audits via AI-driven URL parsing. Modernized operational forecasting through unified data dashboards and led hands-on sprints driving agency-wide AI automation adoption.',
      'Designed and deployed agentic frameworks with ethical AI policy for emerging solutions such as [Lead Generator](/work#portfolio-lead-generator) (AI-driven prospecting based on ideal client profile) and [Brand Assessment](/work#portfolio-brand-assessment) (AI-driven brand scoring with improvement recommendations).',
      'Pioneered [Grex](/work#portfolio-grex-world), an AI-powered marketplace connecting companies\' problem statements with worker-sourced solutions that can become investable opportunities. Planning partnerships to offer perks for members.',
      'Developed the AI framework for [Just Ride](/work#portfolio-just-ride), unifying cycling race data into a single source of truth with automated pro-level race intelligence for the global peloton.'
    ],
    skillsUsed: ['Google AI Studio', 'Claude Code/Cowork', 'Google Cloud Platform (Cloud Run, IAM, VPC, CI/CD, secrets management, Vertex AI)', 'Firebase', 'Agentic Workflows', 'LLM Ops', 'API', 'MCP', 'A2A', 'Python', 'TypeScript'],
    logoColor: 'text-[#3333FF]'
  },
  {
    role: 'Senior Engineering Program Manager',
    company: 'Google',
    period: 'Jun 2011 – Nov 2025',
    type: 'Full-time',
    description: 'Led 14 years of enterprise-scale engineering operations across Google Maps (2B+ users with Ads & Gemini Voice Navigation), Google Core (SAP on GCP, Finance SDLC Governance, $150M Service Desk Transformation), and Google Corporate Engineering (Stanford LEAD @ Google, HR Systems, Vendor Management, TVC Governance).',
    sections: [
      {
        title: 'Google Maps',
        bullets: [
          'Managed full SDLC and monthly/quarterly business reviews (MBR/QBR) of roadmap for 50+ Google Maps features (with Ads and Gemini Voice Navigation) on cloud infrastructure serving 2 billion+ users. Directed critical path management and bottleneck resolution based on dependency risk, ensuring high-quality, on-time delivery. Landed AI/ML capabilities in production with Security/Privacy approval and incremental deployments/rollback based on A/B Testing and Geo Quality metrics.',
          'Led cross-functional execution across engineering, product, UX, Security/Privacy, QA and release teams to deliver scaled launches on schedule.',
          'Championed rapid prototyping and AI evaluation workshops for 30+ TPMs, building organization-wide fluency in AI-driven program management, and advised teams on applying Google AI tools to SDLC governance.'
        ]
      },
      {
        title: 'Google Core',
        bullets: [
          'Cultivated a TPM culture centered on technical rigor, mentoring and execution, contributing to multiple senior TPM promotions.',
          'Drove AI-powered Service Desk transformation, migrating ticket-routing workflows and contributing to $150M in organization-wide efficiency gains.',
          'Transformed Finance SDLC governance for SAP on Google Cloud Platform, consulting for 40+ TPMs; improved timely delivery to 90+%, raised compliance to 82+%, and reduced defects by 21,000+.',
          'Established program review cadences across a 20+ program portfolio, driving executive visibility into status, risk, dependencies and prioritization decisions.',
          'Directed infrastructure programs at scale with 50+ TPMs: automated SAP entity provisioning to 98% SLO, cut testing costs 67% via server consolidation, and standardized global IT for vendor offices, reducing operational costs by millions.',
          'Pioneered a single-source-of-truth portfolio management system for Finance Engineering, enabling dashboard reporting for project/program tracking and risk escalation to leadership.',
          'Led cross-functional teams to implement a lightweight SDLC, improving compliance, timeliness, quality and traceability of Finance system releases by incentivizing quarterly leaderboards.',
          'Built dashboards to monitor monthly releases and developed AI/ML solutions to improve operational efficiency.',
          'Led 12 cross-functional teams to complete configurations and dashboards for 100 new entities and 304 subledger requests, improving closure rate to 96%.'
        ]
      },
      {
        title: 'Google Corporate Engineering',
        bullets: [
          'Founded Stanford LEAD @ Google in partnership with Stanford Graduate School of Business, empowering employees to become change agents; participants strengthened leadership skills, with several earning promotions.',
          'Improved HR Engineering intake closure to 95% by designing a streamlined intake/backlog process for 200+ customers across 91 product areas, automating ticket generation, and building performance dashboards.',
          'Built the Return to Office dashboard and led end-to-end enhancement of Staffing Requests and internal/external job sites to surface remote work locations.',
          'Orchestrated cross-functional teams to retrofit 126 HR systems for the Oracle-to-SAP chart of accounts migration.',
          'Led cross-functional teams to implement integrations across Workday, SAP and homegrown payroll systems in Ireland, Poland and Singapore.',
          'Partnered with People Operations, Legal and Information Security to ensure HR systems complied with General Data Protection Regulation (GDPR) requirements.',
          'Managed software releases for Google\'s HR integration platform, Workday Payroll integrations and HR Ops API.',
          'Led a cross-functional team partnered with Finance, Legal and Product Areas to design a new vendor management system driving value, reducing risk and simplifying contingent workforce management.',
          'Delivered XWM Business Intelligence to provide a single source of truth for managing cost, risk and operational efficiency in contingent workforce engagements.',
          'Standardized Google Owned Vendor Offices (GOVO) across REWS, xWS, NetOps, AV Eng, Vendor Solutions, Physical Security and Finance; cut build costs vs. Googler offices and saved thousands in travel via remote escalations.',
          'Spearheaded cross-functional tracking for TVC facilities across BizApps, REWS, xWS, PeopleOps and SecOps to verify Vendor Site Checklist and User Data Access Policy compliance.',
          'Conceptualized PSH+, automating TVC access determination by job function and uploading provisioning application lists to eliminate manual manager overhead.'
        ]
      }
    ],
    bullets: [
      'Managed full SDLC and monthly/quarterly business reviews (MBR/QBR) of roadmap for 50+ Google Maps features (with Ads and Gemini Voice Navigation) on cloud infrastructure serving 2 billion+ users. Directed critical path management and bottleneck resolution based on dependency risk, ensuring high-quality, on-time delivery. Landed AI/ML capabilities in production with Security/Privacy approval and incremental deployments/rollback based on A/B Testing and Geo Quality metrics.',
      'Led cross-functional execution across engineering, product, UX, Security/Privacy, QA and release teams to deliver scaled launches on schedule.',
      'Championed rapid prototyping and AI evaluation workshops for 30+ TPMs, building organization-wide fluency in AI-driven program management, and advised teams on applying Google AI tools to SDLC governance.',
      'Cultivated a TPM culture centered on technical rigor, mentoring and execution, contributing to multiple senior TPM promotions.',
      'Drove AI-powered Service Desk transformation, migrating ticket-routing workflows and contributing to $150M in organization-wide efficiency gains.',
      'Transformed Finance SDLC governance for SAP on Google Cloud Platform, consulting for 40+ TPMs; improved timely delivery to 90+%, raised compliance to 82+%, and reduced defects by 21,000+.',
      'Established program review cadences across a 20+ program portfolio, driving executive visibility into status, risk, dependencies and prioritization decisions.',
      'Directed infrastructure programs at scale with 50+ TPMs: automated SAP entity provisioning to 98% SLO, cut testing costs 67% via server consolidation, and standardized global IT for vendor offices, reducing operational costs by millions.',
      'Pioneered a single-source-of-truth portfolio management system for Finance Engineering, enabling dashboard reporting for project/program tracking and risk escalation to leadership.',
      'Led cross-functional teams to implement a lightweight SDLC, improving compliance, timeliness, quality and traceability of Finance system releases by incentivizing quarterly leaderboards.',
      'Built dashboards to monitor monthly releases and developed AI/ML solutions to improve operational efficiency.',
      'Led 12 cross-functional teams to complete configurations and dashboards for 100 new entities and 304 subledger requests, improving closure rate to 96%.',
      'Founded Stanford LEAD @ Google in partnership with Stanford Graduate School of Business, empowering employees to become change agents; participants strengthened leadership skills, with several earning promotions.',
      'Improved HR Engineering intake closure to 95% by designing a streamlined intake/backlog process for 200+ customers across 91 product areas, automating ticket generation, and building performance dashboards.',
      'Built the Return to Office dashboard and led end-to-end enhancement of Staffing Requests and internal/external job sites to surface remote work locations.',
      'Orchestrated cross-functional teams to retrofit 126 HR systems for the Oracle-to-SAP chart of accounts migration.',
      'Led cross-functional teams to implement integrations across Workday, SAP and homegrown payroll systems in Ireland, Poland and Singapore.',
      'Partnered with People Operations, Legal and Information Security to ensure HR systems complied with General Data Protection Regulation (GDPR) requirements.',
      'Managed software releases for Google\'s HR integration platform, Workday Payroll integrations and HR Ops API.',
      'Led a cross-functional team partnered with Finance, Legal and Product Areas to design a new vendor management system driving value, reducing risk and simplifying contingent workforce management.',
      'Delivered XWM Business Intelligence to provide a single source of truth for managing cost, risk and operational efficiency in contingent workforce engagements.',
      'Standardized Google Owned Vendor Offices (GOVO) across REWS, xWS, NetOps, AV Eng, Vendor Solutions, Physical Security and Finance; cut build costs vs. Googler offices and saved thousands in travel via remote escalations.',
      'Spearheaded cross-functional tracking for TVC facilities across BizApps, REWS, xWS, PeopleOps and SecOps to verify Vendor Site Checklist and User Data Access Policy compliance.',
      'Conceptualized PSH+, automating TVC access determination by job function and uploading provisioning application lists to eliminate manual manager overhead.'
    ],
    skillsUsed: ['Google Cloud Platform', 'Google Maps (2B+ users)', 'Gemini Voice Navigation', 'A/B Testing & Geo Quality', 'SAP on GCP', 'SDLC Governance', 'Workday & HR Ops API', 'GDPR Compliance', 'Looker', 'Jira / Confluence'],
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
    role: 'Technical Project Manager',
    company: 'Sun Microsystems / Oracle',
    period: 'Jan 2004 – Jun 2009',
    type: 'Full-time',
    description: 'Led implementation of HP Project & Portfolio Management software for outsourcing workflows.',
    bullets: [
      'Led implementation of HP Project & Portfolio Management software for outsourcing workflows.'
    ],
    skillsUsed: ['HP PPM', 'Outsourcing Workflows', 'Program Management', 'Enterprise Systems', 'SDLC Governance'],
    logoColor: 'text-red-600'
  },
  {
    role: 'Software Engineer',
    company: 'IBM · DHL · Infogain · Sun Microsystems',
    period: 'Earlier',
    type: 'Engineering',
    description: 'Rooted in hands-on software engineering at Sun Java Center, architected enterprise systems for eBay, American Express, and Chicago Board Options Exchange; co-developed patented enterprise employee training systems.',
    bullets: [
      'Sun: co-developed a web-based training registration system (US Patent 20020064766) and a temp/contractor database; Sun Java Center consultant to eBay, American Express and the Chicago Board Options Exchange.',
      'Infogain: led full-cycle development of a Data Transfer System and Loan Collection System. DHL: co-developed the Shipment Control System. IBM: led enhancement of the TECSYS Financials & Distribution System for clients.'
    ],
    skillsUsed: ['Sun Java Center', 'US Patent 20020064766', 'Java', 'Data Transfer System', 'Loan Collection System', 'Shipment Control System', 'TECSYS Financials & Distribution'],
    logoColor: 'text-blue-700'
  }
];

export const skillCategories: SkillCategory[] = [
  {
    name: 'Domain Expertise',
    skills: [
      { name: 'Technical Program Management', level: 98 },
      { name: 'Cloud Computing IaaS', level: 95 },
      { name: 'Full-Stack Architecture', level: 94 },
      { name: 'Enterprise Consulting & Governance', level: 96 }
    ]
  },
  {
    name: 'Technical Skills',
    skills: [
      { name: 'Google AI & Claude AI', level: 97 },
      { name: 'LLM Ops & Agentic Workflows', level: 98 },
      { name: 'API, MCP & A2A Protocols', level: 96 },
      { name: 'Python, Java & AppScript', level: 94 },
      { name: 'TypeScript, JavaScript, HTML & CSS', level: 95 },
      { name: 'SQL & Database Architecture', level: 94 },
      { name: 'Linux, MacOS & Windows Environments', level: 92 }
    ]
  },
  {
    name: 'Leadership',
    skills: [
      { name: 'Transformational Programs & Process Improvement', level: 98 },
      { name: 'Strategic & Tactical Planning', level: 96 },
      { name: 'Agile PLC & SDLC Governance', level: 97 },
      { name: 'Risk & Change Management', level: 95 },
      { name: 'Technical/Business Communication', level: 97 },
      { name: 'Conflict Resolution & Consensus Building', level: 96 }
    ]
  },
  {
    name: 'Tools & Platforms',
    skills: [
      { name: 'Google AI Studio & Claude Code/Cowork', level: 98 },
      { name: 'Google Cloud Platform (Cloud Run, IAM, VPC, CI/CD, Vertex AI)', level: 96 },
      { name: 'Firebase & GitHub', level: 94 },
      { name: 'Looker, Jira & Confluence', level: 97 },
      { name: 'Linear, Monday.com & Smartsheet', level: 93 }
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
    title: 'Architect Reusable AI Agent Systems',
    issuer: 'Vanderbilt University',
    link: 'https://coursera.org/verify/4NUOQHYUUEE3',
    badgeType: 'ai'
  },
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


