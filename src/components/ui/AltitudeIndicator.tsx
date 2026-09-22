'use client';

import { useSceneStore, SectionId, SECTION_ORDER } from '@/store/useSceneStore';
import { soundFX } from '@/lib/sound';
import { motion } from 'framer-motion';

interface StationMeta {
  id: SectionId;
  label: string;
  code: string;
}

const STATIONS_META: StationMeta[] = [
  { id: 'bridge', label: 'ORBIT', code: '00' },
  { id: 'about', label: 'ORIGIN', code: '01' },
  { id: 'skills', label: 'ARSENAL', code: '02' },
  { id: 'experience', label: 'FLIGHT LOG', code: '03' },
  { id: 'education', label: 'CREDENTIALS', code: '04' },
  { id: 'ai', label: 'NEURAL AI', code: '05' },
  { id: 'portfolio', label: 'SHOWCASE', code: '06' },
  { id: 'contact', label: 'RELAY', code: '07' },
];

export default function AltitudeIndicator() {
  const activeSection = useSceneStore((state) => state.activeSection);
  const pendingSection = useSceneStore((state) => state.pendingSection);
  const setSection = useSceneStore((state) => state.setSection);

  const effectiveSection = activeSection || pendingSection;
  const activeIndex = effectiveSection ? SECTION_ORDER.indexOf(effectiveSection) : -1;

  const handleSelect = (id: SectionId) => {
    soundFX.playButtonClick();
    setSection(id);
  };

  return (
    <aside
      className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3 pointer-events-auto select-none"
      aria-label="Altitude Navigation Track"
    >
      {/* Top telemetry label */}
      <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-cyan-400/80 mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span>SPATIAL // NAV</span>
      </div>

      {/* Vertical Track and Waypoint Labels */}
      <div className="flex items-center gap-4">
        {/* Labels */}
        <div className="flex flex-col items-end gap-2.5">
          {STATIONS_META.map((st, idx) => {
            const isActive = effectiveSection === st.id;
            return (
              <button
                key={st.id}
                onClick={() => handleSelect(st.id)}
                onMouseEnter={() => soundFX.playHoverTick()}
                className={`group flex items-center gap-2.5 text-right transition-all duration-300 focus:outline-none ${
                  isActive
                    ? 'text-cyan-300 translate-x-0 font-semibold'
                    : 'text-gray-500 hover:text-gray-300 translate-x-1 hover:translate-x-0'
                }`}
              >
                <span className="text-[9px] font-mono tracking-widest opacity-60">
                  {st.code}
                </span>
                <span
                  className={`text-xs font-mono tracking-wider ${
                    isActive ? 'text-white' : ''
                  }`}
                >
                  {st.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Physical Vertical Track Bar */}
        <div className="relative w-1 h-56 rounded-full bg-white/10 overflow-hidden">
          {/* Active Slider Indicator */}
          <motion.div
            className="absolute left-0 w-full rounded-full bg-gradient-to-b from-cyan-400 via-sky-300 to-indigo-500 shadow-[0_0_12px_#38bdf8]"
            initial={false}
            animate={{
              top: activeIndex >= 0 ? `${(activeIndex / (SECTION_ORDER.length - 1)) * 88}%` : '0%',
              opacity: activeIndex >= 0 ? 1 : 0,
              height: '12%',
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          />
        </div>
      </div>

      {/* Bottom Coordinates Telemetry */}
      <div className="mt-2 text-right">
        <span className="block text-[9px] font-mono text-gray-500 tracking-wider">
          DHAKA 23.81°N · 90.41°E
        </span>
        <span className="block text-[9px] font-mono text-cyan-400/60 tracking-widest">
          SYS STATUS: NOMINAL
        </span>
      </div>
    </aside>
  );
}
