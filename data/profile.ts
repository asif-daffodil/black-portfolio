export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface StatItem {
  label: string;
  value: string;
  description?: string;
  badge?: string;
}

export interface ProfileData {
  name: string;
  callsign: string;
  title: string;
  role: string;
  organization: string;
  tagline: string;
  bio: string[];
  avatarUrl: string;
  executiveImageUrl?: string;
  architectImageUrl?: string;
  outdoorImageUrl?: string;
  resumeUrl: string;
  location: string;
  email: string;
  phone: string;
  yearsOfExperience: number;
  upworkJSS: string;
  completedProjects: number;
  zceCredential: string;
  stats: StatItem[];
  socialLinks: SocialLink[];
}

export const profileData: ProfileData = {
  name: 'Asif Abir',
  callsign: 'PILOT-ZCE',
  title: 'Zend Certified PHP Engineer & Full-Stack Developer',
  role: 'Senior Web Developer',
  organization: 'Daffodil Group',
  tagline: '14+ years crafting scalable enterprise web systems, high-availability backends, and modern cloud architectures.',
  bio: [
    'Zend Certified PHP Engineer (ZCE) with over 14 years of professional experience engineering resilient, mission-critical web applications across Bangladesh and international markets.',
    'Currently serving as Senior Web Developer at Daffodil Group, architecting university ERP systems, high-traffic portals, and institutional APIs serving tens of thousands of active users.',
    'Top Rated Full-Stack Developer on Upwork with an unbroken 100% Job Success Score (JSS) across 37+ global enterprise contracts, specializing in Laravel, Node.js, Next.js, and cloud systems.'
  ],
  avatarUrl: '/images/asif-abir-executive.png',
  executiveImageUrl: '/images/asif-abir-executive.png',
  architectImageUrl: '/images/asif-abir-architect.jpg',
  outdoorImageUrl: '/images/asif-abir-outdoor.jpg',
  resumeUrl: '/images/CV of Asif Mohammadd Abir.pdf',
  location: '9 Sher-E-Bangla Road, Hazaribagh, Dhaka-1209, Bangladesh',
  email: 'asif.abir@hotmail.com',
  phone: '+880 1955 517 560',
  yearsOfExperience: 14,
  upworkJSS: '100%',
  completedProjects: 37,
  zceCredential: 'ZEND029749',
  stats: [
    { label: 'Years Experience', value: '14+', description: 'Since 2010' },
    { label: 'Upwork JSS', value: '100%', description: 'Top Rated Status' },
    { label: 'Projects Completed', value: '37+', description: 'International Contracts' },
    { label: 'ZCE Credential', value: 'ZCE 7.1', description: 'Certified PHP Engineer', badge: 'GOLD STANDARD' },
  ],
  socialLinks: [
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/asif-abir-5a5a5927b/' },
    { platform: 'GitHub', url: 'https://github.com/asif-daffodil/' },
    { platform: 'Upwork', url: 'https://www.upwork.com/freelancers/laravelasif' },
    { platform: 'Facebook', url: 'https://www.facebook.com/abir.upwork' },
  ],
};
