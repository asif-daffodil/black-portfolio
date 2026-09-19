'use client';

import { useSceneStore } from '@/store/useSceneStore';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioToggle() {
  const isMuted = useSceneStore((state) => state.isMuted);
  const toggleMute = useSceneStore((state) => state.toggleMute);

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#0d121f]/80 backdrop-blur-md border border-white/10 hover:border-cyan-500/50 text-gray-300 hover:text-white shadow-lg shadow-black/50 transition-all duration-200 group cursor-pointer"
      aria-label={isMuted ? 'Unmute cockpit audio' : 'Mute cockpit audio'}
      title={isMuted ? 'Audio Muted (Click to Unmute)' : 'Audio Enabled (Click to Mute)'}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
      ) : (
        <Volume2 className="w-5 h-5 text-cyan-400 animate-pulse transition-colors" />
      )}
    </button>
  );
}
