/**
 * The one set of motion tokens every animated part of the system reads (ADR-0027): subtle,
 * weighty, quick. Durations in ms; eases are anime.js v4 names.
 */
export const MOTION = Object.freeze({
  quick: 120,
  base: 240,
  weighty: 450,
  /** Reduced motion keeps opacity and colour only, and never runs longer than this. */
  reducedMax: 160,
  ease: 'outQuart',
  settle: 'outBack(1.7)',
  jolt: 'inOutSine',
  stagger: 30,
  /** The loop length of the silhouette's steam and drip (CSS), when motion is Full. */
  loop: 2200,
  colors: {
    harm: '#8e2323',
    relief: '#2f4a6e',
    ok: '#3f6146',
    notice: '#b0842f',
  },
});

export type MotionMode = 'full' | 'reduced' | 'off';
export type GoreLevel = 'low' | 'standard' | 'graphic';
