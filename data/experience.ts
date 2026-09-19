export interface FlightLogEntry {
  id: string;
  missionCode: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  isCurrent: boolean;
  status: 'ACTIVE' | 'CONCLUDED';
  summary: string;
  directives: string[];
  techStack: string[];
  logoUrl?: string;
}

export const experienceData: FlightLogEntry[] = [
  {
    id: 'exp-codersfly',
    missionCode: 'FLIGHT-CFL',
    role: 'Lead Full-Stack Architect & Co-Founder',
    organization: 'CodersFly',
    location: 'Dhaka, Bangladesh / Remote',
    period: '2022 – Present',
    isCurrent: true,
    status: 'ACTIVE',
    summary: 'Directing full-stack software architecture, engineering modern SaaS solutions, and delivering scalable digital platforms for enterprise clients worldwide.',
    directives: [
      'Architect full-lifecycle web applications utilizing Next.js, React, Node.js, and modern Laravel microservices.',
      'Establish company-wide technical standards for code quality, automated testing, CI/CD deployment, and cloud infrastructure.',
      'Collaborate directly with global founders to translate complex business specifications into scalable, production-ready software architectures.',
    ],
    techStack: ['Next.js', 'React', 'Laravel', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'AWS'],
    logoUrl: '/images/legendcoder.png',
  },
  {
    id: 'exp-daffodil',
    missionCode: 'FLIGHT-DFL',
    role: 'Senior Web Developer',
    organization: 'Daffodil Group',
    location: 'Dhaka, Bangladesh',
    period: '2017 – Present',
    isCurrent: true,
    status: 'ACTIVE',
    summary: 'Architecting and maintaining mission-critical enterprise web applications and institutional ERP portals across Daffodil Group’s conglomerate ecosystem.',
    directives: [
      'Develop high-throughput backend services in Laravel 10+, PHP 8+, and MySQL serving tens of thousands of active university students and administrative personnel.',
      'Design secure RESTful API endpoints for seamless integrations between internal ERPs, mobile applications, and payment gateways (SSLCommerz, bKash, Nagad).',
      'Conduct rigorous code reviews, enforce PSR standards, and tune SQL indexing to decrease database query latency by over 35%.',
      'Lead and mentor multidisciplinary agile teams of frontend developers, QA engineers, and UI/UX designers.',
    ],
    techStack: ['Laravel', 'PHP 8', 'MySQL', 'Redis', 'REST APIs', 'Docker', 'SSLCommerz', 'bKash'],
    logoUrl: '/images/daffodil-group-logo.png',
  },
  {
    id: 'exp-itechbd',
    missionCode: 'FLIGHT-ITB',
    role: 'Lead Developer & Technical Founder',
    organization: 'itech-bd.com',
    location: 'Dhaka, Bangladesh',
    period: '2018 – Present',
    isCurrent: true,
    status: 'ACTIVE',
    summary: 'Founded and engineered itech-bd.com, an advanced technical education and e-learning platform providing interactive programming courses and digital training.',
    directives: [
      'Built custom full-stack learning platform with Laravel, Next.js, and MySQL, featuring automated certificate generation, video streaming, and subscription payments.',
      'Engineered automated CI/CD deployment pipelines, server security hardening, backup automation, and Redis caching layers.',
      'Managed platform infrastructure, student onboarding workflows, and real-time support systems.',
    ],
    techStack: ['Laravel', 'Next.js', 'MySQL', 'Redis', 'Stripe', 'Video Streaming', 'Nginx'],
    logoUrl: '/images/itech-bd-logo.png',
  },
  {
    id: 'exp-dipti',
    missionCode: 'FLIGHT-DIP',
    role: 'Senior Instructor — Web Development (PHP, MERN Stack & Freelancing)',
    organization: 'DIPTI AYETS Project / Daffodil Institute of IT',
    location: 'Dhaka, Bangladesh',
    period: '2017 – Present',
    isCurrent: true,
    status: 'ACTIVE',
    summary: 'Conducting 30+ hours weekly of rigorous technical training covering modern PHP, Laravel, React.js, Node.js, MongoDB, and full-stack software engineering.',
    directives: [
      'Authored comprehensive industry-aligned curricula, practical lab projects, and assessment modules for hundreds of emerging software engineers.',
      'Mentored students on international freelancing platforms (Upwork, Fiverr), interview readiness, portfolio creation, and Git team workflows.',
      'Recognized by government bodies (BTEB / NSDA) as an accredited national master trainer and technical assessor.',
    ],
    techStack: ['PHP 8', 'Laravel', 'React.js', 'Node.js', 'MongoDB', 'REST APIs', 'Git', 'Agile'],
    logoUrl: '/images/dipti-logo.png',
  },
  {
    id: 'exp-upwork',
    missionCode: 'FLIGHT-UPW',
    role: 'Full-Stack API Developer (Top Rated — 100% Job Success Score)',
    organization: 'Upwork (Freelance)',
    location: 'Global Remote',
    period: '2015 – Present',
    isCurrent: true,
    status: 'ACTIVE',
    summary: 'Maintaining an unbroken 100% Job Success Score (JSS) as an Upwork Top Rated full-stack developer across 37+ international contracts.',
    directives: [
      'Delivered robust custom API backends, SaaS web applications, e-commerce stores, and third-party integrations for clients in the US, UK, Canada, and Europe.',
      'Engineered custom Laravel and Node.js solutions with bulletproof JWT authentication, role-based access control (RBAC), and automated webhook handlers.',
      'Maintained 5-star client ratings through clear communication, architectural precision, and prompt post-deployment support.',
    ],
    techStack: ['Laravel', 'Vue.js', 'React', 'Node.js', 'Stripe', 'REST APIs', 'PostgreSQL', 'AWS'],
    logoUrl: '/images/upwork-logo.png',
  },
  {
    id: 'exp-codemanbd',
    missionCode: 'FLIGHT-CMB',
    role: 'Backend Web Developer (Contract)',
    organization: 'CodemanBD',
    location: 'Dhaka, Bangladesh',
    period: '2023 – Present',
    isCurrent: true,
    status: 'ACTIVE',
    summary: 'Built and maintained scalable backend services and custom REST APIs with Laravel and MySQL for training management and student onboarding systems.',
    directives: [
      'Developed API endpoints and backend business logic for student portals and course enrollment pipelines.',
      'Provided architectural guidance to frontend engineers on API serialization, data contracts, and client-side caching.',
    ],
    techStack: ['Laravel', 'MySQL', 'REST APIs', 'WordPress Integration', 'React'],
    logoUrl: '/images/projects/codemanbd.jpg',
  },
  {
    id: 'exp-banglalink',
    missionCode: 'FLIGHT-BLK',
    role: 'Customer Care Representative',
    organization: 'Banglalink Digital Communications Ltd.',
    location: 'Dhaka, Bangladesh',
    period: 'February 2014 – November 2014',
    isCurrent: false,
    status: 'CONCLUDED',
    summary: 'Handled technical customer support, billing inquiries, and service resolution for enterprise and retail telecom subscribers while maintaining superior CSAT scores.',
    directives: [
      'Resolved complex telecom service requests and data connectivity issues.',
      'Recognized for exceptional communication skills and rapid issue triage under high call volumes.',
    ],
    techStack: ['Customer Support', 'Telecom Systems', 'CRM', 'Problem Resolution'],
    logoUrl: '/images/banglalink.png',
  },
  {
    id: 'exp-grameenphone',
    missionCode: 'FLIGHT-GPH',
    role: 'Executive (Customer Service)',
    organization: 'Grameenphone Ltd.',
    location: 'Dhaka, Bangladesh',
    period: 'September 2009 – July 2012',
    isCurrent: false,
    status: 'CONCLUDED',
    summary: 'Delivered tier-1 technical support, account management, and network troubleshooting for corporate and retail accounts at Bangladesh’s leading telecom operator.',
    directives: [
      'Assisted enterprise clients with network setup, postpaid billing, and corporate data plans.',
      'Consistently ranked among top performers for quality assurance and issue resolution speed.',
    ],
    techStack: ['Customer Service', 'Enterprise Telecom', 'Account Management', 'CRM'],
    logoUrl: '/images/grameenphone-logo.png',
  },
];
