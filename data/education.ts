export interface DegreeRecord {
  id: string;
  order: number;
  archiveCode: string;
  degree: string;
  major: string;
  institution: string;
  location: string;
  period: string;
  passingYear: string;
  gpa: string;
  gpaScale: string;
  summary: string;
  logoUrl?: string;
}

export const educationData: DegreeRecord[] = [
  {
    id: 'edu-ssc',
    order: 1,
    archiveCode: 'ACAD-01',
    degree: 'Secondary School Certificate (SSC)',
    major: 'Science',
    institution: 'Government Laboratory High School',
    location: 'Dhaka, Bangladesh',
    period: '2001 – 2003',
    passingYear: '2003',
    gpa: '3.81',
    gpaScale: '5.0',
    summary: 'Secondary education with distinction in sciences, advanced mathematics, physics, and computing fundamentals.',
    logoUrl: '/images/Government_Laboratory_High_School_Monogram.png',
  },
  {
    id: 'edu-hsc',
    order: 2,
    archiveCode: 'ACAD-02',
    degree: 'Higher Secondary Certificate (HSC)',
    major: 'Business Studies',
    institution: 'Rifles Public School & College (Birshreshtha Noor Mohammad)',
    location: 'Dhaka, Bangladesh',
    period: '2003 – 2005',
    passingYear: '2005',
    gpa: '3.10',
    gpaScale: '5.0',
    summary: 'Higher secondary foundation in business management, accounting, statistical analysis, and information systems.',
    logoUrl: '/images/rifles.png',
  },
  {
    id: 'edu-bba',
    order: 3,
    archiveCode: 'ACAD-03',
    degree: 'Bachelor of Business Administration (BBA)',
    major: 'Human Resource Management (HRM)',
    institution: 'Darul Ihsan University',
    location: 'Dhaka, Bangladesh',
    period: '2006 – 2010',
    passingYear: '2010',
    gpa: '3.50',
    gpaScale: '4.0',
    summary: 'Comprehensive four-year business degree focusing on strategic organizational management, team dynamics, business communication, and enterprise operations.',
    logoUrl: '/images/Darul.png',
  },
];
