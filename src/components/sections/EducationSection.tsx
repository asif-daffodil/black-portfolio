'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { educationData } from '@/data/education';
import { certificationsData } from '@/data/certifications';
import FloatingPanel from '@/components/hud/FloatingPanel';
import { GraduationCap, Award, Calendar, MapPin, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { soundFX } from '@/lib/sound';

export default function EducationSection() {
  const [activeTab, setActiveTab] = useState<'degrees' | 'certifications'>('degrees');

  // Sorted chronological order (1 -> 2 -> 3)
  const chronologicalDegrees = [...educationData].sort((a, b) => a.order - b.order);

  const handleTabSwitch = (tab: 'degrees' | 'certifications') => {
    soundFX.playButtonClick();
    setActiveTab(tab);
  };

  return (
    <FloatingPanel
      sectionId="education"
      sectorCode="ACAD-05"
      sectorName="Training Archive & Accreditations"
      badge="Verified Credentials"
      maxWidth="max-w-6xl"
    >
      {/* Sub-tab Switcher Console */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <GraduationCap className="w-7 h-7 text-cyan-400" />
            Academy & Certification Log
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm mt-1">
            Chronological academic background, formal university degrees, and globally accredited engineering licenses.
          </p>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex items-center gap-2 p-1 bg-black/60 border border-white/10 rounded-xl">
          <button
            type="button"
            onClick={() => handleTabSwitch('degrees')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-mono font-bold transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
              activeTab === 'degrees'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-lg shadow-cyan-500/20'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Academic Degrees ({chronologicalDegrees.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('certifications')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-mono font-bold transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
              activeTab === 'certifications'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-lg shadow-cyan-500/20'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Certifications ({certificationsData.length})</span>
          </button>
        </div>
      </div>

      {/* Degrees Tab Content */}
      {activeTab === 'degrees' && (
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {chronologicalDegrees.map((deg) => (
              <div
                key={deg.id}
                className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 group-hover:opacity-100 opacity-30 transition-opacity" />

                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0 p-1.5 flex items-center justify-center">
                      {deg.logoUrl ? (
                        <Image
                          src={deg.logoUrl}
                          alt={`Institutional monogram of ${deg.institution}`}
                          width={48}
                          height={48}
                          className="object-contain p-1"
                        />
                      ) : (
                        <GraduationCap className="w-6 h-6 text-cyan-400" />
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-cyan-300">
                      <Calendar className="w-3 h-3 text-cyan-400" />
                      {deg.period}
                    </span>
                  </div>

                  {/* Degree & Major */}
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 tracking-wider uppercase">
                      {deg.archiveCode} // {deg.major}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug mt-0.5 group-hover:text-cyan-200 transition-colors">
                      {deg.degree}
                    </h3>
                    <div className="text-xs font-semibold text-amber-300 mt-1">
                      {deg.institution}
                    </div>
                  </div>

                  {/* GPA Gauge Badge */}
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-300 font-medium">GRADE / GPA</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-mono font-bold text-cyan-400">{deg.gpa}</span>
                      <span className="text-xs font-mono text-gray-300">/ {deg.gpaScale}</span>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {deg.summary}
                  </p>
                </div>

                {/* Footer Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-300 pt-3 border-t border-white/10 font-mono">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    {deg.location}
                  </span>
                  <span className="text-cyan-300">Class of {deg.passingYear}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications Tab Content */}
      {activeTab === 'certifications' && (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificationsData.map((cert) => (
              <div
                key={cert.id}
                className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 uppercase">
                      {cert.code}
                    </span>
                    {cert.isNationalAccreditation ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                        <ShieldCheck className="w-3 h-3" />
                        National Standard
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-gray-300">
                        {cert.issueDate}
                      </span>
                    )}
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3">
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0 p-1.5 flex items-center justify-center">
                      {cert.badgeImageUrl ? (
                        <Image
                          src={cert.badgeImageUrl}
                          alt={`Accreditation credential badge for ${cert.title}`}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      ) : (
                        <Award className="w-6 h-6 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors leading-snug">
                        {cert.title}
                      </h4>
                      <p className="text-xs text-amber-300 mt-0.5 font-medium">
                        {cert.issuer}
                      </p>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                    {cert.summary}
                  </p>
                </div>

                {/* Footer / Credential ID */}
                <div className="flex items-center justify-between text-xs pt-3 border-t border-white/10 font-mono">
                  {cert.credentialId ? (
                    <span className="text-[11px] text-gray-300 truncate max-w-[170px]">
                      ID: <span className="text-white font-bold">{cert.credentialId}</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-gray-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified
                    </span>
                  )}

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded"
                      aria-label={`Verify credential for ${cert.title}`}
                    >
                      <span>Verify</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </FloatingPanel>
  );
}
