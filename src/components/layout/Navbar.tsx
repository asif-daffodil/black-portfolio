'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSceneStore, SectionId } from '@/store/useSceneStore';
import { Download, Menu, X } from 'lucide-react';
import { soundFX } from '@/lib/sound';

interface NavItem {
  id: SectionId;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'bridge', label: 'Home', href: '#bridge' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'experience', label: 'Experience', href: '#experience' },
  { id: 'education', label: 'Education', href: '#education' },
  { id: 'ai', label: 'AI Work', href: '#ai' },
  { id: 'portfolio', label: 'Portfolio', href: '#portfolio' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeSection = useSceneStore((state) => state.activeSection);
  const setSection = useSceneStore((state) => state.setSection);
  const viewMode = useSceneStore((state) => state.viewMode);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, id: SectionId) => {
    soundFX.playButtonClick();
    setSection(id);
    setMobileMenuOpen(false);

    if (viewMode === 'classic') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      e.preventDefault();
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0c14]/90 backdrop-blur-md border-b border-white/10 shadow-lg py-2.5'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Avatar */}
        <a
          href="#bridge"
          onClick={(e) => handleNavClick(e, 'bridge')}
          className="flex items-center gap-3 group cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-xl"
        >
          <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-cyan-500/50 group-hover:border-cyan-400 transition-colors">
            <Image
              src="/images/asif.jpg"
              alt=""
              fill
              sizes="36px"
              className="object-cover"
              priority
            />
          </div>
          <div>
            <span className="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              Asif Abir
            </span>
            <span className="block text-[11px] font-mono text-cyan-300">
              Zend Certified PHP Engineer
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav
          className="hidden lg:flex items-center gap-1 bg-[#0c101c]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-500/20 shadow-lg shadow-cyan-950/30"
          aria-label="Main Navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`relative px-3.5 py-1 text-xs font-mono font-medium rounded-full transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-500/20 border border-cyan-500/40 font-bold shadow-inner'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="/images/CV of Asif Mohammadd Abir.pdf"
            download
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
            aria-label="Download CV of Asif Abir in PDF format"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CV</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none cursor-pointer"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c0e18]/95 backdrop-blur-xl border-b border-white/10 px-4 pt-3 pb-6 space-y-1.5 font-mono">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.id)}
              className={`block px-4 py-2 rounded-lg text-xs sm:text-sm font-medium focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                activeSection === item.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.label}
            </a>
          ))}
          <div className="pt-2">
            <a
              href="/images/CV of Asif Mohammadd Abir.pdf"
              download
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CV</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
