'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useSceneStore, SectionId } from '@/store/useSceneStore';
import { Download, Menu, X, Volume2, VolumeX, Radio, Compass } from 'lucide-react';
import { soundFX } from '@/lib/sound';

interface NavItem {
  id: SectionId;
  label: string;
  code: string;
  accent: 'amber' | 'cyan';
}

const NAV_ITEMS: NavItem[] = [
  { id: 'bridge', label: 'HOME', code: '00', accent: 'amber' },
  { id: 'about', label: 'ABOUT', code: '01', accent: 'cyan' },
  { id: 'skills', label: 'SKILLS', code: '02', accent: 'cyan' },
  { id: 'experience', label: 'EXP', code: '03', accent: 'amber' },
  { id: 'education', label: 'CREDS', code: '04', accent: 'amber' },
  { id: 'ai', label: 'AI WORK', code: '05', accent: 'cyan' },
  { id: 'portfolio', label: 'CHARTS', code: '06', accent: 'cyan' },
  { id: 'contact', label: 'COMMS', code: '07', accent: 'amber' },
];

const SECTION_COCKPIT_GLOW: Record<SectionId, { glow: string; border: string }> = {
  bridge: { glow: 'rgba(245, 158, 11, 0.22)', border: 'rgba(245, 158, 11, 0.35)' },
  about: { glow: 'rgba(6, 182, 212, 0.22)', border: 'rgba(6, 182, 212, 0.35)' },
  skills: { glow: 'rgba(139, 92, 246, 0.22)', border: 'rgba(139, 92, 246, 0.35)' },
  experience: { glow: 'rgba(16, 185, 129, 0.22)', border: 'rgba(16, 185, 129, 0.35)' },
  education: { glow: 'rgba(251, 191, 36, 0.22)', border: 'rgba(251, 191, 36, 0.35)' },
  ai: { glow: 'rgba(236, 72, 153, 0.22)', border: 'rgba(236, 72, 153, 0.35)' },
  portfolio: { glow: 'rgba(99, 102, 241, 0.22)', border: 'rgba(99, 102, 241, 0.35)' },
  contact: { glow: 'rgba(20, 184, 166, 0.22)', border: 'rgba(20, 184, 166, 0.35)' },
};

interface PulseBeam {
  x: number;
  y: number;
  color: string;
  key: number;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dhakaTime, setDhakaTime] = useState<string>('');
  const [pressedId, setPressedId] = useState<SectionId | null>(null);
  const [pulseBeams, setPulseBeams] = useState<PulseBeam[]>([]);

  const activeSection = useSceneStore((state) => state.activeSection);
  const setSection = useSceneStore((state) => state.setSection);
  const isMuted = useSceneStore((state) => state.isMuted);
  const toggleMute = useSceneStore((state) => state.toggleMute);
  const isBooted = useSceneStore((state) => state.isBooted);
  const bootPoweredCount = useSceneStore((state) => state.bootPoweredCount);

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

  const handleNavClick = (id: SectionId, e?: React.MouseEvent<HTMLButtonElement>) => {
    soundFX.playButtonClick();

    // Tactile button depression feedback
    setPressedId(id);
    setTimeout(() => setPressedId(null), 180);

    // Light conduit pulse animation traveling from button towards main screen
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const beamColor = id === 'bridge' || id === 'experience' || id === 'education' || id === 'contact' ? '#f59e0b' : '#00f0ff';
      const newBeam: PulseBeam = {
        x: rect.left + rect.width / 2,
        y: rect.bottom - 4,
        color: beamColor,
        key: Date.now() + Math.random(),
      };
      setPulseBeams((prev) => [...prev, newBeam]);

      // Remove beam after animation finishes
      setTimeout(() => {
        setPulseBeams((prev) => prev.filter((b) => b.key !== newBeam.key));
      }, 550);
    }

    setSection(id);
    setMobileMenuOpen(false);
  };

  const handleAudioToggle = () => {
    const nextMuted = !isMuted;
    if (!nextMuted) {
      toggleMute();
      setTimeout(() => soundFX.playButtonClick(), 30);
    } else {
      soundFX.playButtonClick();
      toggleMute();
    }
  };

  const currentCockpitLight = SECTION_COCKPIT_GLOW[activeSection] || SECTION_COCKPIT_GLOW.bridge;

  return (
    <>
      {/* ── 5. FAINT AMBIENT LIGHT IN COCKPIT (Subtle ambient canopy wash reflecting black hole view) ── */}
      <div
        className="fixed top-0 inset-x-0 h-44 pointer-events-none z-30 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(ellipse 65% 100% at 50% 0%, ${currentCockpitLight.glow} 0%, transparent 75%)`,
        }}
        aria-hidden="true"
      />

      {/* ── 4. LIGHT CONDUIT PULSES (Travel from pressed button toward main viewport screen) ── */}
      {pulseBeams.map((beam) => (
        <div
          key={beam.key}
          className="fixed pointer-events-none z-50"
          style={{ left: beam.x, top: beam.y }}
        >
          <div
            className="w-[2.5px] h-[130px] -translate-x-1/2 conduit-pulse-line"
            style={{
              background: `linear-gradient(to bottom, #ffffff, ${beam.color} 55%, transparent)`,
              boxShadow: `0 0 14px ${beam.color}, 0 0 24px ${beam.color}`,
            }}
          />
        </div>
      ))}

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#040711]/90 backdrop-blur-2xl border-b border-white/[0.08] shadow-2xl py-2.5'
            : 'bg-gradient-to-b from-[#03060f]/85 via-[#03060f]/40 to-transparent py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          {/* Brand Logo & Executive Avatar */}
          <button
            onClick={(e) => handleNavClick('bridge', e)}
            className="flex items-center gap-3 group cursor-pointer focus:outline-none text-left"
          >
            <div className="relative w-10 h-10 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-400 via-cyan-300 to-indigo-500 shadow-[0_0_14px_rgba(245,158,11,0.35)] group-hover:shadow-[0_0_22px_rgba(245,158,11,0.6)] transition-all duration-300">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-[#070b16]">
                <Image
                  src="/images/asif-abir-executive.png"
                  alt="Asif Abir Zend Certified PHP Engineer"
                  fill
                  sizes="40px"
                  className="object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-500"
                  priority
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base tracking-tight text-white group-hover:text-amber-300 transition-colors font-mono">
                  ASIF ABIR
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.25)]">
                  ZCE 7.1
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400">
                <span className="text-cyan-400 font-medium">SYS-ARCHITECT</span>
                <span className="text-gray-600">·</span>
                <span className="text-gray-400">DAFFODIL</span>
              </div>
            </div>
          </button>

          {/* ── PHYSICAL SCI-FI COCKPIT CONSOLE DECK ── */}
          <nav
            className="hidden lg:flex items-center gap-1.5 bg-gradient-to-b from-[#0e1526]/90 via-[#070b16]/95 to-[#04060c] px-3 py-1.5 rounded-xl border border-white/[0.14] shadow-[0_12px_32px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.12)] relative"
            aria-label="Cockpit Navigation Console"
          >
            {/* Ambient Cockpit Rail Glow Accent */}
            <div
              className="absolute -inset-x-2 -bottom-2 h-1 pointer-events-none opacity-40 blur-[2px] transition-colors duration-700"
              style={{ background: currentCockpitLight.border }}
            />

            {NAV_ITEMS.map((item, idx) => {
              const isActive = activeSection === item.id;
              const isPressed = pressedId === item.id;
              const isAmber = item.accent === 'amber';

              // Theme styling for amber (black hole heat) vs cyan (ionization)
              const accentColor = isAmber ? '#f59e0b' : '#00f0ff';
              const activeBg = isAmber
                ? 'bg-gradient-to-b from-amber-500/25 via-amber-950/40 to-[#070d1a] border-amber-400/80 text-amber-200'
                : 'bg-gradient-to-b from-cyan-500/25 via-cyan-950/40 to-[#070d1a] border-cyan-400/80 text-cyan-200';

              const activeShadow = isAmber
                ? 'shadow-[0_0_18px_rgba(245,158,11,0.5),inset_0_0_12px_rgba(245,158,11,0.3)]'
                : 'shadow-[0_0_18px_rgba(0,240,255,0.5),inset_0_0_12px_rgba(0,240,255,0.3)]';

              const isPowered = isBooted || bootPoweredCount > idx;
              const isIgniting = !isBooted && bootPoweredCount === idx + 1;
              const canInteract = isBooted;

              return (
                <button
                  key={item.id}
                  onClick={(e) => canInteract && handleNavClick(item.id, e)}
                  onMouseEnter={() => canInteract && soundFX.playHoverTick()}
                  aria-pressed={isActive}
                  disabled={!canInteract}
                  className={`relative group overflow-hidden px-3.5 py-1.5 rounded-lg border transition-all duration-200 focus:outline-none console-btn-depress ${
                    canInteract ? 'cursor-pointer' : 'cursor-not-allowed'
                  } ${
                    isPressed ? 'console-btn-depressed' : ''
                  } ${
                    isIgniting
                      ? 'console-btn-boot-flash font-bold pointer-events-none'
                      : !isPowered
                      ? 'opacity-20 grayscale brightness-40 pointer-events-none border-white/5 bg-[#060912]'
                      : isActive
                      ? `${activeBg} ${activeShadow} font-bold`
                      : 'bg-gradient-to-b from-[#12192c] to-[#080d19] border-white/10 text-gray-300 hover:text-white hover:border-white/30 hover:shadow-[0_0_14px_rgba(245,158,11,0.3)]'
                  }`}
                >
                  {/* ── 2. Idle State Standby LED Glow (Pulsing 0.7 to 1.0, 2.6s cycle) ── */}
                  <span
                    className={`absolute top-0 inset-x-0 h-[2px] rounded-t transition-opacity duration-300 ${
                      !isPowered
                        ? 'opacity-0'
                        : isActive
                        ? 'opacity-100 shadow-[0_0_8px_currentColor]'
                        : 'console-standby-glow'
                    }`}
                    style={{
                      background: isActive
                        ? accentColor
                        : isAmber
                        ? 'rgba(245, 158, 11, 0.85)'
                        : 'rgba(0, 240, 255, 0.85)',
                      boxShadow: isActive ? `0 0 10px ${accentColor}` : undefined,
                    }}
                  />

                  {/* ── 3. Hover State: Thin Laser Scan-Line Sweep across button ── */}
                  {canInteract && <span className="console-scan-sweep" />}

                  {/* Button Hardware Content */}
                  <div className="flex flex-col items-center justify-center leading-none select-none">
                    <span className="text-[8px] font-mono tracking-widest text-gray-400 group-hover:text-gray-200 mb-0.5">
                      {item.code}
                    </span>
                    <span className="text-[11px] font-mono font-bold tracking-wider">
                      {item.label}
                    </span>
                  </div>

                  {/* Bottom mechanical edge highlight */}
                  <span className="absolute bottom-0 inset-x-0 h-[1px] bg-white/[0.06] group-hover:bg-white/[0.2] pointer-events-none" />
                </button>
              );
            })}
          </nav>

          {/* Right Utility Cluster: Dhaka Time, Cockpit Audio Module, Resume CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Local Time */}
            {dhakaTime && (
              <div className="hidden xl:flex flex-col items-end text-right pr-1">
                <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">
                  DHAKA (UTC+6)
                </span>
                <span className="text-xs font-mono font-medium text-cyan-300">
                  {dhakaTime}
                </span>
              </div>
            )}

            {/* Cockpit Audio Console Control Module */}
            {(() => {
              const isAudioPowered = isBooted || bootPoweredCount >= 8;
              const isAudioIgniting = !isBooted && bootPoweredCount === 9;
              const canInteractAudio = isBooted;

              return (
                <button
                  onClick={canInteractAudio ? handleAudioToggle : undefined}
                  onMouseEnter={() => canInteractAudio && soundFX.playHoverTick()}
                  aria-label={isMuted ? 'Unmute cockpit audio' : 'Mute cockpit audio'}
                  title={isMuted ? 'Cockpit Audio: MUTED (Click to engage engine drone)' : 'Cockpit Audio: ONLINE (Click to mute)'}
                  disabled={!canInteractAudio}
                  className={`relative group overflow-hidden px-2.5 sm:px-3 py-1.5 rounded-lg border transition-all duration-200 focus:outline-none console-btn-depress shadow-md ${
                    canInteractAudio ? 'cursor-pointer' : 'cursor-not-allowed'
                  } ${
                    isAudioIgniting
                      ? 'console-btn-boot-flash pointer-events-none'
                      : !isAudioPowered
                      ? 'opacity-20 grayscale brightness-40 pointer-events-none border-white/5 bg-[#060912]'
                      : !isMuted
                      ? 'bg-gradient-to-b from-[#0b1c29] to-[#05111b] border-cyan-400/50 text-cyan-300 shadow-[0_0_14px_rgba(0,240,255,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] console-standby-glow'
                      : 'bg-gradient-to-b from-[#181013] to-[#0d0709] border-red-500/30 text-gray-400 hover:text-gray-200 hover:border-red-400/40'
                  }`}
                >
                  {/* Standby LED Indicator Light */}
                  <span
                    className={`absolute top-0 inset-x-0 h-[2px] rounded-t transition-opacity duration-300 ${
                      !isAudioPowered
                        ? 'opacity-0'
                        : !isMuted
                        ? 'bg-cyan-400 opacity-100 shadow-[0_0_8px_#00f0ff]'
                        : 'bg-red-500/70 opacity-70 shadow-[0_0_6px_rgba(239,68,68,0.5)]'
                    }`}
                  />

                  {/* Laser scan-line sweep on hover */}
                  {canInteractAudio && <span className="console-scan-sweep" />}

                  {/* Hardware Button Label & Telemetry */}
                  <div className="flex items-center gap-1.5 sm:gap-2 leading-none select-none">
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-[7px] font-mono tracking-widest text-gray-400 group-hover:text-gray-300 mb-0.5">
                        AUDIO // COMM
                      </span>
                      <div className="flex items-center gap-1">
                        {!isMuted ? (
                          <>
                            <Volume2 size={12} className="text-cyan-400 animate-pulse shrink-0" />
                            <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-300">LIVE</span>
                          </>
                        ) : (
                          <>
                            <VolumeX size={12} className="text-red-400 shrink-0" />
                            <span className="text-[10px] font-mono font-bold tracking-wider text-red-300/80">MUTED</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom mechanical edge highlight */}
                  <span className="absolute bottom-0 inset-x-0 h-[1px] bg-white/[0.06] group-hover:bg-white/[0.2] pointer-events-none" />
                </button>
              );
            })()}

            {/* Resume / Dossier CTA */}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => soundFX.playHoverTick()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 border border-cyan-400/40 hover:border-cyan-400 text-xs font-mono font-medium text-cyan-200 hover:text-white transition-all shadow-md shadow-cyan-950/40 cursor-pointer focus:outline-none"
            >
              <Download size={13} className="text-cyan-300" />
              <span>Resume</span>
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Controls"
              className="lg:hidden p-2 rounded-lg bg-[#0a0f1d] border border-white/10 text-gray-300 hover:text-white cursor-pointer focus:outline-none"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 px-4 pb-4 pt-2 bg-[#050914]/95 backdrop-blur-2xl border-b border-white/10 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={(e) => handleNavClick(item.id, e)}
                    className={`flex items-center justify-between px-3.5 py-2 rounded-lg border font-mono text-xs transition-all ${
                      isActive
                        ? 'bg-amber-500/20 border-amber-400/60 text-amber-200 font-bold shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                        : 'bg-[#0b101e] border-white/10 text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[9px] text-gray-500">{item.code}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
