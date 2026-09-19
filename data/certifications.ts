export interface CertificationRecord {
  id: string;
  code: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  badgeImageUrl?: string;
  isNationalAccreditation?: boolean;
  summary: string;
}

export const certificationsData: CertificationRecord[] = [
  {
    id: 'cert-zce',
    code: 'CERT-01',
    title: 'Zend Certified PHP Engineer (ZCE)',
    issuer: 'Zend by Perforce / Rogue Wave',
    issueDate: 'December 2020',
    credentialId: 'ZEND029749',
    credentialUrl: 'https://www.zend-zce.com/',
    badgeImageUrl: '/images/zce-2017-small.gif',
    isNationalAccreditation: false,
    summary: 'Globally recognized industry-standard credential verifying mastery of PHP object-oriented architecture, security protocols, design patterns, and enterprise execution.',
  },
  {
    id: 'cert-nsda',
    code: 'CERT-02',
    title: 'Web Design with Freelancing (Level 3)',
    issuer: 'National Skills Development Authority (NSDA) — Prime Minister’s Office',
    issueDate: 'February 2024',
    credentialId: 'NSDA-WD-L3-2024',
    badgeImageUrl: '/images/ntvqf.png',
    isNationalAccreditation: true,
    summary: 'Government-certified national competency qualification covering professional UI development, client negotiation, and international freelancing standards.',
  },
  {
    id: 'cert-ntvqf',
    code: 'CERT-03',
    title: 'Web Design and Development (Level 4)',
    issuer: 'National Technical & Vocational Qualifications Framework (NTVQF)',
    issueDate: 'November 2022',
    credentialId: 'NTVQF-WD-L4-2022',
    badgeImageUrl: '/images/ntvqf.png',
    isNationalAccreditation: true,
    summary: 'Advanced national competence accreditation for enterprise full-stack development, database design, and certified competency-based training delivery.',
  },
  {
    id: 'cert-bteb',
    code: 'CERT-04',
    title: 'Web Design & Development Certification',
    issuer: 'Bangladesh Technical Education Board (BTEB)',
    issueDate: 'December 2019',
    credentialId: 'BTEB-WDD-2019',
    badgeImageUrl: '/images/bteb.png',
    isNationalAccreditation: true,
    summary: 'Official technical board certification affirming comprehensive technical proficiency in web systems engineering, client-server models, and database security.',
  },
  {
    id: 'cert-ph',
    code: 'CERT-05',
    title: 'Complete Web Development with MERN & Next.js',
    issuer: 'Programming Hero',
    issueDate: '2023',
    credentialId: 'PH-MERN-2023',
    badgeImageUrl: '/images/itech-bd-logo.png',
    isNationalAccreditation: false,
    summary: 'In-depth specialization program focusing on full-stack MERN (MongoDB, Express, React, Node.js), Next.js App Router, JWT authentication, and modern TypeScript workflows.',
  },
  {
    id: 'cert-zf',
    code: 'CERT-06',
    title: 'Zend Framework 3 / 2 Enterprise MVC Architecture',
    issuer: 'Zend / Rogue Wave Software',
    issueDate: '2018',
    credentialId: 'ZF-ENT-2018',
    badgeImageUrl: '/images/zce-2017-small.gif',
    isNationalAccreditation: false,
    summary: 'Enterprise engineering certification for Zend Framework MVC components, service managers, dependency injection, and scalable enterprise web services.',
  },
  {
    id: 'cert-udemy',
    code: 'CERT-07',
    title: 'Master Laravel with REST API & Advanced Architecture',
    issuer: 'Udemy Specialization',
    issueDate: '2022',
    credentialId: 'UC-LARAVEL-REST-2022',
    badgeImageUrl: '/images/daffodil-group-logo.png',
    isNationalAccreditation: false,
    summary: 'Advanced architectural curriculum covering Laravel REST API design, microservices, queued event processing, rate limiting, and automated PHPUnit testing.',
  },
  {
    id: 'cert-diit',
    code: 'CERT-08',
    title: 'Diploma in Web & E-Commerce',
    issuer: 'Daffodil Institute of IT (DIIT)',
    issueDate: 'July 2015',
    credentialId: 'DIIT-DWE-2015',
    badgeImageUrl: '/images/diit-whitw-1.png',
    isNationalAccreditation: false,
    summary: 'One-year professional diploma covering core internet technologies, relational database design, secure payment gateway integrations, and eCommerce systems.',
  },
  {
    id: 'cert-seo',
    code: 'CERT-09',
    title: 'Search Engine Optimization (SEO) Certification',
    issuer: 'Creative IT Institute',
    issueDate: 'December 2015',
    credentialId: 'CIT-SEO-2015',
    badgeImageUrl: '/images/creativeIt.webp',
    isNationalAccreditation: false,
    summary: 'Specialized program on technical search optimization, Core Web Vitals, organic crawlability, schema microdata, and search rank telemetry.',
  },
];
