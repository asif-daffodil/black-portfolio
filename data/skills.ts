export interface PowerConduit {
  id: string;
  name: string;
  level: number; // 0 to 100
  powerOutput: string;
  status: 'OPTIMAL' | 'OVERCHARGED' | 'NOMINAL';
  glowColor: string;
  category: 'backend' | 'frontend' | 'tools';
}

export interface SkillCategoryGroup {
  id: string;
  title: string;
  code: string;
  description: string;
  tags: string[];
}

export const powerConduits: PowerConduit[] = [
  // Backend Conduits
  {
    id: 'c-php',
    name: 'PHP 8+ & Zend Framework (ZCE)',
    level: 96,
    powerOutput: '96.2 MW // OPTIMAL',
    status: 'OPTIMAL',
    glowColor: '#3b82f6',
    category: 'backend',
  },
  {
    id: 'c-laravel',
    name: 'Laravel Ecosystem (Livewire, Inertia, Horizon)',
    level: 95,
    powerOutput: '95.8 MW // OPTIMAL',
    status: 'OPTIMAL',
    glowColor: '#ef4444',
    category: 'backend',
  },
  {
    id: 'c-node',
    name: 'Node.js, Express & Microservices',
    level: 90,
    powerOutput: '90.4 MW // NOMINAL',
    status: 'NOMINAL',
    glowColor: '#10b981',
    category: 'backend',
  },
  {
    id: 'c-db',
    name: 'Database Architecture (MySQL, PostgreSQL, Redis)',
    level: 92,
    powerOutput: '92.1 MW // OPTIMAL',
    status: 'OPTIMAL',
    glowColor: '#f59e0b',
    category: 'backend',
  },

  // Frontend Conduits
  {
    id: 'c-react',
    name: 'React.js & Next.js (App Router)',
    level: 92,
    powerOutput: '92.5 MW // OPTIMAL',
    status: 'OPTIMAL',
    glowColor: '#06b6d4',
    category: 'frontend',
  },
  {
    id: 'c-ts',
    name: 'TypeScript & JavaScript ES6+',
    level: 90,
    powerOutput: '90.0 MW // NOMINAL',
    status: 'NOMINAL',
    glowColor: '#6366f1',
    category: 'frontend',
  },
  {
    id: 'c-tw',
    name: 'Tailwind CSS & Responsive UI Systems',
    level: 95,
    powerOutput: '95.0 MW // OPTIMAL',
    status: 'OPTIMAL',
    glowColor: '#38bdf8',
    category: 'frontend',
  },
  {
    id: 'c-three',
    name: 'Three.js / React Three Fiber & GSAP',
    level: 84,
    powerOutput: '84.2 MW // NOMINAL',
    status: 'NOMINAL',
    glowColor: '#a855f7',
    category: 'frontend',
  },

  // Tools & DevOps Conduits
  {
    id: 'c-docker',
    name: 'Docker, Linux (Ubuntu/Debian) & Nginx/Apache',
    level: 88,
    powerOutput: '88.6 MW // NOMINAL',
    status: 'NOMINAL',
    glowColor: '#0ea5e9',
    category: 'tools',
  },
  {
    id: 'c-git',
    name: 'Git, GitHub Actions CI/CD & Automated Deployment',
    level: 93,
    powerOutput: '93.4 MW // OPTIMAL',
    status: 'OPTIMAL',
    glowColor: '#f97316',
    category: 'tools',
  },
  {
    id: 'c-api',
    name: 'RESTful / GraphQL APIs & Third-Party Gateways',
    level: 94,
    powerOutput: '94.8 MW // OPTIMAL',
    status: 'OPTIMAL',
    glowColor: '#14b8a6',
    category: 'tools',
  },
];

export const categorizedSkills: SkillCategoryGroup[] = [
  {
    id: 'backend',
    title: 'Backend Engineering',
    code: 'SYS-PWR-01',
    description: 'Mission-critical server-side architecture, enterprise ORMs, high-speed relational queries, and caching.',
    tags: [
      'PHP 8.x',
      'Laravel 11',
      'Zend Framework',
      'Node.js',
      'Express',
      'MySQL',
      'PostgreSQL',
      'Redis',
      'MongoDB',
      'Eloquent ORM',
      'RESTful APIs',
      'GraphQL',
      'JWT Auth',
      'Role-Based Access (RBAC)',
      'SSLCommerz / bKash / Stripe',
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend & Reactive UI',
    code: 'SYS-PWR-02',
    description: 'High-performance interactive client interfaces, state machines, WebGL 3D rendering, and responsive design systems.',
    tags: [
      'React.js',
      'Next.js 15/16',
      'TypeScript',
      'JavaScript ES6+',
      'Tailwind CSS',
      'Three.js',
      'React Three Fiber',
      'GSAP',
      'Zustand',
      'Redux Toolkit',
      'HTML5 / Semantic DOM',
      'CSS3 / Glassmorphism',
      'Vite',
    ],
  },
  {
    id: 'tools',
    title: 'DevOps, Cloud & Tooling',
    code: 'SYS-PWR-03',
    description: 'Continuous integration, containerized deployments, cloud hosting, web server hardening, and performance monitoring.',
    tags: [
      'Git & GitHub',
      'GitHub Actions CI/CD',
      'Docker',
      'Linux / Bash',
      'Nginx',
      'Apache',
      'AWS (EC2, S3)',
      'cPanel / WHM',
      'Postman',
      'Composer / npm',
      'OWASP Security',
      'TDD / PHPUnit',
      'PSR Standards',
    ],
  },
];

export const skillsData = {
  conduits: powerConduits,
  categories: categorizedSkills.map((c) => ({
    title: c.title,
    skills: c.tags,
  })),
};
