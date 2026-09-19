'use client';

import { useSceneStore, SectionId } from '@/store/useSceneStore';
import { soundFX } from '@/lib/sound';

interface NavItem {
  id: SectionId;
  label: string;
  code: string;
}

const SECTIONS: NavItem[] = [
  { id: 'bridge', label: 'Home Bridge', code: '1' },
  { id: 'about', label: 'Pilot Profile', code: '2' },
  { id: 'skills', label: 'Technical Systems', code: '3' },
  { id: 'experience', label: 'Mission Log', code: '4' },
  { id: 'education', label: 'Training Archive', code: '5' },
  { id: 'ai', label: 'AI Core', code: '6' },
  { id: 'portfolio', label: 'Star Charts', code: '7' },
  { id: 'contact', label: 'Hailing Frequencies', code: '8' },
];

export default function SemanticNav() {
  const activeSection = useSceneStore((state) => state.activeSection);
  const setSection = useSceneStore((state) => state.setSection);

  const handleClick = (id: SectionId) => {
    soundFX.playButtonClick();
    setSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Flight Navigation Controls"
      className="sr-only focus-within:not-sr-only focus-within:fixed focus-within:top-20 focus-within:left-6 focus-within:z-50 focus-within:p-4 focus-within:bg-[#0c101d]/95 focus-within:border focus-within:border-cyan-500 focus-within:rounded-xl focus-within:shadow-2xl focus-within:backdrop-blur-md"
    >
      <div className="text-xs font-mono text-cyan-400 font-bold mb-2">
        QUICK ACCESS FLIGHT NAVIGATION (PRESS 1-8 OR TAB)
      </div>
      <div className="flex flex-wrap gap-2">
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => handleClick(sec.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer ${
                isActive
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              [{sec.code}] {sec.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
