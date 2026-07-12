export interface AppPortfolioItem {
  name: string;
  url: string;
  description: string;
  role: string;
  bulletPoints: string[];
  tags: string[];
  isFlagship?: boolean;
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
  badgeType: 'ai' | 'pm' | 'tech';
}

export interface EducationItem {
  school: string;
  degree: string;
  period?: string;
  honors?: string[];
  details?: string;
}
