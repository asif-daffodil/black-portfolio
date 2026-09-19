'use client';

import FloatingPanel from '@/components/hud/FloatingPanel';
import { powerConduits, categorizedSkills, PowerConduit } from '@/data/skills';
import { Zap, Activity, Server, Layers, Wrench } from 'lucide-react';

const CATEGORY_ICONS = {
  backend: Server,
  frontend: Layers,
  tools: Wrench,
};

function PowerConduitMeter({ conduit }: { conduit: PowerConduit }) {
  const totalBlocks = 14;
  const activeBlocks = Math.round((conduit.level / 100) * totalBlocks);

  return (
    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/40 transition-all font-mono space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-white tracking-wide">
          {conduit.name}
        </span>
        <span
          className="text-[11px] px-2 py-0.5 rounded font-bold"
          style={{
            color: conduit.glowColor,
            backgroundColor: `${conduit.glowColor}15`,
            border: `1px solid ${conduit.glowColor}40`,
          }}
        >
          {conduit.powerOutput}
        </span>
      </div>

      {/* Segmented Power-Conduit LED Meter */}
      <div className="flex items-center gap-1 bg-black/40 p-1.5 rounded-lg border border-white/5">
        {Array.from({ length: totalBlocks }).map((_, idx) => {
          const isLit = idx < activeBlocks;
          return (
            <div
              key={idx}
              className="h-3.5 flex-1 rounded-xs transition-all duration-500"
              style={{
                backgroundColor: isLit ? conduit.glowColor : 'rgba(255,255,255,0.06)',
                boxShadow: isLit ? `0 0 8px ${conduit.glowColor}80` : 'none',
              }}
            />
          );
        })}
      </div>

      <div className="flex justify-between items-center text-[10px] text-gray-400">
        <span>CONDUIT LOAD: {conduit.level}%</span>
        <span className="text-emerald-400">STATUS: {conduit.status}</span>
      </div>
    </div>
  );
}

export default function SkillsSection() {
  return (
    <FloatingPanel
      sectionId="skills"
      sectorCode="SYS-03"
      sectorName="TECHNICAL SYSTEMS // POWER CONDUITS"
      badge="GRID STABLE"
      maxWidth="max-w-6xl"
    >
      <div className="space-y-8">
        {/* Header Telemetry */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Reactor & Power Conduit Metrics
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
              Live telemetry across primary backend engines, frontend interfaces, and cloud conduits.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>TOTAL OUTPUT: 1.02 GW</span>
          </div>
        </div>

        {/* 1. Glowing Power-Conduit Meters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {powerConduits.map((conduit) => (
            <PowerConduitMeter key={conduit.id} conduit={conduit} />
          ))}
        </div>

        {/* 2. Categorized Tag Lists */}
        <div className="pt-4 border-t border-white/10 space-y-6">
          <div className="text-xs uppercase font-mono font-bold tracking-widest text-cyan-400">
            Categorized Technical Subsystems
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categorizedSkills.map((category) => {
              const Icon = CATEGORY_ICONS[category.id as keyof typeof CATEGORY_ICONS] || Server;
              return (
                <div
                  key={category.id}
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 font-mono"
                >
                  <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">
                        {category.title}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {category.code}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    {category.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {category.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-gray-300 hover:text-white transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </FloatingPanel>
  );
}
