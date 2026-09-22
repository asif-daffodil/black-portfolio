'use client';

import { useSceneStore, SectionId } from '@/store/useSceneStore';
import { soundFX } from '@/lib/sound';
import { STATIONS, StationData } from '@/components/3d/railConfig';

export default function HudRadar() {
  const activeSection = useSceneStore((state) => state.activeSection);
  const pendingSection = useSceneStore((state) => state.pendingSection);
  const setSection = useSceneStore((state) => state.setSection);
  const railProgress = useSceneStore((state) => state.railProgress);

  const activeStation =
    STATIONS.find((s) => s.id === (activeSection || pendingSection)) || STATIONS[0];

  const handleSelectSector = (id: SectionId) => {
    soundFX.playButtonClick();
    setSection(id);
  };

  const radius = 28;
  const centerX = 44;
  const centerY = 44;

  // Real-time animated ship coordinates along the circular rail
  const shipAngleRad = (railProgress * 360 - 90) * (Math.PI / 180);
  const shipX = centerX + radius * Math.cos(shipAngleRad);
  const shipY = centerY + radius * Math.sin(shipAngleRad);

  return (
    <div
      className="fixed bottom-4 left-4 z-30 p-2 sm:p-2.5 rounded-2xl bg-[#090d18]/90 backdrop-blur-md border border-cyan-500/25 shadow-xl shadow-cyan-950/40 flex items-center gap-2.5 select-none pointer-events-auto"
      aria-label="Orbital Rail Radar Map"
    >
      {/* Circular Radar Display */}
      <div className="relative w-[88px] h-[88px] shrink-0">
        <svg viewBox="0 0 88 88" className="w-full h-full">
          {/* Radar background disk */}
          <circle
            cx={centerX}
            cy={centerY}
            r={34}
            fill="#080c16"
            stroke="rgba(6, 182, 212, 0.2)"
            strokeWidth="1"
          />

          {/* Range rings */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius * 0.55}
            fill="none"
            stroke="rgba(6, 182, 212, 0.15)"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          {/* Crosshairs */}
          <line
            x1={centerX - 32}
            y1={centerY}
            x2={centerX + 32}
            y2={centerY}
            stroke="rgba(6, 182, 212, 0.15)"
            strokeWidth="1"
          />
          <line
            x1={centerX}
            y1={centerY - 32}
            x2={centerX}
            y2={centerY + 32}
            stroke="rgba(6, 182, 212, 0.15)"
            strokeWidth="1"
          />

          {/* Center Singularity / Black Hole Marker */}
          <circle cx={centerX} cy={centerY} r="3" fill="#000000" stroke="#22d3ee" strokeWidth="1.2" />
          <circle cx={centerX} cy={centerY} r="1.2" fill="#00f0ff" />

          {/* ── THE ORBITAL CIRCULAR RAIL TRACK ── */}
          {/* Rail outer glow */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="rgba(0, 240, 255, 0.2)"
            strokeWidth="4"
          />
          {/* Rail physical glowing track */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="rgba(0, 240, 255, 0.75)"
            strokeWidth="1.8"
            strokeDasharray="4 1.5"
          />

          {/* ── 8 STATION PLATFORM NODES ── */}
          {STATIONS.map((station) => {
            const angleDeg = station.t * 360 - 90;
            const rad = (angleDeg * Math.PI) / 180;
            const x = centerX + radius * Math.cos(rad);
            const y = centerY + radius * Math.sin(rad);
            const isActive = station.id === activeSection || station.id === pendingSection;

            return (
              <g
                key={station.id}
                onClick={() => handleSelectSector(station.id)}
                className="cursor-pointer group"
              >
                {/* Station base node */}
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 3.5 : 2.2}
                  fill={isActive ? station.beaconColor : '#475569'}
                  stroke={isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.25)'}
                  strokeWidth={isActive ? 1.2 : 0.8}
                  className="transition-all duration-200 group-hover:fill-cyan-300"
                />
              </g>
            );
          })}

          {/* ── REAL-TIME ANIMATED SHIP LOCATOR ── */}
          {/* Ship locator ping */}
          <circle
            cx={shipX}
            cy={shipY}
            r="6.5"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
            className="animate-ping"
          />
          {/* Ship chevron / diamond icon */}
          <polygon
            points={`${shipX},${shipY - 4.5} ${shipX + 3.8},${shipY} ${shipX},${shipY + 4.5} ${shipX - 3.8},${shipY}`}
            fill="#ffffff"
            stroke="#00f0ff"
            strokeWidth="1.2"
          />
        </svg>

        {/* Radar beam sweep */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none origin-center animate-[spin_4s_linear_infinite]"
          style={{
            background:
              'conic-gradient(from 0deg at 50% 50%, rgba(6, 182, 212, 0.25) 0deg, transparent 60deg, transparent 360deg)',
          }}
        />
      </div>

      {/* Telemetry Readout */}
      <div className="space-y-0.5 font-mono pr-1.5 min-w-[72px]">
        <div className="flex items-center gap-1.5 text-[9px] text-cyan-400 font-bold uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>RAIL LOCK</span>
        </div>
        <div className="text-xs font-bold text-white tracking-wide">
          {activeStation.code}
        </div>
        <div className="text-[10px] text-cyan-300 font-medium">
          // {activeStation.name}
        </div>
      </div>
    </div>
  );
}
