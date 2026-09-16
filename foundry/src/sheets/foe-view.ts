/** The plain view the compact Foe sheet renders (core-plan 2c; data/skirmish/foes.yaml). */
import { icon } from './soldier-view.ts';

const t = (key: string, data?: Record<string, unknown>): string => (data ? game.i18n.format(key, data) : game.i18n.localize(key));

export interface WeaponView {
  id: string;
  name: string;
  line: string;
}

export interface FoeView {
  id: string;
  uuid: string;
  name: string;
  img: string;
  editable: boolean;
  limited: boolean;
  system: any;
  currentHealth: number;
  fixedWeapon: WeaponView | null;
  weaponRows: { results: string; weapon: WeaponView }[];
  rollNote: string;
  atNight: { replaces: WeaponView; with: WeaponView } | null;
  weaponChoices: WeaponView[];
  current: WeaponView | null;
  shoot: WeaponView | null;
  notesHTML: string;
  icons: { fight: string; shoot: string };
}

export function weaponView(id: string): WeaponView | null {
  if (!id) return null;
  const w = (CONFIG.WOF.weapons as any[]).find((x) => x.id === id);
  if (!w) return { id, name: id, line: '' };
  return {
    id,
    name: w.name,
    line: t('WOF.FoeSheet.weaponLine', { damage: w.damage, type: t(`WOF.InjuryType.${w.injuryType}`), target: t(`WOF.FoeSheet.target.${w.target}`) }),
  };
}

export function buildFoeView(actor: any, opts: { editable: boolean; notesHTML: string }): FoeView {
  const src = actor.system.toObject();
  const fw = src.fight_weapon;
  const rows = (fw.rows as { results: number[]; weapon: string }[]).map((r) => ({ results: r.results.join(', '), weapon: weaponView(r.weapon)! }));
  const atNight = fw.at_night.replaces && fw.at_night.with ? { replaces: weaponView(fw.at_night.replaces)!, with: weaponView(fw.at_night.with)! } : null;
  const ids = new Set<string>([fw.fixed, ...rows.map((r) => r.weapon.id), ...(atNight ? [atNight.with.id] : []), src.weapon].filter(Boolean));
  return {
    id: actor.id,
    uuid: actor.uuid,
    name: actor.name,
    img: actor.img,
    editable: opts.editable,
    limited: !actor.testUserPermission(game.user, 'OBSERVER'),
    system: src,
    currentHealth: actor.system.current_health,
    fixedWeapon: weaponView(fw.fixed),
    weaponRows: rows,
    rollNote: fw.roll,
    atNight,
    weaponChoices: [...ids].map((id) => weaponView(id)!),
    current: weaponView(src.weapon),
    shoot: weaponView(src.shoot_weapon),
    notesHTML: opts.notesHTML,
    icons: { fight: icon('gear-blades'), shoot: icon('gear-firearm') },
  };
}
