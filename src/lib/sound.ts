import { useSceneStore } from '@/store/useSceneStore';

class SoundFX {
  private ctx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    return this.ctx;
  }

  playButtonClick() {
    const isMuted = useSceneStore.getState().isMuted;
    if (isMuted) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Primary crisp high click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);

      // Low resonant sub click
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();

      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(240, now);
      subOsc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      subGain.gain.setValueAtTime(0.12, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);

      subOsc.start(now);
      subOsc.stop(now + 0.08);
    } catch {
      // Audio playback failed or blocked by browser policy
    }
  }

  playBootBeep(pitch: number = 880, duration: number = 0.05) {
    const isMuted = useSceneStore.getState().isMuted;
    if (isMuted) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Ignore
    }
  }

  playWhoosh() {
    const isMuted = useSceneStore.getState().isMuted;
    if (isMuted) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const duration = 0.65;

      // Create white noise buffer
      const bufferSize = ctx.sampleRate * duration;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      // Low-pass filter simulating air/thruster whoosh
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, now);
      filter.frequency.exponentialRampToValueAtTime(580, now + duration * 0.4);
      filter.frequency.exponentialRampToValueAtTime(80, now + duration);

      // Volume envelope with smooth swell
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.16, now + duration * 0.35);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + duration);
    } catch {
      // Ignore
    }
  }
}

export const soundFX = new SoundFX();
