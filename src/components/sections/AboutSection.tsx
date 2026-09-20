'use client';

import { useState } from 'react';
import Image from 'next/image';
import FloatingPanel from '@/components/hud/FloatingPanel';
import { profileData } from '@/data/profile';
import { CheckCircle2, Award, Briefcase, MapPin, Building, Sparkles, Camera } from 'lucide-react';
import { soundFX } from '@/lib/sound';

const ABOUT_PERSPECTIVES = [
  {
    id: 'executive',
    src: '/images/asif-abir-executive.png',
    title: 'Enterprise Architecture',
    badge: 'ZCE 7.1 GOLD',
    role: 'Lead Architect & Certified Engineer',
    desc: 'Specializing in resilient enterprise backends, university ERPs, and high-concurrency microservices.',
  },
  {
    id: 'architect',
    src: '/images/asif-abir-architect.jpg',
    title: 'System Design & Leadership',
    badge: 'DAFFODIL GROUP',
    role: 'Senior Web Developer',
    desc: 'Directing university web architecture, high-throughput digital admissions, and scalable portal infrastructure.',
  },
  {
    id: 'outdoor',
    src: '/images/asif-abir-outdoor.jpg',
    title: 'Global Perspective',
    badge: 'EXPLORER',
    role: 'Life, Nature & Balance',
    desc: 'Drawing inspiration from outdoor exploration and global perspective to engineer systems that stand the test of time.',
  },
  {
    id: 'focus',
    src: '/images/asif-abir-selfie.jpg',
    title: 'AI & Next-Gen Systems',
    badge: 'INNOVATION',
    role: 'Agentic & Autonomous Tech',
    desc: 'Deploying autonomous AI agents, fine-tuned LLM tools, and high-performance modern reactive interfaces.',
  },
  {
    id: 'candid',
    src: '/images/asif-abir-candid.jpg',
    title: 'Community & Mentorship',
    badge: 'COMMUNITY',
    role: 'Tech Consultant & Mentor',
    desc: 'Empowering future engineers, leading code audits, and fostering engineering excellence across tech ecosystems.',
  },
];

export default function AboutSection() {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const activePhoto = ABOUT_PERSPECTIVES[activePhotoIdx];

  const handleSelectPhoto = (idx: number) => {
    soundFX.playButtonClick();
    setActivePhotoIdx(idx);
  };

  return (
    <FloatingPanel
      sectionId="about"
      sectorCode="ORIGIN-01"
      sectorName="BIOGRAPHY // ARCHITECT DOSSIER"
      badge="VERIFIED CREDENTIALS"
      maxWidth="max-w-6xl"
    >
      <div className="space-y-8">
        {/* Top Feature: Interactive Focus Portrait + Executive Dossier Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Selected Photo Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden glass-luxury border border-cyan-500/30 group shadow-2xl p-2.5">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#0e1628] to-[#040711]">
                <Image
                  key={activePhoto.src}
                  src={activePhoto.src}
                  alt={`Asif Abir - ${activePhoto.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#040711] via-[#040711]/20 to-transparent opacity-90" />
                
                {/* Overlay Badge */}
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-2xl bg-[#070d1e]/90 backdrop-blur-2xl border border-white/15">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white tracking-wide truncate">
                      {activePhoto.title}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                      {activePhoto.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-300 mt-1 font-sans line-clamp-2">
                    {activePhoto.desc}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Executive Dossier Header */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ZCE LICENSED · ZEND029749</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Engineering Resilient Platforms for <span className="text-gradient-cyan">Global Scale</span>
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-300">
              <span className="flex items-center gap-1 text-cyan-300">
                <Building className="w-3.5 h-3.5" />
                Senior Developer @ Daffodil Group
              </span>
              <span className="text-gray-600">·</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Briefcase className="w-3.5 h-3.5" />
                100% Upwork Success
              </span>
              <span className="text-gray-600">·</span>
              <span className="flex items-center gap-1 text-gray-400">
                <MapPin className="w-3.5 h-3.5" />
                Dhaka, Bangladesh
              </span>
            </div>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              With over 14 years of professional software architecture experience, I specialize in 
              high-throughput PHP/Laravel backends, reactive React & Next.js user interfaces, and 
              AI-driven autonomous workflows that power enterprise portals and SaaS applications.
            </p>

            <div className="pt-2">
              <div className="text-xs uppercase font-mono font-bold tracking-wider text-gray-400 mb-2.5 flex items-center gap-2">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span>SELECT PERSPECTIVE TO VIEW:</span>
              </div>
              <div className="flex flex-wrap gap-2 font-mono text-xs">
                {ABOUT_PERSPECTIVES.map((p, idx) => {
                  const active = idx === activePhotoIdx;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPhoto(idx)}
                      className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        active
                          ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300 font-bold shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                          : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      {p.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 5-Perspective Visual Gallery Grid (All 5 Photos Showcased) */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="text-xs uppercase font-mono font-bold tracking-widest text-cyan-400 flex items-center gap-2">
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full Visual Gallery // 5 Key Facets & Roles</span>
            </div>
            <span className="text-[10px] font-mono text-gray-500">CLICK ANY CARD TO INSPECT</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {ABOUT_PERSPECTIVES.map((p, idx) => {
              const isSelected = idx === activePhotoIdx;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPhoto(idx)}
                  className={`group relative rounded-2xl overflow-hidden glass-luxury border transition-all cursor-pointer flex flex-col p-2 ${
                    isSelected
                      ? 'border-cyan-400/70 shadow-[0_0_20px_rgba(56,189,248,0.3)] ring-1 ring-cyan-400/50'
                      : 'border-white/10 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-black/40">
                    <Image
                      src={p.src}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 200px"
                      className="object-cover object-top group-hover:scale-108 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute top-2 right-2 text-[9px] font-mono font-bold bg-black/70 text-cyan-300 px-1.5 py-0.5 rounded border border-white/10">
                      {p.badge}
                    </span>
                  </div>

                  <div className="p-2 space-y-1">
                    <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {p.title}
                    </h3>
                    <p className="text-[10px] text-gray-400 line-clamp-2 leading-tight">
                      {p.role}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* High-Impact Metric Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 font-mono">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center hover:border-cyan-500/30 transition-colors">
            <div className="text-2xl sm:text-3xl font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.3)]">
              14+
            </div>
            <div className="text-[11px] text-gray-300 mt-1 uppercase font-bold tracking-wider">
              Years Experience
            </div>
            <div className="text-[9px] text-gray-500 mt-0.5">Enterprise Software</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-emerald-500/20 text-center hover:border-emerald-500/40 transition-colors">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
              100%
            </div>
            <div className="text-[11px] text-emerald-300 mt-1 uppercase font-bold tracking-wider">
              Upwork JSS
            </div>
            <div className="text-[9px] text-gray-500 mt-0.5">Top Rated Status</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center hover:border-cyan-500/30 transition-colors">
            <div className="text-2xl sm:text-3xl font-black text-cyan-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.3)]">
              37+
            </div>
            <div className="text-[11px] text-gray-300 mt-1 uppercase font-bold tracking-wider">
              Contracts Delivered
            </div>
            <div className="text-[9px] text-gray-500 mt-0.5">Global Clients</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-amber-500/30 text-center relative overflow-hidden hover:border-amber-500/50 transition-colors">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">
              ZCE 7.1
            </div>
            <div className="text-[11px] text-amber-300 mt-1 uppercase font-bold tracking-wider">
              Zend Certified
            </div>
            <div className="text-[9px] text-amber-400/70 mt-0.5">Gold Standard</div>
          </div>
        </div>

        {/* Detailed Narrative & Core Philosophy */}
        <div className="space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed bg-[#060a16]/60 p-6 sm:p-7 rounded-2xl border border-white/10">
          <div className="text-xs uppercase font-mono font-bold tracking-widest text-cyan-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Architecture Philosophy & Executive Mission</span>
          </div>
          {profileData.bio.map((paragraph, idx) => (
            <p key={idx} className="text-gray-300 leading-relaxed font-light">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Core Engineering Tenets */}
        <div className="space-y-3.5">
          <div className="text-xs uppercase font-mono font-bold tracking-widest text-gray-400">
            Architectural Standards & Competencies
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            {[
              'PSR Standards & Robust OOP Microservice Architecture',
              'Enterprise Laravel 10/11 Relational Data Modeling',
              'Reactive Next.js App Router & Three.js 3D Web Experiences',
              'Sub-100ms SQL Optimization, Redis Caching, & Sharding',
              'Automated GitHub Actions CI/CD Deployment Pipelines',
              'Top Rated Freelance Architect with Flawless Client Reviews',
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-gray-200 hover:border-cyan-500/30 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FloatingPanel>
  );
}
