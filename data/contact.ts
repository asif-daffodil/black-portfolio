export interface CommsFrequency {
  label: string;
  value: string;
  href?: string;
  callsign: string;
  icon: string;
}

export interface SocialFrequency {
  platform: string;
  url: string;
  frequencyCode: string;
  callsign: string;
}

export interface ContactData {
  title: string;
  subtitle: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  upworkProfile: string;
  frequencies: CommsFrequency[];
  socialFrequencies: SocialFrequency[];
}

export const contactData: ContactData = {
  title: 'Hailing Frequencies Open',
  subtitle: 'Initiate subspace transmission for enterprise consulting, high-availability architecture inquiries, or contract software engineering.',
  address: '9 Sher-E-Bangla Road, Hazaribagh, Dhaka-1209, Bangladesh',
  email: 'asif.abir@hotmail.com',
  phone: '+880 1955 517 560',
  website: 'https://asif.com.bd',
  upworkProfile: 'https://www.upwork.com/freelancers/laravelasif',
  frequencies: [
    {
      label: 'HQ Coordinates',
      value: '9 Sher-E-Bangla Road, Hazaribagh, Dhaka-1209, Bangladesh',
      callsign: 'LOC-BD-01',
      icon: 'MapPin',
    },
    {
      label: 'Direct Frequency (Email)',
      value: 'asif.abir@hotmail.com',
      href: 'mailto:asif.abir@hotmail.com',
      callsign: 'SUB-MAIL-01',
      icon: 'Mail',
    },
    {
      label: 'Secure Voice Comms (Phone)',
      value: '+880 1955 517 560',
      href: 'tel:+8801955517560',
      callsign: 'TEL-VOICE-02',
      icon: 'Phone',
    },
    {
      label: 'Official Flagship (Website)',
      value: 'asif.com.bd',
      href: 'https://asif.com.bd',
      callsign: 'WEB-PORTAL-03',
      icon: 'Globe',
    },
    {
      label: 'Upwork Frequency (Top Rated)',
      value: '100% JSS · 37+ Completed Contracts',
      href: 'https://www.upwork.com/freelancers/laravelasif',
      callsign: 'UPW-TOP-04',
      icon: 'Briefcase',
    },
  ],
  socialFrequencies: [
    {
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/in/asif-abir-5a5a5927b/',
      frequencyCode: '142.85 MHz',
      callsign: 'LINKEDIN',
    },
    {
      platform: 'GitHub',
      url: 'https://github.com/asif-daffodil/',
      frequencyCode: '144.20 MHz',
      callsign: 'GITHUB',
    },
    {
      platform: 'Upwork',
      url: 'https://www.upwork.com/freelancers/laravelasif',
      frequencyCode: '146.52 MHz',
      callsign: 'UPWORK',
    },
    {
      platform: 'Facebook',
      url: 'https://www.facebook.com/abir.upwork',
      frequencyCode: '148.10 MHz',
      callsign: 'FACEBOOK',
    },
  ],
};
