/**
 * The steam and fall rolls the tracker asks for (data/engagement/titan-harm.yaml, steam;
 * data/gear/falls.yaml). Neither is rolled by whichever client triggered the step any more: each
 * posts a prompt card (src/dice/prompt.ts) that names what is happening, why, and to whom, and the
 * soldier's own owner throws the D6 from their own client. The damage is applied by the active GM's
 * client, in the prompt's own small transaction, so the step that caused it never waits on a player
 * (the reasoning is written at the top of prompt.ts). A Critical Injury the damage inflicts at 0
 * current Health is asked for the same way (results.ts, gainOn).
 */
import { damageSoldier, fallBand, fallDamage, referenceBody, steamDamage, type Band } from '../rules/engagement/harm-rolls.ts';
import { derivePosition, type Attachment, type ZoneId } from '../rules/engagement/zones.ts';
import { postPrompt, registerPromptResolver, type PromptResolver } from '../dice/prompt.ts';
import { tr } from './notes.ts';
import { Recorder } from './recorder.ts';
import { E, snapshot, titanActor } from './snapshot.ts';

/** What a soldier still has, as the prompt card shows it beside their name. */
export function healthLine(actor: any): string {
  const current = Math.max(0, Number(actor.system.derived?.current_health ?? 0));
  const full = Number(actor.system.derived?.health ?? actor.system.health ?? current);
  return tr('prompt.health', { current, full });
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

// ---------------------------------------------------------------- steam

/** Why the steam is scalding, in the words the card shows (titan-harm.yaml, steam, triggers). */
export interface SteamCause {
  trigger: 'kill' | 'regeneration-fill';
  /** The Focus Titan's board label. */
  label: string;
  /** The Titan's token key, so the card can carry its name and portrait. */
  key?: string;
}

/**
 * Every named soldier is asked for their own D6 on the steam table (steam, roll), of Injury Type
 * Burn. One card names the cause and lists everyone it scalds with their current Health.
 */
export async function rollSteam(combat: any, ids: readonly string[], rec: Recorder, cause?: SteamCause): Promise<void> {
  const asked = [...ids].map((id) => game.actors.get(id)).filter((a) => a && !a.statuses?.has?.('dead'));
  if (!asked.length) {
    rec.line(tr('harm.steamNone'));
    return;
  }
  const label = cause?.label ?? '';
  const titan = cause?.key ? titanActor(combat, cause.key) : null;
  const message = await postPrompt({
    ask: 'steam',
    combat: combat.id,
    title: tr('prompt.steamTitle', { label }),
    cause: tr(cause?.trigger === 'regeneration-fill' ? 'prompt.steamRegen' : 'prompt.steamDeath', { label, name: titan?.name ?? label }),
    rolls: tr('prompt.steamRolls'),
    asked: asked.map((actor) => ({ actor, detail: healthLine(actor) })),
    data: { type: E().steam.type },
    speaker: titan ?? asked[0],
  });
  if (message) rec.message(message.id);
  rec.line(tr('harm.steamAsked', { who: asked.map((a) => a.name).join(', ') }));
}

const steamResolver: PromptResolver = {
  dice: 1,
  async apply(ctx, roll) {
    const combat = game.combats.get(ctx.card.combat);
    const actor = await foundry.utils.fromUuid(ctx.entry.actor);
    const face = roll.faces?.[0] ?? 1;
    if (!combat || !actor) return null;
    const steam = E().steam;
    const n = steamDamage(steam.rows, face);
    const rec = new Recorder();
    await damage(combat, actor, n, String(ctx.card.data.type ?? steam.type), rec);
    await rec.commit();
    return { line: [tr('harm.steam', { name: actor.name, face, n }), ...rec.lines].join(' '), ops: rec.ops };
  },
};

// ---------------------------------------------------------------- falls

export interface FallInput {
  /** The soldier's attachment and zone when they fell (falls.yaml, height; 16-22). */
  attachment: Attachment;
  zone: ZoneId | null;
  /** The label of the Titan whose card, Grab, or effect caused the fall. */
  causing: string | null;
  band?: Band | null;
}

/**
 * A fall (falls.yaml, procedure): the band is worked out now, from the Positions the soldier fell
 * from, and the soldier's own owner rolls the D6 and its adds. Damage is of Injury Type Crush.
 */
export async function rollFall(combat: any, actor: any, x: FallInput, rec: Recorder): Promise<void> {
  if (!actor || actor.statuses?.has?.('dead')) return;
  const snap = snapshot(combat);
  const ref = referenceBody(x.attachment, x.causing, x.zone, snap.titans, snap.field);
  const row = ref ? snap.titans.find((t) => t.label === ref) : null;
  const size = row ? (titanActor(combat, row.key)?.system.size_class ?? null) : null;
  // The band reads the soldier's Position relative to the reference body as they fell, and the Giant
  // Forest raise reads the zone they fall in.
  const position = row ? (derivePosition({ zone: x.zone, attachment: x.attachment, alive: true, left: false }, row) ?? null) : null;
  const zoneRating = snap.field && x.zone !== null ? (snap.field.zones.find((z) => z.n === x.zone)?.rating ?? null) : null;
  const band = fallBand({ position, anchor: zoneRating, referenceSize: size, named: x.band ?? null });
  const bandName = tr(`harm.band.${band}`);
  const message = await postPrompt({
    ask: 'fall',
    combat: combat.id,
    title: tr('prompt.fallTitle', { name: actor.name }),
    cause: tr('prompt.fallCause', { name: actor.name, band: bandName, label: x.causing ?? ref ?? '' }),
    rolls: tr('prompt.fallRolls', { adds: E().falls.bands[band] }),
    asked: [{ actor, detail: `${healthLine(actor)} · ${bandName}` }],
    data: { band },
    speaker: actor,
  });
  if (message) rec.message(message.id);
  rec.line(tr('harm.fallAsked', { name: actor.name, band: bandName }));
}

const fallResolver: PromptResolver = {
  dice: 1,
  async apply(ctx, roll) {
    const combat = game.combats.get(ctx.card.combat);
    const actor = await foundry.utils.fromUuid(ctx.entry.actor);
    const face = roll.faces?.[0] ?? 1;
    if (!combat || !actor) return null;
    const falls = E().falls;
    const band = (ctx.card.data.band as Band) ?? 'low';
    const n = fallDamage(falls.rows, falls.bands, band, face);
    const rec = new Recorder();
    await damage(combat, actor, n, falls.type, rec);
    await rec.commit();
    return { line: [tr('harm.fall', { name: actor.name, band: tr(`harm.band.${band}`), face, adds: falls.bands[band], n }), ...rec.lines].join(' '), ops: rec.ops };
  },
};

/** Registered with the rest of the tracker's prompts (requests.ts). */
export function registerHarmPrompts(): void {
  registerPromptResolver('steam', steamResolver);
  registerPromptResolver('fall', fallResolver);
}
