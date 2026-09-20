'use client';

import Image from 'next/image';
import FloatingPanel from '@/components/hud/FloatingPanel';
import { profileData } from '@/data/profile';
import { CheckCircle2, Award, Briefcase, MapPin, Building, Sparkles } from 'lucide-react';

export default function AboutSection() {
  return (
    <FloatingPanel
      sectionId="about"
      sectorCode="ORIGIN-01"
      sectorName="BIOGRAPHY // ARCHITECT DOSSIER"
      badge="VERIFIED CREDENTIALS"
      maxWidth="max-w-6xl"
    >
      <div className="space-y-8">
        {/* Top Dual-Portrait Showcase & Executive Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Dual Photo Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            {/* 1. Formal Executive Portrait */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glass-luxury border border-cyan-500/30 group shadow-xl">
              <Image
                src="/images/asif-abir-executive.png"
                alt="Asif Abir Zend Certified PHP Engineer"
                fill
                sizes="(max-width: 768px) 50vw, 240px"
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040711] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-center">
                <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase">
                  ZCE Engineer
                </span>
              </div>
            </div>

            {/* 2. Modern Architect Portrait */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glass-luxury border border-white/10 group shadow-xl">
              <Image
                src="/images/asif-abir-architect.jpg"
                alt="Asif Abir Lead Architect"
                fill
                sizes="(max-width: 768px) 50vw, 240px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040711] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-center">
                <span className="text-[10px] font-mono text-gray-300 font-bold uppercase">
                  Lead Architect
                </span>
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

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              With over 14 years of professional software architecture experience, I specialize in 
              high-throughput PHP/Laravel backends, reactive React & Next.js user interfaces, and 
              AI-driven autonomous workflows that power enterprise portals and SaaS applications.
            </p>
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
