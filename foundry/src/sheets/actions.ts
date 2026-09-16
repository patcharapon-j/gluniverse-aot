/**
 * Small Svelte actions that hand Foundry's own UX to the Svelte sheet: drag an embedded Item,
 * open a Foundry context menu, and show a Foundry tooltip. Each cleans up on destroy.
 */
import type { Action } from 'svelte/action';

/** Makes an element drag its embedded Item the way Foundry's sheets do (Item drag data). */
export const dragItem: Action<HTMLElement, { item: any } | null> = (node, param) => {
  let current = param;
  const onDragStart = (event: DragEvent) => {
    const data = current?.item?.toDragData?.();
    if (!data || !event.dataTransfer) return;
    event.dataTransfer.setData('text/plain', JSON.stringify(data));
    event.stopPropagation();
  };
  const apply = () => {
    node.draggable = !!current?.item;
    if (current?.item) node.dataset.itemId = current.item.id;
  };
  apply();
  node.addEventListener('dragstart', onDragStart);
  return {
    update(next) {
      current = next;
      apply();
    },
    destroy() {
      node.removeEventListener('dragstart', onDragStart);
    },
  };
};

export interface MenuEntry {
  label: string;
  icon?: string;
  visible?: boolean | (() => boolean);
  onClick: () => unknown;
}

let menuSeq = 0;

/**
 * A Foundry ContextMenu on this element (right click). Entries are read when the menu opens, so
 * the latest parameter is always used. The menu listens on the element itself, which Svelte
 * removes with its listener.
 */
export const contextMenu: Action<HTMLElement, () => MenuEntry[]> = (node, param) => {
  let entries = param;
  const key = `wof-ctx-${++menuSeq}`;
  node.dataset.wofCtx = key;
  const ContextMenu = foundry.applications.ux.ContextMenu.implementation;
  const menu = new ContextMenu(node, `[data-wof-ctx="${key}"]`, [], {
    jQuery: false,
    fixed: true,
    onOpen: () => {
      menu.menuItems = entries().map((e) => ({
        label: e.label,
        icon: e.icon,
        visible: typeof e.visible === 'function' ? () => (e.visible as () => boolean)() : (e.visible ?? true),
        onClick: () => e.onClick(),
      }));
    },
  });
  return {
    update(next) {
      entries = next;
    },
    destroy() {
      if (ui.context === menu) menu.close({ animate: false });
    },
  };
};

/** A Foundry tooltip (game.tooltip) with plain text, optionally placed. */
export const tooltip: Action<HTMLElement, string | { text: string; direction?: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'CENTER' } | null | undefined> = (node, param) => {
  const apply = (p: typeof param) => {
    const text = typeof p === 'string' ? p : p?.text;
    if (text) node.dataset.tooltipText = text;
    else delete node.dataset.tooltipText;
    const dir = typeof p === 'object' && p ? p.direction : undefined;
    if (dir) node.dataset.tooltipDirection = dir;
    else delete node.dataset.tooltipDirection;
  };
  apply(param);
  return {
    update: apply,
    destroy() {
      if (game.tooltip?.element && node.matches(':hover')) game.tooltip.deactivate();
    },
  };
};
