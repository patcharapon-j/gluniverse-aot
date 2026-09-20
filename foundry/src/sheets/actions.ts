/**
 * Small Svelte actions that hand Foundry's own UX to the Svelte sheet: drag an embedded Item,
 * open a Foundry context menu, show a Foundry tooltip, and raise the sheet's own hover card.
 * Each cleans up on destroy.
 */
import type { Action } from 'svelte/action';
import type { DetailCard } from './detail.ts';
import type { HoverCards } from './hover.svelte.ts';

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

export interface ProseMirrorParam {
  /** The field path, such as system.notes. */
  name: string;
  value: string;
  enriched: string;
  editable: boolean;
  documentUUID: string;
  /** Pixels; null lets the editor grow with its content. */
  height?: number | null;
  onsave: (html: string) => unknown;
}

/** Foundry's own rich text editor (prose-mirror element), saved on its change event. */
export const proseMirror: Action<HTMLElement, ProseMirrorParam> = (node, p) => {
  const El = foundry.applications.elements.HTMLProseMirrorElement;
  const editor = El.create({ name: p.name, value: p.value, enriched: p.enriched, toggled: true, documentUUID: p.documentUUID, height: p.height === null ? undefined : (p.height ?? 220) });
  let save = p.onsave;
  const onChange = (e: Event) => {
    e.stopPropagation();
    save(editor.value);
  };
  editor.addEventListener('change', onChange);
  node.append(editor);
  if (!p.editable) editor.disabled = true;
  return {
    update(next) {
      save = next.onsave;
    },
    destroy() {
      editor.removeEventListener('change', onChange);
      editor.remove();
    },
  };
};

export interface DetailHover {
  hover: HoverCards;
  /** Read when the card opens, so the row always raises its current text. */
  card: () => DetailCard | null;
  /** 0 for a row on the page, deeper for a reference named inside an open card. */
  depth?: number;
}

/**
 * Raises this row's hover card (hover.svelte.ts): the pointer opens it after a rest, the keyboard
 * on focus, and anything that moves the row — a click, a drag, a scroll, Escape — closes it again.
 */
export const detailHover: Action<HTMLElement, DetailHover> = (node, param) => {
  let p = param;
  const depth = () => p.depth ?? 0;
  const rest = () => p.hover.show(node, p.card(), depth());
  const now = () => p.hover.open(node, p.card(), depth());
  const leave = () => p.hover.leave(depth());
  const hide = () => p.hover.hide();
  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') p.hover.hide();
  };
  const listeners: [string, EventListener][] = [
    ['pointerenter', rest],
    ['pointerleave', leave],
    ['pointerdown', hide],
    ['dragstart', hide],
    ['focusin', now],
    ['focusout', leave],
    ['keydown', onKey as EventListener],
  ];
  for (const [name, fn] of listeners) node.addEventListener(name, fn);
  return {
    update(next) {
      p = next;
      p.hover.refresh(node, p.card(), depth());
    },
    destroy() {
      for (const [name, fn] of listeners) node.removeEventListener(name, fn);
      p.hover.hide();
    },
  };
};
