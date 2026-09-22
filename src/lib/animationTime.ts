/**
 * animationTime.ts — Shared stable animation clock for all 3D scene components.
 *
 * Problem this solves:
 *   Browsers throttle/suspend requestAnimationFrame when a tab is in the background.
 *   When the tab becomes visible again, the next frame receives a raw `delta` that can
 *   be seconds or minutes long (the full paused duration). Feeding that directly to
 *   starfield stream speed, nebula uTime, or rotation accumulators causes:
 *     - Foreground spores all jumping 100+ units → simultaneous mass-recycle "re-spawn" flash
 *     - Nebula/shader time jumping → discontinuous visual snap
 *     - Deep/mid star rotation jumping → perceived "teleport"
 *
 * Solution:
 *   1. Cap every frame's effective delta to MAX_DELTA (1/20 s = 50 ms).
 *      Even a 60-second gap only advances the animation clock by 50 ms — invisible.
 *   2. On `visibilitychange → visible`, discard the first frame's delta entirely
 *      (set it to 0), so the exact moment of return is also seamless.
 *   3. Accumulate a module-level `safeTime` counter with clamped deltas.
 *      All components share this counter and stay in sync.
 */

/** Maximum per-frame time step. Frames longer than this are clamped. */
export const MAX_DELTA = 1 / 20; // 50 ms

/** Accumulated animation time (seconds) — advanced each frame with clamped deltas. */
let _safeTime = 0;

/**
 * True when the tab just became visible again.
 * The next frame will discard its raw delta and apply 0 instead,
 * preventing any jump from the accumulated paused duration.
 */
let _skipNextDelta = false;

// Install a single, module-level visibilitychange listener.
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      _skipNextDelta = true;
    }
  });
}

/**
 * Advance the shared safe-time counter.
 * Call this ONCE per render frame (from the component that runs first — Starfield).
 * Returns the effective clamped delta that was actually applied.
 *
 * @param rawDelta  The raw `delta` received from useFrame / R3F's render loop.
 */
export function advanceSafeTime(rawDelta: number): number {
  let dt = rawDelta;
  if (_skipNextDelta) {
    dt = 0;
    _skipNextDelta = false;
  }
  const clamped = Math.min(Math.max(dt, 0), MAX_DELTA);
  _safeTime += clamped;
  return clamped;
}

/**
 * Read the current safe animation time without advancing it.
 * Use in any component whose useFrame runs after Starfield's.
 */
export function getSafeTime(): number {
  return _safeTime;
}
