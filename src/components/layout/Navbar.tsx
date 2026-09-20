'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSceneStore, SectionId } from '@/store/useSceneStore';
import { Download, Menu, X, Volume2, VolumeX } from 'lucide-react';
import { soundFX } from '@/lib/sound';

interface NavItem {
  id: SectionId;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'bridge', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'ai', label: 'AI Work' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'education', label: 'Credentials' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dhakaTime, setDhakaTime] = useState<string>('');

  const activeSection = useSceneStore((state) => state.activeSection);
  const setSection = useSceneStore((state) => state.setSection);
  const isMuted = useSceneStore((state) => state.isMuted);
  const toggleMute = useSceneStore((state) => state.toggleMute);

  // Live Dhaka local time clock
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Dhaka',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(now);
        setDhakaTime(formatted);
      } catch {
        // fallback
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: SectionId) => {
    soundFX.playButtonClick();
    setSection(id);
    setMobileMenuOpen(false);
  };

  const handleAudioToggle = () => {
    toggleMute();
    soundFX.playButtonClick();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#030712]/85 backdrop-blur-2xl border-b border-white/[0.08] shadow-2xl py-3'
          : 'bg-gradient-to-b from-[#030712]/80 to-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo & New Executive Avatar */}
        <button
          onClick={() => handleNavClick('bridge')}
          className="flex items-center gap-3.5 group cursor-pointer focus:outline-none text-left"
        >
          <div className="relative w-11 h-11 rounded-full p-[1.5px] bg-gradient-to-tr from-cyan-400 via-sky-300 to-indigo-500 shadow-[0_0_15px_rgba(56,189,248,0.35)] group-hover:shadow-[0_0_22px_rgba(56,189,248,0.6)] transition-all duration-300">
            <div className="relative w-full h-full rounded-full overflow-hidden bg-[#070b16]">
              <Image
                src="/images/asif-abir-executive.png"
                alt="Asif Abir Zend Certified PHP Engineer"
                fill
                sizes="44px"
                className="object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-500"
                priority
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                Asif Abir
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                ZCE 7.1
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400">
              <span className="text-cyan-400 font-medium">Senior Web Developer</span>
              <span className="hidden md:inline text-gray-600">·</span>
              <span className="hidden md:inline text-gray-400">Daffodil Group</span>
            </div>
          </div>
        </button>

        {/* Desktop Navigation Floating Pill */}
        <nav
          className="hidden lg:flex items-center gap-1 bg-[#070d1d]/75 backdrop-blur-xl px-2.5 py-1.5 rounded-full border border-white/10 shadow-xl shadow-black/40"
          aria-label="Primary Navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3.5 py-1.5 text-xs font-mono rounded-full transition-all duration-200 cursor-pointer focus:outline-none ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-500/20 border border-cyan-500/40 font-bold shadow-[inset_0_0_10px_rgba(56,189,248,0.25)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Utility Cluster: Dhaka Time, Sound Visualizer, Resume CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Live Local Time */}
          {dhakaTime && (
            <div className="hidden xl:flex flex-col items-end text-right pr-2">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">
                Dhaka (UTC+6)
              </span>
              <span className="text-xs font-mono font-medium text-cyan-300/90">
                {dhakaTime}
              </span>
            </div>
          )}

          {/* Synthesizer Audio Toggle */}
          <button
            onClick={handleAudioToggle}
            aria-label={isMuted ? 'Unmute ambient audio' : 'Mute ambient audio'}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-gray-300 hover:text-cyan-400 transition-colors focus:outline-none"
            title={isMuted ? 'Sound: Muted' : 'Sound: Active'}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-cyan-400" />}
          </button>

          {/* Download Resume Button */}
          <a
            href="/images/CV of Asif Mohammadd Abir.pdf"
            download="CV of Asif Mohammadd Abir.pdf"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 hover:from-cyan-500/25 hover:to-indigo-500/25 text-cyan-300 hover:text-white border border-cyan-500/30 hover:border-cyan-400/60 shadow-lg transition-all duration-300"
          >
            <Download size={13} />
            <span>Resume</span>
          </a>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 border border-white/10"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-[#040711]/95 backdrop-blur-2xl border-b border-white/10 p-5 shadow-2xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2.5 rounded-xl text-left font-mono text-xs transition-colors ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'bg-white/[0.03] text-gray-300 hover:bg-white/[0.07] border border-white/5'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <a
              href="/images/CV of Asif Mohammadd Abir.pdf"
              download="CV of Asif Mohammadd Abir.pdf"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
            >
              <Download size={14} />
              <span>Download CV</span>
            </a>
            {dhakaTime && (
              <span className="text-xs font-mono text-gray-400">
                Dhaka: {dhakaTime}
              </span>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
