/**
 * Mounts the HUD strip once into Foundry's interface and keeps it between the scene navigation and
 * the sidebar (owner decision: content-sized, about 800 px, at most 860, never over the sidebar).
 */
import { mount } from 'svelte';
import { SYSTEM_ID } from '../config.ts';
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
