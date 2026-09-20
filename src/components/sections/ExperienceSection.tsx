'use client';

import Image from 'next/image';
import FloatingPanel from '@/components/hud/FloatingPanel';
import { experienceData } from '@/data/experience';
import { Calendar, MapPin, CheckCircle, Rocket } from 'lucide-react';

export default function ExperienceSection() {
  return (
    <FloatingPanel
      sectionId="experience"
      sectorCode="LOG-04"
      sectorName="MISSION LOG // FLIGHT TIMELINE"
      badge="8 RECORDS"
      maxWidth="max-w-5xl"
    >
      <div className="space-y-8">
        <div className="border-b border-white/10 pb-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Operational Career Flight Log
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Sequential mission deployments across enterprise conglomerates, tech ventures, and international client contracts.
          </p>
        </div>

        {/* Executive Experience Highlights Banner */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl glass-panel border border-cyan-500/20 bg-gradient-to-r from-[#070e1c] to-black/60">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-cyan-400/40 shrink-0 shadow-lg">
            <Image
              src="/images/asif-abir-architect.jpg"
              alt="Asif Abir Lead Architect"
              fill
              sizes="80px"
              className="object-cover object-center"
            />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-sm font-bold text-white">14+ Years Enterprise Engineering Leadership</span>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/15 px-2 py-0.5 rounded border border-cyan-500/30">ZCE 7.1</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-light">
              From architecting Daffodil Group university admissions and ERP portals to leading international media and fintech cloud architectures.
            </p>
          </div>
        </div>

        {/* Vertical Flight Log Timeline */}
        <div className="relative border-l-2 border-cyan-500/30 ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8">
          {experienceData.map((log) => (
            <div key={log.id} className="relative group">
              {/* Mission Timeline Node */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#05070c] border-2 border-cyan-400 flex items-center justify-center group-hover:scale-125 transition-transform">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    log.isCurrent ? 'bg-cyan-400 animate-ping' : 'bg-gray-500'
                  }`}
                />
              </div>

              {/* Log Card */}
              <div className="glass-panel p-6 sm:p-7 rounded-2xl space-y-4 hover:border-cyan-500/40 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    {log.logoUrl && (
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/5 border border-white/10 shrink-0 p-1">
                        <Image
                          src={log.logoUrl}
                          alt={log.organization}
                          fill
                          sizes="40px"
                          className="object-contain p-1"
                        />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 font-mono text-[10px] text-cyan-400">
                        <Rocket className="w-3 h-3" />
                        <span>{log.missionCode}</span>
                        <span>·</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            log.isCurrent
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-gray-500/10 text-gray-400'
                          }`}
                        >
                          {log.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white leading-tight mt-0.5">
                        {log.role}
                      </h3>
                      <div className="text-sm font-semibold text-cyan-300">
                        {log.organization}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-gray-400">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 border border-white/10">
                      <Calendar className="w-3 h-3 text-cyan-400" />
                      <span>{log.period}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 border border-white/10">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      <span>{log.location}</span>
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed">
                  {log.summary}
                </p>

                {/* Directives List */}
                <div className="space-y-1.5 font-mono text-xs text-gray-300">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    Key Directives & Accomplishments:
                  </span>
                  <ul className="space-y-1.5">
                    {log.directives.map((dir, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{dir}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                  {log.techStack.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-cyan-500/10 border border-cyan-500/20 text-cyan-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FloatingPanel>
  );
}
