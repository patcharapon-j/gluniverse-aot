/**
 * Fear Rolls the Titan Engagement causes, rolled by the active GM's client (data/mind/fear-rolls.yaml;
 * data/engagement/engagement-flow.yaml, witnesses). Each roll posts the ordinary Fear card, whose
 * results apply as the Fear category says and carry the card's own Undo; a tracker step that caused
 * the rolls records the cards, so its Undo takes them back too.
 */
import { fearPlan, type FearEvent, type FearSoldier } from '../rules/engagement/fear.ts';
import { actorPool } from '../dice/actor-pool.ts';
import { rollFear } from '../dice/tables.ts';
import { postNote, tr } from './notes.ts';
import type { Recorder } from './recorder.ts';
import { snapshot, soldierActors } from './snapshot.ts';

const fearSoldier = (actor: any, base: ReturnType<typeof snapshot>['soldiers'][number]): FearSoldier => ({
  ...base,
  faced: !!actor.system.faced_a_titan,
  numb: (actor.system.scars ?? []).some((x: any) => x.row === 'numb'),
});

/** Deaths the tracker marks itself, so the dead-status hook does not roll for them a second time. */
export const trackerDeaths = new Set<string>();

/**
 * Rolls every Fear Roll one event causes, from one snapshot taken now that the event is resolved
 * (limits, timing): each roller's Stress and Resolve are read before any roll's result applies.
 */
export async function fearRolls(combat: any, event: FearEvent, rec: Recorder | null): Promise<void> {
  if (combat?.system?.mode !== 'titan' || combat.system.step === 'closing') return;
  if (rec) await rec.commit();
  const snap = snapshot(combat);
  const actors = new Map(soldierActors(combat).map((a: any) => [a.id, a]));
  const soldiers = snap.soldiers.map((s) => fearSoldier(actors.get(s.id), s));
  const plan = fearPlan(soldiers, snap.titans, event);
  for (const id of plan.faced) {
    const a = actors.get(id);
    if (!a || a.system.faced_a_titan) continue;
    if (rec) rec.set(a, 'system.faced_a_titan', true);
    else await a.update({ 'system.faced_a_titan': true });
  }
  if (rec) await rec.commit();
  if (!plan.rollers.length) return;
  const frozen = plan.rollers.map((r) => {
    const ap = actorPool(actors.get(r.id));
    return { ...r, stress: ap.stress, resolve: ap.resolve };
  });
  const names: string[] = [];
  for (const r of frozen) {
    const actor = actors.get(r.id);
    const message = await rollFear(actor, { trigger: r.trigger, stress: r.stress, resolve: r.resolve });
    if (!message) continue;
    names.push(actor.name);
    if (rec) rec.message(message.id);
  }
  const line = tr('fear.rolled', { who: names.join(', ') || tr('none') });
  if (rec) rec.line(line);
  else await postNote({ title: tr('fear.title'), lines: [line], round: combat.round });
}

/** A soldier marked dead by hand (a Death Roll, the sheet) during a Titan Engagement: the witnesses roll. */
export async function onDeadStatus(combat: any, actor: any): Promise<void> {
  if (!combat || trackerDeaths.delete(actor.id)) return;
  if (!(combat.system.soldiers as string[]).includes(actor.id)) return;
  await fearRolls(combat, { kind: 'dies', soldier: actor.id }, null);
}
