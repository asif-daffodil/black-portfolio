'use client';

import Image from 'next/image';
import FloatingPanel from '@/components/hud/FloatingPanel';
import { profileData } from '@/data/profile';
import { ArrowRight, Download, Award, ShieldCheck, Star, Sparkles } from 'lucide-react';
import { useSceneStore } from '@/store/useSceneStore';
import { soundFX } from '@/lib/sound';

export default function BridgeHero() {
  const setSection = useSceneStore((state) => state.setSection);

  const handleJump = (id: 'portfolio' | 'contact') => {
    soundFX.playButtonClick();
    setSection(id);
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

        {/* Right Feature: New Executive Studio Portrait Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-60 sm:w-72 aspect-[4/5] rounded-3xl overflow-hidden glass-luxury p-2.5 group shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-cyan-500/30">
            {/* Hologram Scanner Effect */}
            <div className="hologram-scanner" />

            {/* Inner Portrait Container */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#0e1628] to-[#040711] border border-white/10">
              <Image
                src="/images/asif-abir-executive.png"
                alt="Portrait of Asif Abir, Zend Certified PHP Engineer"
                fill
                sizes="(max-width: 768px) 100vw, 360px"
                className="object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
                priority
              />
              {/* Radial gradient vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#040711] via-[#040711]/20 to-transparent opacity-90" />

              {/* Floating Verified Badges */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 p-3 rounded-2xl bg-[#070d1e]/90 backdrop-blur-2xl border border-white/15 space-y-1.5 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400 drop-shadow-[0_0_6px_#f59e0b]" />
                    <span className="text-xs font-bold text-white tracking-wide">
                      Zend Certified PHP Engineer
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/30">
                    ZCE 7.1
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-emerald-400 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                    <span>Upwork Top Rated</span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-white">
                    100% JSS · 37+ Contracts
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FloatingPanel>
  );
}
