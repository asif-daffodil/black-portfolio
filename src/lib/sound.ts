import { useSceneStore } from '@/store/useSceneStore';

class SoundFX {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private humGain: GainNode | null = null;
  private isHumPlaying: boolean = false;
  private humOscillators: (OscillatorNode | AudioBufferSourceNode)[] = [];
  private lastHoverTickTime: number = 0;
  private hasInitializedInteractions: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupAutoplayListener();
    }
  }

  /**
   * Browser autoplay policy compliance:
   * Waits for the user's very first interaction (click, touch, keydown)
   * to resume AudioContext and start the ambient space engine drone.
   */
  private setupAutoplayListener() {
    if (typeof window === 'undefined' || this.hasInitializedInteractions) return;

    const onFirstUserInteraction = () => {
      this.initContext();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().then(() => {
          const isMuted = useSceneStore.getState().isMuted;
          if (!isMuted) {
            this.startAmbientHum();
          }
        });
      } else {
        const isMuted = useSceneStore.getState().isMuted;
        if (!isMuted) {
          this.startAmbientHum();
        }
      }

      window.removeEventListener('pointerdown', onFirstUserInteraction);
      window.removeEventListener('click', onFirstUserInteraction);
      window.removeEventListener('keydown', onFirstUserInteraction);
      this.hasInitializedInteractions = true;
    };

    window.addEventListener('pointerdown', onFirstUserInteraction, { once: true });
    window.addEventListener('click', onFirstUserInteraction, { once: true });
    window.addEventListener('keydown', onFirstUserInteraction, { once: true });

    // Also subscribe to scene store mute changes
    useSceneStore.subscribe((state, prevState) => {
      if (state.isMuted !== prevState.isMuted) {
        this.syncMuteState(state.isMuted);
      }
    });
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // Master gain for smooth global muting/unmuting
        this.masterGain = this.ctx.createGain();
        const initialMuted = useSceneStore.getState().isMuted;
        this.masterGain.gain.setValueAtTime(initialMuted ? 0.0001 : 1.0, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    return this.ctx;
  }

  /**
   * Sync master gain with store mute state
   */
  public syncMuteState(isMuted: boolean) {
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    if (ctx.state === 'suspended' && !isMuted) {
      ctx.resume().then(() => {
        this.startAmbientHum();
      });
    }

    const now = ctx.currentTime;
    if (isMuted) {
      // Smooth fade to near silence
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
    } else {
      // Smooth fade back to full volume
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.0001), now);
      this.masterGain.gain.exponentialRampToValueAtTime(1.0, now + 0.25);
      if (!this.isHumPlaying) {
        this.startAmbientHum();
      }
    }
  }

  /**
   * 1. Low-frequency ambient engine hum / space drone (looping, very low volume)
   * Layered:
   * - Twin sub-bass sine oscillators (45Hz & 46.4Hz) creating a 1.4Hz binaural acoustic reactor pulse
   * - 90Hz harmonic triangle oscillator with lowpass filtering
   * - Filtered low-frequency pink/brown cabin air noise with slow LFO breathing
   */
  public startAmbientHum() {
    const isMuted = useSceneStore.getState().isMuted;
    if (isMuted || this.isHumPlaying) return;

    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => this.startAmbientHum());
      return;
    }

    try {
      const now = ctx.currentTime;

      // Master drone gain node (very low volume for subtle cinematic atmosphere)
      const humMaster = ctx.createGain();
      humMaster.gain.setValueAtTime(0.0001, now);
      humMaster.gain.exponentialRampToValueAtTime(0.048, now + 2.0); // 2s gentle fade-in
      humMaster.connect(this.masterGain);
      this.humGain = humMaster;

      const nodes: (OscillatorNode | AudioBufferSourceNode)[] = [];

      // Sub fundamental 1 (45Hz sine)
      const sub1 = ctx.createOscillator();
      const sub1Gain = ctx.createGain();
      sub1.type = 'sine';
      sub1.frequency.setValueAtTime(45.0, now);
      sub1Gain.gain.setValueAtTime(0.038, now);
      sub1.connect(sub1Gain);
      sub1Gain.connect(humMaster);
      sub1.start(now);
      nodes.push(sub1);

      // Sub fundamental 2 (46.4Hz sine) -> creates subtle 1.4Hz deep space engine throbbing
      const sub2 = ctx.createOscillator();
      const sub2Gain = ctx.createGain();
      sub2.type = 'sine';
      sub2.frequency.setValueAtTime(46.4, now);
      sub2Gain.gain.setValueAtTime(0.034, now);
      sub2.connect(sub2Gain);
      sub2Gain.connect(humMaster);
      sub2.start(now);
      nodes.push(sub2);

      // Mid harmonic (90Hz triangle) for warm ship reactor presence
      const mid = ctx.createOscillator();
      const midFilter = ctx.createBiquadFilter();
      const midGain = ctx.createGain();
      mid.type = 'triangle';
      mid.frequency.setValueAtTime(90.0, now);
      midFilter.type = 'lowpass';
      midFilter.frequency.setValueAtTime(130.0, now);
      midGain.gain.setValueAtTime(0.014, now);
      mid.connect(midFilter);
      midFilter.connect(midGain);
      midGain.connect(humMaster);
      mid.start(now);
      nodes.push(mid);

      // Cabin air rumble: 4-second looping pink/brown filtered noise buffer
      const bufferLength = ctx.sampleRate * 4;
      const noiseBuffer = ctx.createBuffer(1, bufferLength, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      let lastVal = 0.0;
      for (let i = 0; i < bufferLength; i++) {
        const white = Math.random() * 2 - 1;
        lastVal = (lastVal + 0.02 * white) / 1.02; // Brown noise approximation
        data[i] = lastVal * 3.5;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(115, now);
      noiseFilter.Q.setValueAtTime(1.8, now);

      // Slow 0.07Hz LFO modulating noise filter cutoff for breathing ship interior
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.07, now);
      lfoGain.gain.setValueAtTime(22, now);
      lfo.connect(lfoGain);
      lfoGain.connect(noiseFilter.frequency);
      lfo.start(now);
      nodes.push(lfo);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.020, now);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(humMaster);
      noiseSource.start(now);
      nodes.push(noiseSource);

      this.humOscillators = nodes;
      this.isHumPlaying = true;
    } catch {
      // Audio autoplay policy or context error
    }
  }

  public stopAmbientHum() {
    if (!this.isHumPlaying || !this.ctx || !this.humGain) return;
    try {
      const now = this.ctx.currentTime;
      this.humGain.gain.cancelScheduledValues(now);
      this.humGain.gain.setValueAtTime(this.humGain.gain.value, now);
      this.humGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      setTimeout(() => {
        this.humOscillators.forEach((node) => {
          try {
            if ('stop' in node) node.stop();
            node.disconnect();
          } catch {
            // node already stopped
          }
        });
        this.humOscillators = [];
        this.isHumPlaying = false;
      }, 420);
    } catch {
      this.isHumPlaying = false;
    }
  }

  /**
   * 2. Short "whoosh" sound synced with the camera transition from Prompt 2
   * Starts at transition start, sweeps up to midpoint warp, and smoothly fades out by arrival.
   */
  public playWhoosh(duration: number = 2.1) {
    const isMuted = useSceneStore.getState().isMuted;
    if (isMuted) return;

    try {
      const ctx = this.initContext();
      if (!ctx || !this.masterGain) return;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const midpoint = duration * 0.45;

      // ── Thruster Air/Plasma Noise Buffer ──
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.45; // Pink-ish noise
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      // Resonant sweep filter (starts low, rises at midpoint acceleration, eases down at arrival)
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(2.2, now);
      filter.frequency.setValueAtTime(130, now);
      filter.frequency.exponentialRampToValueAtTime(760, now + midpoint);
      filter.frequency.exponentialRampToValueAtTime(85, now + duration);

      // Volume envelope synced with camera acceleration and arrival
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.14, now + midpoint);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      // ── Sub Harmonic Warp Tone (Glides 110Hz -> 230Hz -> 60Hz) ──
      const warpOsc = ctx.createOscillator();
      const warpGain = ctx.createGain();
      warpOsc.type = 'sine';
      warpOsc.frequency.setValueAtTime(105, now);
      warpOsc.frequency.exponentialRampToValueAtTime(225, now + midpoint);
      warpOsc.frequency.exponentialRampToValueAtTime(58, now + duration);

      warpGain.gain.setValueAtTime(0.001, now);
      warpGain.gain.exponentialRampToValueAtTime(0.038, now + midpoint);
      warpGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      warpOsc.connect(warpGain);
      warpGain.connect(this.masterGain);

      whiteNoise.start(now);
      whiteNoise.stop(now + duration);
      warpOsc.start(now);
      warpOsc.stop(now + duration);
    } catch {
      // Audio playback failed
    }
  }

  /**
   * 3a. Subtle UI click/beep on console button press
   * Damped, premium aerospace tactile switch click (low volume, dual transient)
   */
  public playButtonClick() {
    const isMuted = useSceneStore.getState().isMuted;
    if (isMuted) return;

    try {
      const ctx = this.initContext();
      if (!ctx || !this.masterGain) return;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Primary crisp high click (1350Hz -> 360Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1350, now);
      osc.frequency.exponentialRampToValueAtTime(360, now + 0.035);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.035);

      // Low resonant chassis thump (160Hz -> 55Hz)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(160, now);
      subOsc.frequency.exponentialRampToValueAtTime(55, now + 0.045);

      subGain.gain.setValueAtTime(0.065, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      subOsc.connect(subGain);
      subGain.connect(this.masterGain);
      subOsc.start(now);
      subOsc.stop(now + 0.045);
    } catch {
      // Audio playback failed
    }
  }

  /**
   * 3b. Very quiet hover tick sound
   * Micro-transient electrostatic tick on console button hover (~12ms, high frequency, ultra low volume)
   */
  public playHoverTick() {
    const isMuted = useSceneStore.getState().isMuted;
    if (isMuted) return;

    const nowMs = Date.now();
    // Throttle protection: min 45ms between ticks for clean scrubbing
    if (nowMs - this.lastHoverTickTime < 45) return;
    this.lastHoverTickTime = nowMs;

    try {
      const ctx = this.initContext();
      if (!ctx || !this.masterGain) return;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const duration = 0.012;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(3400, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + duration);

      gain.gain.setValueAtTime(0.022, now); // Very quiet whisper of tactile feedback
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Ignore
    }
  }

  /**
   * Boot sequence telemetry diagnostic beep
   */
  public playBootBeep(pitch: number = 880, duration: number = 0.05) {
    const isMuted = useSceneStore.getState().isMuted;
    if (isMuted) return;

    try {
      const ctx = this.initContext();
      if (!ctx || !this.masterGain) return;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Ignore
    }
  }
}

export const soundFX = new SoundFX();
