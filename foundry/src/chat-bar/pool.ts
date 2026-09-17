/**
 * The chat bar's ad hoc dice pool (pure): the counts a user sets above the chat input, and the
 * roll card it posts. The card is an action card with no Action Catalog entry, so it draws, Pushes,
 * Covers, and Undoes like any other roll.
 */
import type { ActionCard } from '../dice/card.ts';
import type { DiceFaces, DieKind } from '../rules/roll.ts';

export const BAR_KINDS: readonly DieKind[] = ['base', 'gear', 'stress', 'titan'];

/** The most dice of one kind the bar rolls. */
export const MAX_PER_KIND = 20;

export type BarCounts = Record<DieKind, number>;

export const emptyCounts = (): BarCounts => ({ base: 0, gear: 0, stress: 0, titan: 0 });

export function stepCount(counts: BarCounts, kind: DieKind, delta: number): BarCounts {
  const n = Math.max(0, Math.min(MAX_PER_KIND, Math.trunc((counts[kind] ?? 0) + delta)));
  return { ...counts, [kind]: n };
}

export const poolSize = (counts: BarCounts): number => BAR_KINDS.reduce((n, k) => n + counts[k], 0);

/** Who the roll is for: the speaker's actor, when there is one. */
export interface BarRoller {
  uuid: string;
  name: string;
  img: string;
  type: string;
  /** The user owns the actor (a GM owns every one). */
  owned: boolean;
}

/**
 * Push follows the usual rules only for an owned Soldier's roll (a Squadmate never Pushes; the GM's
 * client Pushes only a Soldier's card). Stress Responses need a Soldier or a Squadmate to roll on.
 */
export function barRules(roller: BarRoller | null): { pushAllowed: boolean; responses: boolean } {
  const soldier = !!roller?.owned && roller.type === 'soldier';
  const responses = !!roller?.owned && (roller.type === 'soldier' || roller.type === 'squadmate');
  return { pushAllowed: soldier, responses };
}

export function barCard(p: {
  counts: BarCounts;
  dice: DiceFaces;
  titan: number[];
  roller: BarRoller | null;
  fallback: { name: string; img: string };
  label: { name: string; gear: string; why: string };
  time: string;
}): ActionCard {
  const rules = barRules(p.roller);
  const actor = p.roller?.owned ? p.roller : null;
  return {
    v: 1,
    kind: 'action',
    actor: actor?.uuid ?? '',
    actorName: p.roller?.name ?? p.fallback.name,
    img: p.roller?.img ?? p.fallback.img,
    time: p.time,
    ops: [],
    entry: '',
    name: p.label.name,
    attribute: null,
    called: false,
    stakes: null,
    circumstances: null,
    needs: null,
    passive: false,
    pool: {
      attribute: null,
      talent: null,
      bonus: p.counts.base,
      removed: { bonus: 0, talent: 0, attribute: 0 },
      base: p.counts.base,
      gear: p.counts.gear ? { itemId: '', name: p.label.gear, dice: p.counts.gear } : null,
      stress: p.counts.stress,
      why: p.label.why,
    },
    dice: p.dice,
    fresh: -1,
    pushes: 0,
    maxPushes: 1,
    pushAllowed: rules.pushAllowed,
    coverAllowed: rules.pushAllowed,
    responses: rules.responses,
    cover: null,
    response: null,
    attack: null,
    injury: null,
    call: null,
    titan: p.titan,
  };
}
