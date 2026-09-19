'use client';

import Image from 'next/image';
import FloatingPanel from '@/components/hud/FloatingPanel';
import { profileData } from '@/data/profile';
import { ArrowRight, Download, Award, ShieldCheck, Briefcase } from 'lucide-react';
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
      sectorCode="NAV-01"
      sectorName="BRIDGE // FLIGHT READY"
      badge="SYSTEMS OPTIMAL"
      maxWidth="max-w-6xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Main Hero DOM Text Content */}
        <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 text-xs sm:text-sm font-mono font-medium">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Zend Certified Engineer · Upwork Top Rated (100% JSS)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Hi, I&apos;m{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300">
              {profileData.name}
            </span>
          </h1>

          <p className="text-base sm:text-xl font-semibold text-gray-100">
            {profileData.title}
          </p>

          <p className="text-sm sm:text-base text-gray-200 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            {profileData.tagline}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md max-w-xl mx-auto lg:mx-0 font-mono">
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
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-1">
            <button
              onClick={() => handleJump('portfolio')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
            >
              <span>Explore Star Charts</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="/images/CV of Asif Mohammadd Abir.pdf"
              download
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-md transition-all transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              aria-label="Download CV in PDF format"
            >
              <Download className="w-4 h-4" />
              <span>Download CV</span>
            </a>

            <button
              onClick={() => handleJump('contact')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-cyan-300 hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
            >
              <span>Hailing Frequencies</span>
            </button>
          </div>
        </div>

        {/* Profile Visual Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-64 sm:w-76 aspect-[4/5] rounded-3xl overflow-hidden glass-panel p-2.5 group shadow-2xl border border-cyan-500/25">
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10">
              <Image
                src="/images/asif.jpg"
                alt="Portrait photo of Asif Abir, Senior Full-Stack Engineer and Zend Certified Engineer"
                fill
                sizes="(max-width: 768px) 100vw, 360px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070c] via-transparent to-transparent opacity-85" />

              {/* Floating Badges */}
              <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-[#0b0f1a]/95 backdrop-blur-md border border-white/15 space-y-0.5">
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-bold text-white">
                    Zend Certified Engineer
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                  <Briefcase className="w-3 h-3" />
                  <span>Upwork Top Rated (100% JSS)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FloatingPanel>
  );
}
