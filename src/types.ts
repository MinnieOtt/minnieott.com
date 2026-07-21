export interface AppPortfolioItem {
  name: string;
  url: string;
  description: string;
  role: string;
  bulletPoints: string[];
  tags: string[];
  isFlagship?: boolean;
  status?: 'Ready to use' | 'Work In Progress';
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  type?: string;
  description: string;
  bullets: string[];
  skillsUsed: string[];
  logoColor?: string;
}

export interface SkillCategory {
  name: string;
  skills: { name: string; level: number }[];
}

export interface PatentItem {
  title: string;
  id: string;
  link: string;
  description: string;
}

export interface CertificationItem {
  title: string;
  issuer: string;
  link?: string;
  links?: { label: string; url: string }[];
  badgeType: 'ai' | 'pm' | 'tech';
}

export interface EducationItem {
  school: string;
  degree: string;
  period?: string;
  honors?: string[];
  details?: string;
}

export interface SpeakerEvent {
  event: string;
  links: { label: string; url: string }[];
  description: string;
  date?: string;
}

export interface EndorsementItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  relation?: string;
}

