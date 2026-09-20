'use client';

import { useState } from 'react';
import Image from 'next/image';
import FloatingPanel from '@/components/hud/FloatingPanel';
import { profileData } from '@/data/profile';
import { ArrowRight, Download, Award, ShieldCheck, Star, Sparkles, Camera } from 'lucide-react';
import { useSceneStore } from '@/store/useSceneStore';
import { soundFX } from '@/lib/sound';

const HERO_PERSPECTIVES = [
  {
    id: 'executive',
    label: 'Executive',
    badge: 'ZCE 7.1',
    src: '/images/asif-abir-executive.png',
    title: 'Zend Certified PHP Engineer',
    metric: '100% JSS · 37+ Contracts',
  },
  {
    id: 'architect',
    label: 'Architect',
    badge: '14+ YRS',
    src: '/images/asif-abir-architect.jpg',
    title: 'Lead Software Architect',
    metric: 'Enterprise Cloud & ERP',
  },
  {
    id: 'outdoor',
    label: 'Explorer',
    badge: 'GLOBAL',
    src: '/images/asif-abir-outdoor.jpg',
    title: 'System Builder & Explorer',
    metric: 'Scalable Microservices',
  },
  {
    id: 'focus',
    label: 'Focus',
    badge: 'AI CORE',
    src: '/images/asif-abir-selfie.jpg',
    title: 'AI & Next-Gen Innovator',
    metric: 'Autonomous Workflows',
  },
  {
    id: 'candid',
    label: 'Mentor',
    badge: 'COMMUNITY',
    src: '/images/asif-abir-candid.jpg',
    title: 'Tech Lead & Mentor',
    metric: 'Engineering Excellence',
  },
];

export default function BridgeHero() {
  const setSection = useSceneStore((state) => state.setSection);
  const [photoIndex, setPhotoIndex] = useState(0);
  const currentPhoto = HERO_PERSPECTIVES[photoIndex];

  const handleJump = (id: 'portfolio' | 'contact') => {
    soundFX.playButtonClick();
    setSection(id);
  };

  const handleSelectPhoto = (idx: number) => {
    soundFX.playButtonClick();
    setPhotoIndex(idx);
  };

  return (
    <FloatingPanel
      sectionId="bridge"
      sectorCode="ORBIT-00"
      sectorName="CENTRAL // COMMAND"
      badge="LIVE ORBIT"
      maxWidth="max-w-6xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Editorial Text Column */}
        <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
          {/* Top Status Tag */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-medium shadow-[0_0_15px_rgba(56,189,248,0.15)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Zend Certified Engineer · Upwork Top Rated (100% JSS)</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-1.5">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
              <span className="block text-gradient-cyan">Asif Abir</span>
            </h1>
            <p className="text-base sm:text-xl font-light text-gray-200 tracking-wide font-sans">
              Zend Certified PHP Engineer <span className="text-cyan-400">&</span> Full-Stack Architect
            </p>
          </div>

          {/* Subtitle / Value proposition */}
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
            14+ years engineering resilient, high-availability enterprise web architectures, 
            university ERP systems at Daffodil Group, and mission-critical cloud platforms for global founders.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-2.5 px-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl max-w-xl mx-auto lg:mx-0 font-mono shadow-xl">
            {profileData.stats.map((stat, idx) => (
              <div key={idx} className="space-y-0.5 text-center lg:text-left">
                <div className="text-lg sm:text-xl font-black text-cyan-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]">
                  {stat.value}
                </div>
                <div className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
            <button
              onClick={() => handleJump('portfolio')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-black shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-all transform hover:-translate-y-0.5 cursor-pointer focus:outline-none"
            >
              <span>Explore 17 Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <a
              href="/images/CV of Asif Mohammadd Abir.pdf"
              download="CV of Asif Mohammadd Abir.pdf"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full font-mono text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/20 backdrop-blur-xl transition-all transform hover:-translate-y-0.5 focus:outline-none"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download CV</span>
            </a>

            <button
              onClick={() => handleJump('contact')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full font-mono text-xs font-medium text-cyan-300 hover:text-white transition-colors cursor-pointer focus:outline-none"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Direct Relay</span>
            </button>
          </div>
        </div>

        {/* Right Feature: Interactive 5-Perspective Portrait Card */}
        <div className="lg:col-span-5 flex flex-col items-center gap-3">
          <div className="relative w-60 sm:w-72 aspect-[4/5] rounded-3xl overflow-hidden glass-luxury p-2.5 group shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-cyan-500/30">
            {/* Hologram Scanner Effect */}
            <div className="hologram-scanner" />

            {/* Inner Portrait Container */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#0e1628] to-[#040711] border border-white/10">
              <Image
                key={currentPhoto.src}
                src={currentPhoto.src}
                alt={`Portrait of Asif Abir - ${currentPhoto.label}`}
                fill
                sizes="(max-width: 768px) 100vw, 360px"
                className="object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
                priority
              />
              {/* Radial gradient vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#040711] via-[#040711]/20 to-transparent opacity-90" />

              {/* Floating Verified Badges */}
              <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-2xl bg-[#070d1e]/90 backdrop-blur-2xl border border-white/15 space-y-1 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <Award className="w-3.5 h-3.5 text-amber-400 drop-shadow-[0_0_6px_#f59e0b] shrink-0" />
                    <span className="text-xs font-bold text-white tracking-wide truncate">
                      {currentPhoto.title}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/30 shrink-0">
                    {currentPhoto.badge}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-emerald-400 font-medium">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                    <span>Verified Profile</span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-white">
                    {currentPhoto.metric}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 5-Photo Switcher Bar */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl font-mono text-[10px]">
            <span className="px-2 py-0.5 text-gray-400 flex items-center gap-1">
              <Camera className="w-3 h-3 text-cyan-400" />
              <span>VIEWS:</span>
            </span>
            {HERO_PERSPECTIVES.map((p, idx) => {
              const active = idx === photoIndex;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPhoto(idx)}
                  className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                    active
                      ? 'bg-cyan-500/25 border border-cyan-400/50 text-cyan-300 font-bold shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                  title={p.title}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </FloatingPanel>
  );
}
