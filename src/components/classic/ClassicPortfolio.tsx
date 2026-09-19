'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { profileData } from '@/data/profile';
import { skillsData } from '@/data/skills';
import { experienceData } from '@/data/experience';
import { educationData } from '@/data/education';
import { certificationsData } from '@/data/certifications';
import { aiFocusAreas, aiCodeSnippet } from '@/data/ai';
import { portfolioProjects, ProjectItem } from '@/data/portfolio';
import { contactData } from '@/data/contact';
import { soundFX } from '@/lib/sound';
import {
  ShieldCheck,
  Award,
  Download,
  ArrowRight,
  GraduationCap,
  Calendar,
  MapPin,
  ExternalLink,
  Code2,
  Copy,
  Check,
  Bot,
  Cpu,
  Database,
  Zap,
  Radio,
  Globe,
  X,
  Send,
  CheckCircle2,
  Rocket,
  CheckCircle,
  Briefcase,
  Signal,
  RadioReceiver,
} from 'lucide-react';
import { LinkedInIcon, GitHubIcon, FacebookIcon } from '@/components/icons/SocialIcons';

const CHANNEL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  MapPin,
  Mail: Signal,
  Phone: Radio,
  Globe,
  Briefcase,
};

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LinkedIn: LinkedInIcon,
  GitHub: GitHubIcon,
  Facebook: FacebookIcon,
  Upwork: Briefcase,
};

export default function ClassicPortfolio() {
  const [eduTab, setEduTab] = useState<'degrees' | 'certifications'>('degrees');
  const [portfolioCategory, setPortfolioCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [transmitting, setTransmitting] = useState(false);

  const categories = ['All', 'Media', 'EdTech', 'eCommerce', 'Enterprise', 'SaaS'];

  const filteredProjects = portfolioProjects.filter((p) => {
    if (portfolioCategory === 'All') return true;
    return p.category.toLowerCase() === portfolioCategory.toLowerCase();
  });

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(aiCodeSnippet.code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playButtonClick();
    setTransmitting(true);
    setTimeout(() => {
      setTransmitting(false);
      setFormSubmitted(true);
      setFormState({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormSubmitted(false), 5000);
    }, 600);
  };

  const getFocusIcon = (code: string) => {
    switch (code) {
      case 'AI-CORE-01':
        return Zap;
      case 'AI-CORE-02':
        return Bot;
      case 'AI-CORE-03':
        return Database;
      case 'AI-CORE-04':
        return Cpu;
      default:
        return Bot;
    }
  };

  return (
    <div className="min-h-screen bg-[#05070c] text-gray-100 selection:bg-cyan-500/30 selection:text-white">
      {/* 1. Classic Hero Section */}
      <section
        id="bridge"
        aria-label="Overview & Introduction"
        className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 border-b border-white/10"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 text-xs sm:text-sm font-mono font-bold">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Zend Certified PHP Engineer · Upwork Top Rated (100% JSS)</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Hi, I&apos;m{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300">
                {profileData.name}
              </span>
            </h1>

            <p className="text-lg sm:text-xl font-semibold text-cyan-100">
              {profileData.title}
            </p>

            <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {profileData.tagline}
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3.5 px-4 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md max-w-xl mx-auto lg:mx-0 font-mono">
              {profileData.stats.map((stat, idx) => (
                <div key={idx} className="space-y-0.5 text-center lg:text-left">
                  <div className="text-lg sm:text-xl font-black text-cyan-400">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#portfolio"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              >
                <span>View 17 Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="/images/CV of Asif Mohammadd Abir.pdf"
                download
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono font-semibold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              >
                <Download className="w-4 h-4" />
                <span>Download CV (PDF)</span>
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-mono font-medium text-sm text-cyan-300 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              >
                <span>Direct Contact</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-64 sm:w-80 aspect-[4/5] rounded-3xl overflow-hidden glass-panel p-3 shadow-2xl border border-cyan-500/30">
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src="/images/asif.jpg"
                  alt="Portrait photo of Asif Abir, Senior Full-Stack Engineer and Zend Certified Engineer"
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070c] via-transparent to-transparent opacity-85" />
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-[#0b0f1a]/95 backdrop-blur-md border border-white/15 space-y-1">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">
                      Zend Certified PHP Engineer
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Upwork Top Rated (100% JSS)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Classic About Section */}
      <section
        id="about"
        aria-label="About and Biography"
        className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10"
      >
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
              // Dossier & Background
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              About Asif Abir
            </h2>
            <p className="text-sm font-medium text-cyan-300 mt-1">
              Senior Web Developer @ Daffodil Group · Lead Architect @ CodersFly
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-black/40 border border-white/10">
              <div className="text-2xl font-mono font-black text-cyan-400">14+</div>
              <div className="text-xs font-mono text-gray-200 mt-1 font-bold">Years Experience</div>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10">
              <div className="text-2xl font-mono font-black text-emerald-400">100%</div>
              <div className="text-xs font-mono text-gray-200 mt-1 font-bold">Upwork JSS</div>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10">
              <div className="text-2xl font-mono font-black text-cyan-300">37+</div>
              <div className="text-xs font-mono text-gray-200 mt-1 font-bold">Projects Done</div>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-amber-500/40">
              <div className="text-2xl font-mono font-black text-amber-400">ZCE 7.1</div>
              <div className="text-xs font-mono text-amber-300 mt-1 font-bold">Zend Certified</div>
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-gray-200 leading-relaxed font-sans">
            {profileData.bio.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Classic Skills Section */}
      <section
        id="skills"
        aria-label="Core Engineering Skills"
        className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10"
      >
        <div className="max-w-5xl mx-auto space-y-10">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
              // Systems Telemetry
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Core Technical Proficiencies
            </h2>
            <p className="text-sm text-gray-300 mt-1">
              Engineered for enterprise scale, zero downtime, and high throughput.
            </p>
          </div>

          {/* Power Conduit Meters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {skillsData.conduits.map((conduit) => {
              const activeSegments = Math.round((conduit.level / 100) * 12);
              return (
                <div
                  key={conduit.id}
                  className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white">{conduit.name}</span>
                    <span className="text-cyan-300 font-bold">{conduit.level}% OPTIMAL</span>
                  </div>

                  {/* Segmented meter blocks */}
                  <div className="flex items-center gap-1.5 h-4 w-full bg-black/80 rounded-md p-1 border border-white/10">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-full flex-1 rounded-xs transition-colors ${
                          i < activeSegments ? 'bg-cyan-400 shadow-sm shadow-cyan-400/50' : 'bg-gray-800'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="text-[11px] font-mono text-gray-300">
                    STATUS: {conduit.status} // LOAD: {conduit.level}%
                  </div>
                </div>
              );
            })}
          </div>

          {/* Categorized Tag Lists */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {skillsData.categories.map((cat, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
                <h3 className="text-xs font-mono font-bold text-cyan-300 uppercase">
                  {cat.title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 border border-white/10 text-gray-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Classic Experience Section */}
      <section
        id="experience"
        aria-label="Career Flight Log & Experience"
        className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10"
      >
        <div className="max-w-5xl mx-auto space-y-10">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
              // Mission History
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Operational Career Flight Log
            </h2>
            <p className="text-sm text-gray-300 mt-1">
              Reverse chronological career trajectory across enterprises, agencies, and ventures.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative border-l-2 border-cyan-500/30 ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8">
            {experienceData.map((log) => (
              <div key={log.id} className="relative group">
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#05070c] border-2 border-cyan-400 flex items-center justify-center">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      log.isCurrent ? 'bg-cyan-400 animate-ping' : 'bg-gray-500'
                    }`}
                  />
                </div>

                <div className="glass-panel p-6 sm:p-7 rounded-2xl space-y-4 border border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-3">
                      {log.logoUrl && (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/5 border border-white/10 shrink-0 p-1">
                          <Image
                            src={log.logoUrl}
                            alt={`Logo of ${log.organization}`}
                            fill
                            sizes="40px"
                            className="object-contain p-1"
                          />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 font-mono text-[10px] text-cyan-400">
                          <Rocket className="w-3 h-3" />
                          <span>{log.missionCode}</span>
                          <span>·</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {log.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mt-0.5">{log.role}</h3>
                        <div className="text-sm font-semibold text-cyan-300">{log.organization}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-gray-200">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 border border-white/10">
                        <Calendar className="w-3 h-3 text-cyan-400" />
                        <span>{log.period}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 border border-white/10">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        <span>{log.location}</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-200 leading-relaxed">{log.summary}</p>

                  <div className="space-y-1.5 font-mono text-xs text-gray-200">
                    <span className="text-[10px] uppercase font-bold text-gray-300 tracking-wider">
                      Directives & Key Deliverables:
                    </span>
                    <ul className="space-y-1.5">
                      {log.directives.map((dir, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{dir}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                    {log.techStack.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 border border-cyan-500/20 text-cyan-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Classic Education & Certifications Section */}
      <section
        id="education"
        aria-label="Education & Certifications"
        className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10"
      >
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                // Credentials & Degrees
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                Education & Accreditations
              </h2>
            </div>

            <div className="flex items-center gap-2 p-1 bg-black/60 border border-white/10 rounded-xl">
              <button
                type="button"
                onClick={() => setEduTab('degrees')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                  eduTab === 'degrees'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Degrees ({educationData.length})
              </button>
              <button
                type="button"
                onClick={() => setEduTab('certifications')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                  eduTab === 'certifications'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Certifications ({certificationsData.length})
              </button>
            </div>
          </div>

          {eduTab === 'degrees' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {educationData.map((deg) => (
                <div
                  key={deg.id}
                  className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 p-1 flex items-center justify-center">
                        {deg.logoUrl ? (
                          <Image
                            src={deg.logoUrl}
                            alt={`Emblem of ${deg.institution}`}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        ) : (
                          <GraduationCap className="w-6 h-6 text-cyan-400" />
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-cyan-300 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                        {deg.period}
                      </span>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono text-cyan-400 uppercase">
                        {deg.archiveCode} // {deg.major}
                      </div>
                      <h3 className="text-base font-bold text-white mt-0.5">{deg.degree}</h3>
                      <div className="text-xs text-amber-300 font-medium mt-1">{deg.institution}</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono">
                      <span className="text-gray-300 font-medium">GRADE / GPA</span>
                      <span className="text-cyan-400 font-bold">{deg.gpa} / {deg.gpaScale}</span>
                    </div>

                    <p className="text-xs text-gray-200 leading-relaxed">{deg.summary}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-300 pt-3 border-t border-white/10 font-mono">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      {deg.location}
                    </span>
                    <span>Class of {deg.passingYear}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {eduTab === 'certifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificationsData.map((cert) => (
                <div
                  key={cert.id}
                  className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                        {cert.code}
                      </span>
                      <span className="text-[10px] font-mono text-gray-300 font-medium">{cert.issueDate}</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0 p-1 flex items-center justify-center">
                        {cert.badgeImageUrl ? (
                          <Image
                            src={cert.badgeImageUrl}
                            alt={`Accreditation badge for ${cert.title}`}
                            width={36}
                            height={36}
                            className="object-contain"
                          />
                        ) : (
                          <Award className="w-5 h-5 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-snug">{cert.title}</h4>
                        <p className="text-xs text-amber-300 mt-0.5 font-medium">{cert.issuer}</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-200 leading-relaxed line-clamp-3">{cert.summary}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-3 border-t border-white/10 font-mono">
                    <span className="text-[11px] text-gray-300 truncate max-w-[170px]">
                      ID: <span className="text-white font-bold">{cert.credentialId || 'Verified'}</span>
                    </span>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded"
                        aria-label={`Verify credential for ${cert.title}`}
                      >
                        <span>Verify</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Classic AI Work Section */}
      <section
        id="ai"
        aria-label="AI Engineering & Autonomous Workflows"
        className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10"
      >
        <div className="max-w-5xl mx-auto space-y-10">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
              // Neural Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              AI Integration & Agentic Systems
            </h2>
            <p className="text-sm text-gray-300 mt-1">
              Production LLM pipelines, autonomous tool-use agents, RAG vector retrieval, and resilient APIs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {aiFocusAreas.map((area) => {
              const Icon = getFocusIcon(area.code);
              return (
                <div
                  key={area.id}
                  className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-cyan-300 uppercase">
                      {area.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{area.title}</h3>
                  <p className="text-xs text-gray-200 leading-relaxed">{area.summary}</p>

                  <ul className="space-y-1 pt-1 font-sans">
                    {area.highlights.map((hl, hIdx) => (
                      <li key={hIdx} className="text-xs text-gray-300 flex items-start gap-1.5">
                        <span className="text-cyan-400">•</span>
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/10">
                    {area.tech.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 border border-cyan-500/20 text-cyan-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Code Snippet */}
          <div className="glass-panel rounded-2xl border border-cyan-500/30 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 bg-black/70 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono text-gray-200">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>{aiCodeSnippet.filename}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-200 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              >
                {codeCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-gray-300" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 sm:p-5 bg-black/90 font-mono text-xs overflow-x-auto text-gray-200 max-h-[350px] leading-relaxed">
              <pre>
                <code>{aiCodeSnippet.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Classic Portfolio Section */}
      <section
        id="portfolio"
        aria-label="Portfolio and Completed Projects"
        className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10"
      >
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                // System Deployments
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                Featured Projects & Portals (17)
              </h2>
              <p className="text-sm text-gray-300 mt-1">
                National newspapers, institutional ERPs, eCommerce brands, and SaaS tools.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-black/40 border border-white/10 rounded-xl">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setPortfolioCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                    portfolioCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="glass-panel rounded-2xl overflow-hidden cursor-pointer hover:border-cyan-500/50 transition-all flex flex-col justify-between group border border-white/10"
              >
                <div>
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-black/50">
                    <Image
                      src={project.imageUrl}
                      alt={`Screenshot of ${project.title}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                      {project.beaconCode}
                    </div>
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 border border-white/10 text-[10px] font-mono text-gray-200 uppercase font-bold">
                      {project.category}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-200 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-gray-200 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-gray-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded"
                    aria-label={`Visit live site for ${project.title}`}
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Project Modal */}
        {selectedProject && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="glass-panel border border-cyan-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                aria-label="Close project modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300">
                  {selectedProject.beaconCode}
                </span>
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-gray-200 uppercase font-bold">
                  {selectedProject.category}
                </span>
              </div>

              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/10 bg-black">
                <Image
                  src={selectedProject.imageUrl}
                  alt={`Screenshot preview of ${selectedProject.title}`}
                  fill
                  className="object-cover object-top"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {selectedProject.title}
                </h3>
                <p className="text-sm text-gray-200 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono text-gray-300 uppercase font-bold">Technology Stack:</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-cyan-500/10 border border-cyan-500/20 text-cyan-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-mono transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                >
                  Close
                </button>
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs sm:text-sm font-mono focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                >
                  <Globe className="w-4 h-4" />
                  <span>Visit Live Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 8. Classic Contact Section */}
      <section
        id="contact"
        aria-label="Direct Contact & Channels"
        className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10"
      >
        <div className="max-w-5xl mx-auto space-y-10">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
              // Comms Console
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              {contactData.title}
            </h2>
            <p className="text-sm text-gray-300 mt-1">
              {contactData.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Contact Telemetry
                </div>

                <div className="space-y-3">
                  {contactData.frequencies.map((channel, idx) => {
                    const Icon = CHANNEL_ICONS[channel.icon] || MapPin;
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-start gap-3"
                      >
                        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-mono text-gray-300 uppercase font-medium">
                            {channel.label}
                          </div>
                          {channel.href ? (
                            <a
                              href={channel.href}
                              className="text-xs font-medium text-white hover:text-cyan-300 transition-colors truncate block mt-0.5 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded"
                            >
                              {channel.value}
                            </a>
                          ) : (
                            <p className="text-xs font-medium text-white truncate mt-0.5">
                              {channel.value}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-white/10 space-y-2">
                  <span className="text-xs font-mono text-gray-300 uppercase block font-bold">
                    Social Channels
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {contactData.socialFrequencies.map((social, idx) => {
                      const Icon = SOCIAL_ICONS[social.platform] || Globe;
                      return (
                        <a
                          key={idx}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-black/40 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/40 text-gray-200 hover:text-white transition-all flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                          aria-label={`Connect with Asif Abir via ${social.platform}`}
                        >
                          <Icon className="w-4 h-4 text-cyan-400" />
                          <span className="text-xs font-bold">{social.platform}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <RadioReceiver className="w-5 h-5 text-cyan-400" />
                  Direct Communication Terminal
                </h3>

                <form onSubmit={handleContactSubmit} className="space-y-4 font-mono">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="classic-name" className="text-xs text-cyan-300 font-bold">
                        Name
                      </label>
                      <input
                        type="text"
                        id="classic-name"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="Your Name"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-gray-500 text-xs focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="classic-email" className="text-xs text-cyan-300 font-bold">
                        Email
                      </label>
                      <input
                        type="email"
                        id="classic-email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="you@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-gray-500 text-xs focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="classic-subject" className="text-xs text-cyan-300 font-bold">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="classic-subject"
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      placeholder="Project Inquiry..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-gray-500 text-xs focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="classic-message" className="text-xs text-cyan-300 font-bold">
                      Message
                    </label>
                    <textarea
                      id="classic-message"
                      required
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Describe your requirements..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-gray-500 text-xs focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={transmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-lg transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none cursor-pointer disabled:opacity-50"
                  >
                    <Send className={`w-3.5 h-3.5 ${transmitting ? 'animate-spin' : ''}`} />
                    <span>{transmitting ? 'Sending...' : 'Send Message'}</span>
                  </button>

                  {formSubmitted && (
                    <div
                      role="alert"
                      className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Message received successfully. I will be in touch shortly!</span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Classic Accessible Footer */}
      <footer className="py-12 px-4 border-t border-white/10 text-center font-mono text-xs text-gray-300 space-y-2">
        <div>
          &copy; {new Date().getFullYear()} {profileData.name}. All rights reserved.
        </div>
        <div className="text-xs text-gray-300">
          Zend Certified Engineer · Upwork Top Rated · Fast Accessible Classic View
        </div>
      </footer>
    </div>
  );
}
