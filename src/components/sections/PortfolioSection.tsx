'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { portfolioProjects, ProjectItem } from '@/data/portfolio';
import FloatingPanel from '@/components/hud/FloatingPanel';
import { useSceneStore } from '@/store/useSceneStore';
import { ExternalLink, Compass, X, Globe, Radio } from 'lucide-react';
import { soundFX } from '@/lib/sound';

export default function PortfolioSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const selectedProjectId = useSceneStore((state) => state.selectedProjectId);
  const setSelectedProject = useSceneStore((state) => state.setSelectedProject);

  const categories = ['All', 'Media', 'EdTech', 'eCommerce', 'Enterprise', 'SaaS'];

  const filteredProjects = portfolioProjects.filter((project: ProjectItem) => {
    if (selectedCategory === 'All') return true;
    return project.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const activeModalProject = portfolioProjects.find((p) => p.id === selectedProjectId);

  const handleOpenProject = (projectId: string) => {
    soundFX.playButtonClick();
    setSelectedProject(projectId);
  };

  const handleCloseModal = () => {
    soundFX.playButtonClick();
    setSelectedProject(null);
  };

  return (
    <FloatingPanel
      sectionId="portfolio"
      sectorCode="PRJ-07"
      sectorName="Star Charts & Mission Waypoints"
      badge={`${portfolioProjects.length} Deployments Active`}
      maxWidth="max-w-6xl"
    >
      <div className="space-y-6">
        {/* Header & Waypoint Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Deep-Space Waypoint Grid // 17 Sectors</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Featured Projects & Web Waypoints
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Click any project card or interact directly with the 3D beacons orbiting the black hole to inspect sector telemetry and visit live deployments.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-black/60 border border-white/10 rounded-xl self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-md shadow-cyan-500/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const isSelected = selectedProjectId === project.id;
            return (
              <article
                key={project.id}
                id={`project-${project.id}`}
                onClick={() => handleOpenProject(project.id)}
                className={`glass-panel rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between group relative border ${
                  isSelected
                    ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-xl shadow-amber-500/20'
                    : 'border-white/10 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10'
                }`}
              >
                <div>
                  {/* Thumbnail Banner */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-black/50">
                    <Image
                      src={project.imageUrl}
                      alt={`Screenshot of ${project.title}`}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    {/* Beacon Code Badge */}
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/85 backdrop-blur-md border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                      <Radio className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
                      <span>{project.beaconCode}</span>
                    </div>

                    {/* Category */}
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/85 backdrop-blur-md border border-white/15 text-[10px] font-mono text-gray-200 uppercase font-bold">
                      {project.category}
                    </div>

                    {/* Direct Visit Button on Thumbnail */}
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-black/80 backdrop-blur-md text-cyan-300 hover:text-white hover:bg-cyan-600 transition-colors border border-white/15 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                      aria-label={`Visit live site for ${project.title}`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 space-y-2">
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-200 transition-colors flex items-center justify-between gap-2">
                      <span className="truncate">{project.title}</span>
                    </h3>

                    <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Tech Pills Footer */}
                <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-white/5 flex flex-wrap gap-1">
                  {project.technologies.slice(0, 4).map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-gray-200"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Selected Project Modal / Waypoint Inspector Card */}
      {activeModalProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={handleCloseModal}
        >
          <div
            className="glass-panel border border-cyan-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 relative shadow-2xl shadow-cyan-950/80"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              aria-label="Close Waypoint Card"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300">
                {activeModalProject.beaconCode}
              </span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-gray-200 uppercase font-bold">
                {activeModalProject.category}
              </span>
            </div>

            {/* Image Preview */}
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/10 bg-black">
              <Image
                src={activeModalProject.imageUrl}
                alt={`Screenshot preview of ${activeModalProject.title}`}
                fill
                className="object-cover object-top"
              />
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {activeModalProject.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                {activeModalProject.description}
              </p>
            </div>

            {/* Technology Stack Tags */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-gray-300 font-bold uppercase">DEPLOYED TECHNOLOGIES & PROTOCOLS:</div>
              <div className="flex flex-wrap gap-1.5">
                {activeModalProject.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-cyan-500/10 border border-cyan-500/20 text-cyan-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10 gap-3">
              <span className="text-[11px] font-mono text-gray-400">
                COORDS: [{activeModalProject.sectorCoords.join(', ')}]
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-mono transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                >
                  Close Beacon
                </button>

                <a
                  href={activeModalProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/30 transition-all font-mono focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                >
                  <Globe className="w-4 h-4" />
                  <span>Visit Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </FloatingPanel>
  );
}
