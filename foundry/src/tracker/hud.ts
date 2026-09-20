/**
 * Mounts the HUD strip once into Foundry's interface and keeps it between the scene navigation and
 * the sidebar (owner decision: content-sized, about 800 px, at most 860, never over the sidebar).
 *
 * The strip is also where the engagement's own values live rather than the tokens': the anchor plate
 * naming the rating and its Anchor count (batch D), because the rating belongs to the engagement and
 * not to any one soldier, and the Direct Control toggle of ADR-0028, GM only.
 */
import { mount } from 'svelte';
import { SYSTEM_ID } from '../config.ts';
import { DIRECT_SETTING } from '../settings-menu.ts';
import HudRoot from './components/Hud.svelte';
import { onRefresh, tracker } from './state.svelte.ts';

let host: HTMLElement | null = null;
const GAP = 12;

const visible = (el: Element | null) => {
  if (!(el instanceof HTMLElement)) return null;
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden' ? r : null;
};

/** Places the strip in the free band between the left controls or navigation and the sidebar. */
export function placeHud(): void {
  if (!host) return;
  const left = Math.max(visible(document.getElementById('scene-navigation'))?.right ?? 0, visible(document.getElementById('scene-controls'))?.right ?? 0, 0);
  const sidebar = visible(document.getElementById('sidebar'));
  const right = sidebar ? window.innerWidth - sidebar.left : 0;
  host.style.left = `${Math.round(left + GAP)}px`;
  host.style.right = `${Math.round(right + GAP)}px`;
  const h = host.querySelector<HTMLElement>('.wof-hud')?.offsetHeight ?? 0;
  document.body.style.setProperty('--wof-hud-h', `${h ? h + 16 : 0}px`);
  document.body.classList.toggle('wof-hud-on', h > 0);
}

export function mountHud(): void {
  if (host) return;
  const iface = document.getElementById('interface');
  if (!iface) return;
  tracker.folded = !!game.settings.get(SYSTEM_ID, 'hudFolded');
  // Direct Control is remembered per GM client, so a GM who left it on finds it on (ADR-0028).
  tracker.direct = !!game.user?.isGM && !!game.settings.get(SYSTEM_ID, DIRECT_SETTING);
  host = document.createElement('section');
  host.id = 'wof-hud-host';
  host.setAttribute('aria-label', game.i18n.localize('WOF.Tracker.title'));
  iface.appendChild(host);
  mount(HudRoot, { target: host });
  const observer = new ResizeObserver(() => placeHud());
  observer.observe(host);
  for (const id of ['sidebar', 'scene-navigation', 'scene-controls']) {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  }
  window.addEventListener('resize', placeHud);
  for (const hook of ['collapseSidebar', 'renderSceneNavigation', 'renderSidebar', 'changeSidebarTab']) Hooks.on(hook, () => requestAnimationFrame(placeHud));
  onRefresh(() => requestAnimationFrame(placeHud));
  placeHud();
}
