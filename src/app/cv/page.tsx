import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Curriculum Vitae | Asif Mohammad Abir',
  description: 'Zend Certified PHP Engineer & Full-Stack Architect CV / Resume.',
};

export default function CvPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-[#070b14]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-cyan-300 hover:text-white border border-white/10 transition-colors"
          >
            ← Back to Portfolio
          </Link>
          <span className="hidden sm:inline text-xs font-mono text-gray-400">
            Asif Mohammad Abir · Professional CV
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/resume.pdf"
            download="CV of Asif Mohammad Abir.pdf"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            <span>📥 Download PDF</span>
          </a>
          <a
            href="/cv.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-mono font-medium border border-white/20 transition-all"
          >
            <span>🖨️ Web Print View</span>
          </a>
        </div>
      </header>

      {/* Main Content Area: Embed cv.html */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-2 sm:p-6 flex flex-col">
        <div className="w-full flex-1 min-h-[900px] rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-white">
          <iframe
            src="/cv.html"
            title="Curriculum Vitae of Asif Mohammad Abir"
            className="w-full h-full min-h-[900px] border-0"
          />
        </div>
      </main>
    </div>
  );
}
