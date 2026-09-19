'use client';

import Image from 'next/image';
import FloatingPanel from '@/components/hud/FloatingPanel';
import { profileData } from '@/data/profile';
import { CheckCircle2, User } from 'lucide-react';

export default function AboutSection() {
  return (
    <FloatingPanel
      sectionId="about"
      sectorCode="BIO-02"
      sectorName="PILOT PROFILE // DOSSIER"
      badge="LEVEL-4 VERIFIED"
      maxWidth="max-w-5xl"
    >
      <div className="space-y-8">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white/[0.03] p-6 rounded-2xl border border-white/10">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-cyan-500/50 shrink-0 shadow-lg shadow-cyan-950/50">
            <Image
              src={profileData.avatarUrl}
              alt={`Portrait photo of ${profileData.name}, Zend Certified PHP Engineer`}
              fill
              sizes="128px"
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-semibold">
              <User className="w-3.5 h-3.5" />
              <span>CALLSIGN: {profileData.callsign}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {profileData.name}
            </h2>
            <div className="text-sm font-semibold text-cyan-300">
              {profileData.title}
            </div>
            <p className="text-xs text-gray-300 font-mono">
              {profileData.role} @ {profileData.organization} · {profileData.location}
            </p>
          </div>
        </div>

        {/* Quick-Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-center">
            <div className="text-2xl sm:text-3xl font-black text-cyan-400">
              14+
            </div>
            <div className="text-xs text-gray-200 mt-1 uppercase font-bold">
              Years Experience
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-center">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
              100%
            </div>
            <div className="text-xs text-gray-200 mt-1 uppercase font-bold">
              Upwork JSS
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-center">
            <div className="text-2xl sm:text-3xl font-black text-cyan-300">
              37+
            </div>
            <div className="text-xs text-gray-200 mt-1 uppercase font-bold">
              Projects Done
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.04] border border-amber-500/40 text-center relative overflow-hidden">
            <div className="text-lg sm:text-xl font-black text-amber-400">
              ZCE 7.1
            </div>
            <div className="text-xs text-amber-300 mt-1 uppercase font-bold">
              Zend Certified
            </div>
            <span className="absolute top-1 right-1 text-[8px] px-1 rounded bg-amber-500/20 text-amber-300 font-mono">
              GOLD
            </span>
          </div>
        </div>

        {/* Full Bio Paragraphs */}
        <div className="space-y-4 text-gray-200 text-sm sm:text-base leading-relaxed bg-black/40 p-6 rounded-2xl border border-white/10">
          <div className="text-xs uppercase font-mono font-bold tracking-widest text-cyan-400 mb-2">
            Operational Biography & Directive
          </div>
          {profileData.bio.map((paragraph, idx) => (
            <p key={idx} className="text-gray-200">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Core Architectural Capabilities */}
        <div className="space-y-3">
          <div className="text-xs uppercase font-mono font-bold tracking-widest text-gray-300">
            Core Engineering Tenets
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            {[
              'PSR Coding Standards & Clean OOP Architecture',
              'Enterprise Laravel 10+ & Complex Relational Schema',
              'Reactive Next.js 15/16 App Router Interfaces',
              'Sub-100ms Database Query Optimization & Redis Caching',
              'Automated GitHub Actions CI/CD Deployment Pipelines',
              'Top Rated Upwork Excellence Across 37+ Global Contracts',
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/10 text-gray-200"
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
