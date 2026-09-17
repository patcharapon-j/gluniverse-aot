/**
 * The steam and fall rolls the tracker makes (data/engagement/titan-harm.yaml, steam; data/gear/falls.yaml).
 * Each is a fixed D6 shown with Dice So Nice when present; its damage is written through the step's
 * recorder, so the step's Undo takes it back. A Critical Injury the damage inflicts at 0 current Health
 * is rolled as any other (results.ts, gainOn).
 */
import { damageSoldier, fallBand, fallDamage, referenceLabel, steamDamage, type Band } from '../rules/engagement/harm-rolls.ts';
import { focusLabels } from '../rules/engagement/positions.ts';
import type { Position } from '../rules/engagement/types.ts';
import { showDice } from '../dice/terms.ts';
import { tr } from './notes.ts';
import type { Recorder } from './recorder.ts';
import { E, snapshot, titanActor } from './snapshot.ts';

async function d6(): Promise<number> {
  const roll = await new foundry.dice.Roll('1d6').evaluate();
  await showDice(roll);
  return roll.total as number;
}

/** Damage on a soldier, read through the recorder's pending values (health.yaml, harm_kinds, damage). */
async function damage(combat: any, actor: any, amount: number, type: string, rec: Recorder): Promise<void> {
  if (amount <= 0) return;
  const lost = rec.get(actor, 'system.health_lost') as number;
  const already = lost - (actor._source.system.health_lost as number);
  const current = Math.max(0, (actor.system.derived.current_health as number) - already);
  const r = damageSoldier(lost, current, amount);
  rec.set(actor, 'system.health_lost', r.lost);
  if (r.injury) {
    const { gainOn } = await import('./results.ts');
    await gainOn(combat, actor, { location: 'rolled', type, cannotBeLethal: false, net: 0 }, rec);
  }
}

/** Every named soldier rolls on the steam table (steam, roll) and takes its damage, of Injury Type Burn. */
export async function rollSteam(combat: any, ids: readonly string[], rec: Recorder): Promise<void> {
  const steam = E().steam;
  for (const id of ids) {
    const actor = game.actors.get(id);
    if (!actor || actor.statuses?.has?.('dead')) continue;
    const face = await d6();
    const n = steamDamage(steam.rows, face);
    rec.line(tr('harm.steam', { name: actor.name, face, n }));
    await damage(combat, actor, n, steam.type, rec);
  }
}

export interface FallInput {
  /** The soldier's Positions when they fell. */
  positions: Record<string, Position>;
  /** The label of the Titan whose card, Grab, or effect caused the fall. */
  causing: string | null;
  band?: Band | null;
}

/** A fall (falls.yaml, procedure): the band, D6 plus its adds, and the damage, of Injury Type Crush. */
export async function rollFall(combat: any, actor: any, x: FallInput, rec: Recorder): Promise<void> {
  if (!actor || actor.statuses?.has?.('dead')) return;
  const snap = snapshot(combat);
  const labels = focusLabels(snap.titans);
  const ref = referenceLabel(x.positions, labels.length ? labels : x.causing ? [x.causing] : [], x.causing);
  const row = ref ? snap.titans.find((t) => t.label === ref) : null;
  const size = row ? (titanActor(combat, row.key)?.system.size_class ?? null) : null;
  const band = fallBand({ position: ref ? (x.positions[ref] ?? null) : null, anchor: combat.system.anchor, referenceSize: size, named: x.band ?? null });
  const falls = E().falls;
  const face = await d6();
  const n = fallDamage(falls.rows, falls.bands, band, face);
  rec.line(tr('harm.fall', { name: actor.name, band: tr(`harm.band.${band}`), face, adds: falls.bands[band], n }));
  await damage(combat, actor, n, falls.type, rec);
}
