import type { Metadata } from 'next';
import './globals.css';
import { profileData } from '@/data/profile';
import { educationData } from '@/data/education';
import { certificationsData } from '@/data/certifications';

export const metadata: Metadata = {
  title: 'Asif Abir | Zend Certified PHP Engineer | Full-Stack Developer',
  description:
    'Asif Abir — Zend Certified PHP Engineer, Full-Stack Developer (Laravel, Node.js, Next.js, React), Senior Developer at Daffodil Group, Upwork Top Rated with 100% Job Success Score.',
  keywords: [
    'Asif Abir',
    'PHP Developer',
    'Laravel Developer',
    'Zend Certified',
    'Full Stack Developer',
    'Bangladesh',
    'MERN Stack',
    'Node.js',
    'React',
    'Next.js',
    'Upwork',
    'ZCE PHP Engineer',
    'Daffodil Group',
    'CodersFly',
  ],
  authors: [{ name: 'Asif Abir', url: 'https://asif.com.bd' }],
  creator: 'Asif Abir',
  publisher: 'Asif Abir',
  metadataBase: new URL('https://asif.com.bd'),
  alternates: {
    canonical: 'https://asif.com.bd',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Asif Abir | Zend Certified Full-Stack Developer',
    description:
      '14+ years building modern web apps. PHP/Laravel ZCE, Node.js, Next.js, React, AI integration.',
    url: 'https://asif.com.bd',
    siteName: 'Asif Abir Portfolio',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://asif.com.bd/images/asif-abir-executive.png',
        width: 800,
        height: 800,
        alt: 'Asif Abir - Zend Certified Full-Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Asif Abir | Zend Certified Full-Stack Developer',
    description:
      '14+ years building modern web apps. PHP/Laravel ZCE, Node.js, Next.js, React, AI integration.',
    images: ['https://asif.com.bd/images/asif-abir-executive.png'],
    creator: '@asif_abir',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/images/asif-abir-executive.png',
  },
};

const jsonLdData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://asif.com.bd/#website',
      url: 'https://asif.com.bd',
      name: 'Asif Abir | Zend Certified Full-Stack Developer',
      description:
        '14+ years building modern web apps. PHP/Laravel ZCE, Node.js, Next.js, React, AI integration.',
      publisher: {
        '@id': 'https://asif.com.bd/#person',
      },
    },
    {
      '@type': 'Person',
      '@id': 'https://asif.com.bd/#person',
      name: profileData.name,
      alternateName: ['Asif Mohammadd Abir', profileData.callsign],
      description: profileData.tagline,
      jobTitle: profileData.title,
      worksFor: {
        '@type': 'Organization',
        name: profileData.organization,
        url: 'https://daffodil.family',
      },
      url: 'https://asif.com.bd',
      image: 'https://asif.com.bd/images/asif-abir-executive.png',
      email: `mailto:${profileData.email}`,
      telephone: profileData.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: '9 Sher-E-Bangla Road, Hazaribagh',
        addressLocality: 'Dhaka',
        postalCode: '1209',
        addressCountry: 'BD',
      },
      sameAs: profileData.socialLinks.map((s) => s.url),
      alumniOf: educationData.map((edu) => ({
        '@type': 'EducationalOrganization',
        name: edu.institution,
        location: edu.location,
      })),
      hasCredential: certificationsData.map((cert) => ({
        '@type': 'EducationalOccupationalCredential',
        name: cert.title,
        credentialCategory: 'Certification',
        identifier: cert.credentialId || undefined,
        recognizedBy: {
          '@type': 'Organization',
          name: cert.issuer,
        },
      })),
      knowsAbout: [
        'PHP 8+',
        'Zend Framework',
        'Laravel',
        'Node.js',
        'React',
        'Next.js',
        'TypeScript',
        'MySQL',
        'PostgreSQL',
        'Redis',
        'Microservices Architecture',
        'Docker & DevOps',
        'RESTful API Engineering',
        'Cloud Infrastructure',
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="antialiased min-h-screen relative selection:bg-blue-600/30 selection:text-white"
      >
        {children}
      </body>
    </html>
  );
}
