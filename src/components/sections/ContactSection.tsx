'use client';

import React, { useState } from 'react';
import { contactData } from '@/data/contact';
import FloatingPanel from '@/components/hud/FloatingPanel';
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Briefcase,
  Send,
  CheckCircle2,
  Radio,
  RadioReceiver,
  Signal,
} from 'lucide-react';
import { LinkedInIcon, GitHubIcon, FacebookIcon } from '@/components/icons/SocialIcons';
import { soundFX } from '@/lib/sound';

const CHANNEL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  MapPin,
  Mail,
  Phone,
  Globe,
  Briefcase,
};

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LinkedIn: LinkedInIcon,
  GitHub: GitHubIcon,
  Facebook: FacebookIcon,
  Upwork: Briefcase,
};

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [transmitting, setTransmitting] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playButtonClick();
    setTransmitting(true);

    setTimeout(() => {
      setTransmitting(false);
      setSubmitted(true);
      setFormState({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }, 800);
  };

  return (
    <FloatingPanel
      sectionId="contact"
      sectorCode="COM-08"
      sectorName="Hailing Frequencies & Comms Console"
      badge="Subspace Link Ready"
      maxWidth="max-w-6xl"
    >
      <div className="space-y-6">
        {/* Header Telemetry */}
        <div className="border-b border-white/10 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>Open Subspace Carrier // Sector 08</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {contactData.title}
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            {contactData.subtitle}
          </p>
        </div>

        {/* Main Grid: Left Comms Array + Right Transmission Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Telemetry Channels & Social Links */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Signal className="w-4 h-4" />
                  Primary Hailing Channels
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  ACTIVE
                </span>
              </div>

              {/* Frequencies List */}
              <div className="space-y-3">
                {contactData.frequencies.map((channel, idx) => {
                  const Icon = CHANNEL_ICONS[channel.icon || 'MapPin'] || MapPin;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-black/40 border border-white/10 hover:border-cyan-500/30 transition-all group flex items-start gap-3"
                    >
                      <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-mono text-gray-300 uppercase font-medium">
                            {channel.label}
                          </span>
                          <span className="text-[10px] font-mono text-cyan-300 font-bold">
                            {channel.callsign}
                          </span>
                        </div>
                        {channel.href ? (
                          <a
                            href={channel.href}
                            target={channel.href.startsWith('http') ? '_blank' : undefined}
                            rel={channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="text-xs font-medium text-white group-hover:text-cyan-300 transition-colors truncate block mt-0.5 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded"
                          >
                            {channel.value}
                          </a>
                        ) : (
                          <p className="text-xs font-medium text-white truncate mt-0.5">
                            {channel.value}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Social Channels with Frequencies */}
              <div className="pt-3 border-t border-white/10 space-y-2.5">
                <span className="text-xs font-mono text-gray-300 uppercase tracking-wider block font-bold">
                  Subspace Relay Arrays (Socials)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {contactData.socialFrequencies.map((social, idx) => {
                    const Icon = SOCIAL_ICONS[social.platform] || Globe;
                    return (
                      <a
                        key={idx}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-black/50 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/40 text-gray-200 hover:text-white transition-all group flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                        aria-label={`Connect via ${social.platform} frequency`}
                      >
                        <div className="p-1.5 rounded-lg bg-white/5 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                            {social.platform}
                          </div>
                          <div className="text-[10px] font-mono text-cyan-300 font-medium">
                            {social.frequencyCode}
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Transmission Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-white/10 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <RadioReceiver className="w-5 h-5 text-cyan-400" />
                    Transmit Direct Message
                  </h3>
                  <p className="text-[11px] font-mono text-gray-300 mt-0.5">
                    ENCRYPTION: 4096-BIT TLS // RESPONSE WINDOW &lt; 12 HOURS
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label
                      htmlFor="contact-name"
                      className="text-[11px] font-mono text-cyan-300 uppercase tracking-wider font-bold flex items-center gap-1.5"
                    >
                      <span>// Origin Callsign (Your Name)</span>
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      required
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      placeholder="e.g. Capt. Alex Mercer"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/70 border border-white/10 text-white placeholder-gray-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none transition-colors text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="contact-email"
                      className="text-[11px] font-mono text-cyan-300 uppercase tracking-wider font-bold flex items-center gap-1.5"
                    >
                      <span>// Return Frequency (Email)</span>
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      required
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                      placeholder="e.g. alex@starfleet.org"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/70 border border-white/10 text-white placeholder-gray-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none transition-colors text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="contact-subject"
                    className="text-[11px] font-mono text-cyan-300 uppercase tracking-wider font-bold flex items-center gap-1.5"
                  >
                    <span>// Transmission Directive (Subject)</span>
                  </label>
                  <input
                    type="text"
                    id="contact-subject"
                    value={formState.subject}
                    onChange={(e) =>
                      setFormState({ ...formState, subject: e.target.value })
                    }
                    placeholder="e.g. Enterprise Architecture Consulting / Next.js Migration..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/70 border border-white/10 text-white placeholder-gray-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none transition-colors text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="contact-message"
                    className="text-[11px] font-mono text-cyan-300 uppercase tracking-wider font-bold flex items-center gap-1.5"
                  >
                    <span>// Subspace Payload (Message)</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                    placeholder="State your operational requirements, mission timeframe, or project inquiry..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/70 border border-white/10 text-white placeholder-gray-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none transition-colors text-xs font-mono resize-none leading-relaxed"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="text-[11px] font-mono text-gray-300">
                    STATUS: READY TO DISPATCH
                  </span>

                  <button
                    type="submit"
                    disabled={transmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                  >
                    <Send className={`w-3.5 h-3.5 ${transmitting ? 'animate-spin' : ''}`} />
                    <span>{transmitting ? 'Transmitting...' : 'Dispatch Transmission'}</span>
                  </button>
                </div>

                {submitted && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-3 animate-fade-in"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>
                      Transmission confirmed: Subspace packet received. I will establish voice/data link shortly.
                    </span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </FloatingPanel>
  );
}
