'use client';

import React, { useState } from 'react';
import { aiFocusAreas, aiCodeSnippet } from '@/data/ai';
import FloatingPanel from '@/components/hud/FloatingPanel';
import { Bot, Cpu, Sparkles, Terminal, Copy, Check, Code2, Database, ShieldCheck, Zap } from 'lucide-react';

export default function AiSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(aiCodeSnippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy snippet', err);
    }
  };

  const getFocusIcon = (code: string) => {
    switch (code) {
      case 'AI-CORE-01':
        return Sparkles;
      case 'AI-CORE-02':
        return Bot;
      case 'AI-CORE-03':
        return Database;
      case 'AI-CORE-04':
        return Zap;
      default:
        return Cpu;
    }
  };

  return (
    <FloatingPanel
      sectionId="ai"
      sectorCode="AI-06"
      sectorName="AI Core & Autonomous Systems"
      badge="Neural Core Online"
      maxWidth="max-w-6xl"
    >
      <div className="space-y-8">
        {/* Section Header */}
        <div className="border-b border-white/10 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <Bot className="w-3.5 h-3.5" />
            <span>Autonomous Intelligence & LLM Pipelines</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Next-Gen AI Core & Agentic Engineering
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
            Architecting production LLM integrations, autonomous multi-turn agentic workflows, context-aware RAG vector search, and hardened AI APIs.
          </p>
        </div>

        {/* 4 AI Focus Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {aiFocusAreas.map((area) => {
            const Icon = getFocusIcon(area.code);
            return (
              <div
                key={area.id}
                className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/40 to-cyan-500/0 group-hover:opacity-100 opacity-20 transition-opacity" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-cyan-300 uppercase">
                      {area.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase">{area.code}</span>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-200 transition-colors">
                      {area.title}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    {area.summary}
                  </p>

                  <ul className="space-y-1.5 pt-1">
                    {area.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-400">
                        <span className="text-cyan-400 mt-0.5">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/10">
                  {area.tech.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 border border-cyan-500/20 text-cyan-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Code Snippet Showcase */}
        <div className="glass-panel rounded-2xl border border-cyan-500/30 overflow-hidden shadow-2xl">
          {/* Terminal / Code Editor Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-black/70 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex items-center gap-2 pl-3 border-l border-white/10 text-xs font-mono text-gray-300">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{aiCodeSnippet.filename}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Code Container */}
          <div className="p-4 sm:p-5 bg-black/90 font-mono text-xs overflow-x-auto text-gray-300 max-h-[350px] leading-relaxed">
            <pre className="selection:bg-cyan-500/30">
              <code>{aiCodeSnippet.code}</code>
            </pre>
          </div>

          {/* Terminal Footer */}
          <div className="px-4 py-2 bg-black/60 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-gray-500">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SYNTAX: PHP 8.3 / LARAVEL 11 / OPENAI REASONING LOOP
            </span>
            <span className="hidden sm:inline">UTF-8 // CRLF // 5 ITERATIONS MAX</span>
          </div>
        </div>
      </div>
    </FloatingPanel>
  );
}
