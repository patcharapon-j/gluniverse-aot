/**
 * Token status effects bound to what the actor records (core-plan 2e). Pure: the WofActor document
 * turns the result into icons on the token and lit buttons in the Token HUD.
 *
 * - `field`: the status is a stored boolean; the HUD toggles that field.
 * - `derived`: the status follows other data (derived values, gear items, a carried comrade); the
 *   HUD cannot switch it, the sheet changes the data it follows.
 * - `engagement`: the running engagement records it (milestone 4: Grabbed, Engaged, a soldier's
 *   Held); the HUD cannot switch it, the tracker changes it.
 * - `manual`: nothing records it; the HUD adds or removes an ordinary Active Effect.
 */
export type StatusBinding = { kind: 'field'; path: string } | { kind: 'derived' } | { kind: 'engagement' } | { kind: 'manual' };

/** The statuses the Engagement tracker derives for soldiers and Squadmates, in display order. */
export const ENGAGEMENT_STATUSES = ['grabbed', 'engaged', 'held'] as const;

const PC_FIELDS: Record<string, string> = { down: 'system.down', pinned: 'system.pinned.active', airborne: 'system.airborne' };
const PC_DERIVED = new Set(['untreated-injury', 'jammed', 'overloaded', 'mounted', 'lame-horse', 'carrying', 'carried']);

export function statusBinding(actorType: string, statusId: string): StatusBinding {
  if (actorType === 'foe') return statusId === 'held' ? { kind: 'field', path: 'system.held' } : { kind: 'manual' };
  if (actorType === 'soldier' || actorType === 'squadmate') {
    if (PC_FIELDS[statusId]) return { kind: 'field', path: PC_FIELDS[statusId] };
    if (PC_DERIVED.has(statusId)) return { kind: 'derived' };
    if ((ENGAGEMENT_STATUSES as readonly string[]).includes(statusId)) return { kind: 'engagement' };
  }
  return { kind: 'manual' };
}

export interface StatusInputs {
  down?: boolean;
  pinned?: { active?: boolean };
  airborne?: boolean;
  carrying?: string;
  carried_by?: string;
  held?: boolean;
  derived?: { jammed?: boolean; overloaded?: boolean; lame?: boolean };
}

export interface StatusItem {
  type: string;
  system: { subtype?: string; mounted?: boolean; treated?: boolean };
}

/** The bound statuses (field and derived) the actor's data holds right now, in display order. */
export function boundStatuses(actorType: string, s: StatusInputs, items: Iterable<StatusItem>, engagement: readonly string[] = []): string[] {
  if (actorType === 'foe') return s.held ? ['held'] : [];
  if (actorType !== 'soldier' && actorType !== 'squadmate') return [];
  const list = [...items];
  const out: string[] = [];
  if (s.down) out.push('down');
  if (list.some((i) => i.type === 'critical-injury' && !i.system.treated)) out.push('untreated-injury');
  if (s.pinned?.active) out.push('pinned');
  if (s.airborne) out.push('airborne');
  if (s.derived?.jammed) out.push('jammed');
  if (s.derived?.overloaded) out.push('overloaded');
  if (list.some((i) => i.type === 'gear' && i.system.subtype === 'horse' && i.system.mounted)) out.push('mounted');
  if (s.derived?.lame) out.push('lame-horse');
  if (s.carrying) out.push('carrying');
  if (s.carried_by) out.push('carried');
  for (const id of ENGAGEMENT_STATUSES) if (engagement.includes(id)) out.push(id);
  return out;
}
