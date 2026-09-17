/**
 * Prototype Token defaults per Actor type. Pure data (no Foundry globals), so the pack build and the
 * client use the same values. Numbers are Foundry's CONST values: dispositions (-1 hostile, 1
 * friendly), display modes (0 none, 30 owner hover, 40 owner, 50 always).
 */
export type ActorType = 'soldier' | 'squadmate' | 'titan' | 'foe';

const DISPLAY = { NONE: 0, OWNER_HOVER: 30, OWNER: 40, ALWAYS: 50 } as const;
const DISPOSITION = { HOSTILE: -1, FRIENDLY: 1 } as const;

/** A Titan's token footprint in grid squares (1 m each), by Size Class. */
export const TITAN_TOKEN_SIZE: Record<string, number> = { small: 2, medium: 3, large: 4 };

/**
 * Soldiers and Squadmates are linked and show their Health bar to their owners; Foes are unlinked
 * copies whose Health bar only the GM sees; a Titan shows no bar, since no single value tracks it
 * (its Body Parts each have a state and count; data/engagement/titan-harm.yaml).
 */
export function prototypeTokenDefaults(type: ActorType, opts: { sizeClass?: string } = {}): Record<string, unknown> {
  const healthBar = { bar1: { attribute: 'health_bar' }, bar2: { attribute: null } };
  switch (type) {
    case 'soldier':
      return { actorLink: true, disposition: DISPOSITION.FRIENDLY, displayName: DISPLAY.OWNER_HOVER, displayBars: DISPLAY.OWNER_HOVER, sight: { enabled: true }, ...healthBar };
    case 'squadmate':
      return { actorLink: true, disposition: DISPOSITION.FRIENDLY, displayName: DISPLAY.OWNER_HOVER, displayBars: DISPLAY.OWNER_HOVER, sight: { enabled: true }, ...healthBar };
    case 'foe':
      return { actorLink: false, appendNumber: true, disposition: DISPOSITION.HOSTILE, displayName: DISPLAY.OWNER_HOVER, displayBars: DISPLAY.OWNER, ...healthBar };
    case 'titan': {
      const size = TITAN_TOKEN_SIZE[opts.sizeClass ?? 'medium'] ?? 3;
      return {
        actorLink: false,
        appendNumber: true,
        disposition: DISPOSITION.HOSTILE,
        displayName: DISPLAY.ALWAYS,
        displayBars: DISPLAY.NONE,
        width: size,
        height: size,
        bar1: { attribute: null },
        bar2: { attribute: null },
      };
    }
  }
}
