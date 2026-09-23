/**
 * The status tags on the name row of a Dossier header (sheet-overhaul plan, 6 and 12.2). Standing
 * or Down and Airborne are toggles on the same fields as the band's Down stamp and the Kit tab's
 * Airborne box; every other tag reads the state.
 */
import { t } from './context.ts';
import { icon, type SoldierView } from './soldier-view.ts';

export interface HeaderTag {
  cls: string;
  text: string;
  tip?: string;
  img?: string;
  /** A tag that toggles a field when clicked. */
  toggle?: 'down' | 'airborne';
  pressed?: boolean;
  disabled?: boolean;
}

/** Down, or Standing: the first tag of every header. */
function downTag(view: SoldierView): HeaderTag {
  const s = view.system;
  const d = view.derived;
  const tip = s.down !== d.down_by_rule ? t(d.down_by_rule ? 'WOF.Sheet.down.ruleSaysDown' : 'WOF.Sheet.down.ruleSaysUp') : t('WOF.Sheet.down.toggle');
  return s.down
    ? { cls: 'grave', text: t('WOF.Actor.Base.FIELDS.down.label'), img: icon('status-down'), tip, toggle: 'down', pressed: true, disabled: !view.editable }
    : { cls: 'ok', text: t('WOF.Sheet.state.standing'), tip, toggle: 'down', pressed: false, disabled: !view.editable };
}

/** Airborne, always shown so it can be set; a mounted rider cannot be on the wires (as on the Kit tab). */
function airborneTag(view: SoldierView): HeaderTag {
  const on = !!view.system.airborne;
  const mounted = view.gear.some((g) => g.subtype === 'horse' && g.mounted);
  return {
    cls: on ? 'info' : 'off',
    text: t('WOF.Actor.Base.FIELDS.airborne.label'),
    img: icon('status-airborne'),
    tip: t('WOF.Sheet.state.airborneTip'),
    toggle: 'airborne',
    pressed: on,
    disabled: !view.editable || mounted,
  };
}

export function soldierTags(view: SoldierView): HeaderTag[] {
  const s = view.system;
  const d = view.derived;
  const out: HeaderTag[] = [downTag(view)];
  for (const w of view.injuries) out.push({ cls: w.treated ? 'warn' : 'grave', text: `${w.name}, ${t(w.treated ? 'WOF.Sheet.injury.treated' : 'WOF.Sheet.injury.untreated')}` });
  for (const r of view.responses) out.push({ cls: 'grave', text: r.name, tip: r.effects.join('; ') });
  if (view.gear.some((g) => g.subtype === 'odm') && s.gas_rating <= 0) out.push({ cls: 'grave', text: t('WOF.Sheet.state.outOfGas') });
  if (d.jammed) out.push({ cls: 'grave', text: t('WOF.Derived.jammed') });
  if (d.lame) out.push({ cls: 'warn', text: t('WOF.Sheet.state.horseLame') });
  if (view.gear.some((g) => g.subtype === 'blade-set') && !view.gear.some((g) => g.subtype === 'blade-set' && g.inHandles))
    out.push({ cls: 'grave', text: t('WOF.Sheet.state.handlesEmpty') });
  if (d.overloaded) out.push({ cls: 'warn', text: t('WOF.Derived.overloaded') });
  if (s.pinned.active) out.push({ cls: 'grave', text: t('WOF.Actor.Base.FIELDS.pinned.label') });
  if (s.carrying) out.push({ cls: 'info', text: t('WOF.Sheet.state.carrying', { name: view.comrades.find((c) => c.id === s.carrying)?.name ?? '?' }) });
  if (s.carried_by) out.push({ cls: 'info', text: t('WOF.Sheet.state.carriedBy', { name: view.comrades.find((c) => c.id === s.carried_by)?.name ?? '?' }) });
  if (s.next_roll_penalty > 0) out.push({ cls: 'warn', text: t('WOF.Sheet.state.nextRoll', { dice: s.next_roll_penalty }) });
  if (s.retiring) out.push({ cls: 'warn', text: t('WOF.Actor.Base.FIELDS.retiring.label') });
  out.push(airborneTag(view));
  return out;
}

export function squadTags(view: SoldierView, wingName: string): HeaderTag[] {
  const s = view.system;
  const d = view.derived;
  const out: HeaderTag[] = [downTag(view)];
  if (wingName) out.push({ cls: 'info', text: t('WOF.Squad.onWing', { name: wingName }) });
  const untreated = view.injuries.filter((w) => !w.treated).length;
  if (untreated) out.push({ cls: 'grave', text: t('WOF.Squad.untreated', { n: untreated }) });
  if (d.jammed) out.push({ cls: 'grave', text: t('WOF.Derived.jammed') });
  if (d.overloaded) out.push({ cls: 'warn', text: t('WOF.Derived.overloaded') });
  if (s.pinned.active) out.push({ cls: 'grave', text: t('WOF.Actor.Base.FIELDS.pinned.label') });
  out.push(airborneTag(view));
  return out;
}
