/**
 * The roll code asks the running engagement what a roll may be made against (tracker-plan section 5.1)
 * through this hook, so the dice modules never import the tracker.
 */
import type { RollTarget } from './card.ts';

export interface EngagementOption {
  id: string;
  name: string;
  block: string | null;
  needs: number | null;
  parts: { id: string; name: string; block: string | null }[];
  decoys: { id: string; name: string; block: string | null; needs: number }[];
  openings: number;
  grounded: boolean;
  bonus: number;
  penalty: number;
  forSoldier: string | null;
}

export interface EngagementPick {
  combat: string;
  kind: 'titan' | 'foe';
  entry: string;
  options: EngagementOption[];
  grapple: boolean;
}

export type EngagementChoice = RollTarget;

type Fn = (actor: any, entry: any) => { pick: EngagementPick | null; block: string | null };

let fn: Fn = () => ({ pick: null, block: null });

export const setEngagementContext = (f: Fn) => (fn = f);
export const engagementContext: Fn = (actor, entry) => {
  try {
    return fn(actor, entry);
  } catch (err) {
    console.error('wings-of-freedom | the engagement could not check this roll', err);
    return { pick: null, block: null };
  }
};
