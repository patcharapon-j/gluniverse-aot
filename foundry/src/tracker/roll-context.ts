/**
 * What the running engagement says about a roll (tracker-plan section 5.1): which Titan or Foe it can
 * be made against, the Body Parts, decoys, Openings, and needs, and why it cannot be made at all.
 */
import { breakFreeNeeds } from '../rules/engagement/grab.ts';
import { grabbedIn } from '../rules/engagement/guard.ts';
import { breakAttentionTerrainDice } from '../rules/engagement/momentum.ts';
import { bodyPartStrikeBlock, breakAttentionBlock, breakAttentionNeeds, napeStrikeBlock, spendableOpenings, type DecoyId } from '../rules/engagement/strikes.ts';
import { currentEngagement } from './combat.ts';
import { tr } from './notes.ts';
import { E, partsOf, ratingOf, snapshot, titanActor } from './snapshot.ts';

export interface TargetOption {
  id: string;
  name: string;
  block: string | null;
  needs: number | null;
  parts: { id: string; name: string; block: string | null }[];
  decoys: { id: string; name: string; block: string | null; needs: number }[];
  /** Openings this soldier may spend (a Nape strike). */
  openings: number;
  grounded: boolean;
  /** Bonus Dice the situation gives (the Ambush). */
  bonus: number;
  /** Penalty dice (Break Free once lifted). */
  penalty: number;
  forSoldier: string | null;
}

export interface RollPick {
  combat: string;
  kind: 'titan' | 'foe';
  entry: string;
  options: TargetOption[];
  grapple: boolean;
}

const TITAN_ENTRIES = ['nape-strike', 'body-part-strike', 'break-attention', 'break-free'];
const NEEDS_POSITION = [...TITAN_ENTRIES, 'draw-attention', 'read'];

const text = (key: string | null) => (key ? tr(`block.${key}`) : null);

export function rollContext(actor: any, entry: any): { pick: RollPick | null; block: string | null } {
  const combat = currentEngagement();
  if (!combat || !combat.system.soldiers.includes(actor.id)) return { pick: null, block: null };
  const snap = snapshot(combat);
  const s = snap.soldiers.find((x) => x.id === actor.id)!;
  const grabbed = grabbedIn(snap)(s.id);
  const kind = entry.kind as string;
  if (snap.mode === 'titan') {
    if (grabbed && (kind === 'action' || kind === 'reaction') && entry.id !== 'break-free') return { pick: null, block: text('grabbedOnly') };
    if (s.left && NEEDS_POSITION.includes(entry.id)) return { pick: null, block: text('noPosition') };
    if (!TITAN_ENTRIES.includes(entry.id)) return { pick: null, block: null };
    const focus = snap.titans.filter((t) => t.status === 'focus');
    const options = focus.map((t) => titanOption(combat, snap, s, t, entry.id, grabbed)).filter((o): o is TargetOption => !!o);
    if (!options.length) return { pick: null, block: text(entry.id === 'break-free' ? 'notGrabbed' : 'noTitan') };
    const open = options.filter((o) => !o.block);
    if (!open.length) return { pick: null, block: options[0].block };
    return { pick: { combat: combat.id, kind: 'titan', entry: entry.id, options: open, grapple: false }, block: null };
  }
  if (entry.id !== 'fight' && entry.id !== 'shoot') return { pick: null, block: null };
  return { pick: foePick(combat, snap, s, entry.id), block: null };
}

function titanOption(combat: any, snap: any, s: any, t: any, entryId: string, grabbed: boolean): TargetOption | null {
  const actor = titanActor(combat, t.key);
  if (!actor) return null;
  const sys = actor.system;
  const base: TargetOption = { id: t.key, name: `${t.label} ${actor.name}`, block: null, needs: null, parts: [], decoys: [], openings: 0, grounded: t.grounded, bonus: 0, penalty: 0, forSoldier: null };
  const ctx = { soldier: s, titan: t, grabbed, retreat: snap.retreat };
  const hidden = sys.abnormal && !sys.hidden_until_read?.nape_depth;
  switch (entryId) {
    case 'nape-strike':
      return { ...base, block: text(napeStrikeBlock(ctx)), needs: hidden ? null : sys.nape_depth, openings: spendableOpenings(sys.toObject().openings_by ?? [], s.id) };
    case 'body-part-strike': {
      const strikeFrom = Object.fromEntries((CONFIG.WOF.bodyPartKinds as { id: string; strikeFrom: string[] }[]).map((k) => [k.id, k.strikeFrom]));
      const row = combat.system.titans.find((r: any) => r.key === t.key);
      const parts = partsOf(actor).map((p) => ({
        id: p.id,
        name: `${game.i18n.localize(`WOF.BodyPart.${p.id}`)}: ${game.i18n.localize(`WOF.BodyPartState.${p.state}`)}`,
        block: text(bodyPartStrikeBlock({ ...ctx, parts: partsOf(actor), partId: p.id, strikeFrom, grab: t.grab, holdingReach: E().holdingArmReach, clearTheHand: !!row?.clearTheHand })),
      }));
      const open = parts.filter((p) => !p.block);
      return { ...base, parts, block: open.length ? null : (parts[0]?.block ?? text('noPart')), needs: 1 };
    }
    case 'break-attention': {
      const cloakThrown = snap.cloaks.includes(s.id);
      const eyesBroken = partsOf(actor).some((p) => p.kind === 'eyes' && p.state === 'broken');
      const horse = [...game.actors.get(s.id).items].find((i: any) => i.type === 'gear' && i.system.subtype === 'horse');
      const horseReady = !!horse && horse.system.current > 0;
      const decoys = E().breakAttention.decoys.map((d) => ({
        id: d.id,
        name: d.name,
        block: text(breakAttentionBlock({ ...ctx, decoy: d.id as DecoyId, eyesBroken, cloakThrown, horseReady })),
        needs: breakAttentionNeeds(t, s.id, d.id as DecoyId, E().breakAttention.needs),
      }));
      const open = decoys.filter((d) => !d.block);
      // The Open Terrain Trait of the soldier's own zone: a mounted soldier's Break Attention gains 1
      // Bonus Die (anchor-ratings.yaml, ratings, terrain_trait; bonus-dice-sources.yaml, terrain-trait; 16-5).
      const terrain = breakAttentionTerrainDice(s, snap.field, ratingOf);
      return { ...base, decoys, block: open.length ? null : decoys[0].block, needs: open[0]?.needs ?? null, bonus: terrain };
    }
    case 'break-free': {
      if (t.grab?.soldier === s.id) {
        const n = breakFreeNeeds(t.grab, E().breakFree);
        return { ...base, needs: n.needs, penalty: n.penalty, block: s.down ? text('down') : null };
      }
      // Pry Loose: on a Grabbed comrade's behalf, from On Body relative to the holding Titan.
      const pry = [...game.actors.get(s.id).items].some((i: any) => i.type === 'talent' && i.system.talent_id === 'pry-loose' && i.system.level > 0);
      if (!t.grab || !pry || grabbed) return null;
      if (s.positions[t.label] !== 'on-body') return { ...base, block: text('pryReach') };
      const n = breakFreeNeeds(t.grab, E().breakFree);
      return { ...base, name: `${base.name}: ${game.actors.get(t.grab.soldier)?.name ?? ''}`, needs: n.needs, penalty: n.penalty, forSoldier: t.grab.soldier };
    }
  }
  return null;
}

function foePick(combat: any, snap: any, s: any, entryId: string): RollPick {
  const sys = combat.system;
  const scene = combat.scene;
  const held = (sys.skirmish.holds as any[]).find((h) => h.soldier === s.id)?.foe ?? null;
  const ambush = sys.skirmish.ambush === 'squad' && combat.round === 1;
  const options: TargetOption[] = (sys.skirmish.foes as string[])
    .map((id, i) => {
      const tok = scene?.tokens.get(id);
      if (!tok?.actor || tok.actor.system.out || sys.skirmish.left.includes(id)) return null;
      const engaged = (sys.skirmish.engaged as any[]).some((e) => e.soldier === s.id && e.foe === id);
      let block: string | null = null;
      if (held && held !== id) block = text('holdingOther');
      else if (entryId === 'fight' && !engaged) block = text('notEngaged');
      else if (entryId === 'shoot' && held) block = text('holdingShoot');
      return { id, name: `${i + 1}. ${tok.name}`, block, needs: 1, parts: [], decoys: [], openings: 0, grounded: false, bonus: ambush && !sys.skirmish.acted.includes('foes') ? E().bonus.ambush : 0, penalty: 0, forSoldier: null } as TargetOption;
    })
    .filter((o): o is TargetOption => !!o);
  return { combat: combat.id, kind: 'foe', entry: entryId, options, grapple: entryId === 'fight' };
}
