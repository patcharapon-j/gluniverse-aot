/**
 * The GM screen's client side. It holds one state object in localStorage and redraws from it.
 *
 * Two procedures are automated, and both are the ones the chapters give:
 *  - Rolling the Next Behavior: a D6 plus the Titan's Frenzy, read as the table's last entry if it
 *    runs past it, then move up through the results, wrapping 6 to 1, past any entry that is the
 *    previous behavior or that needs Body Parts the Titan no longer has unbroken; Thrash if
 *    nothing passes. The result is kept face down until the GM reveals it.
 *  - Resolving a card: the entry becomes Thrash without its Body Parts. When the Attention holder
 *    is not standing where the entry reaches, the screen names the soldiers who are and the GM
 *    reads the ladder among them, because the ladder is theirs to read and not the screen's. Only
 *    with nobody reachable does the entry fall back, and Thrash again when that fallback repeats
 *    the previous behavior.
 * Nothing else is decided here. Attack Dice are rolled in the open and stand as they fall.
 */

interface Behavior {
  id: string;
  name: string;
  results: number[];
  roll: string;
  tier: string;
  targets: string;
  positions: string[];
  parts: string[];
  attackDice: number | null;
  effects: string[];
  fallback: string;
  text: string;
  isGrab: boolean;
  wrecks: boolean;
}
interface Titan {
  id: string;
  name: string;
  sizeClass: string;
  abnormal: boolean;
  tempo: number;
  napeDepth: number;
  regeneration: number;
  heave: number | null;
  parts: { id: string; name: string; kind: string; toughness: number }[];
  behaviors: Behavior[];
  thrash: Behavior | null;
}
interface Data {
  titans: Titan[];
  ratings: { id: string; name: string; anchors: number; trait: string }[];
  positions: { id: string; name: string }[];
  retreatClock: number;
}

interface TitanState {
  label: string;
  id: string;
  parts: Record<string, { count: number; state: 'intact' | 'wounded' | 'broken' }>;
  openings: number;
  regen: number;
  /** 0 to 3, rising 1 at each round's end step and added to the behavior roll. */
  frenzy: number;
  holder: string;
  next: string | null;
  revealed: boolean;
  resolved: string | null;
  previous: string | null;
  dice: number[] | null;
  /** The soldiers a retargeting card could reach, while the GM reads the ladder among them. */
  retarget: string[] | null;
}
interface Soldier {
  key: string;
  name: string;
  card: string;
  stress: number;
  pos: Record<string, string>;
  down: boolean;
  grab: number; // 0 = not Grabbed, 1 or 2 = counted turns used
}
interface State {
  round: number;
  rating: string;
  anchors: number;
  retreat: number;
  titans: TitanState[];
  clocks: { key: string; length: number; filled: number }[];
  squad: Soldier[];
  steps: string[];
  ends: string[];
}

const KEY = 'wof-gm-screen-v1';
const STATES: TitanState['parts'][string]['state'][] = ['intact', 'wounded', 'broken'];

export function mountScreen(): void {
  const root = document.querySelector<HTMLElement>('[data-screen]');
  const raw = document.getElementById('screen-data');
  if (!root || !raw?.textContent) return;
  const data = JSON.parse(raw.textContent) as Data;
  root.hidden = false;

  const titanById = (id: string) => data.titans.find((t) => t.id === id) ?? data.titans[0];
  const uid = () => Math.random().toString(36).slice(2, 9);

  function freshTitan(label: string, id = data.titans[1]?.id ?? data.titans[0].id): TitanState {
    const titan = titanById(id);
    const parts: TitanState['parts'] = {};
    for (const p of titan.parts) parts[p.id] = { count: 0, state: 'intact' };
    return { label, id, parts, openings: 0, regen: 0, frenzy: 0, holder: '', next: null, revealed: false, resolved: null, previous: null, dice: null, retarget: null };
  }

  function fresh(): State {
    const rating = data.ratings.find((r) => r.id === 'wooded') ?? data.ratings[0];
    return {
      round: 1,
      rating: rating.id,
      anchors: rating.anchors,
      retreat: 0,
      titans: [freshTitan('A')],
      clocks: [],
      squad: [],
      steps: [],
      ends: [],
    };
  }

  let state: State = load();
  function load(): State {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        const st = { ...fresh(), ...(JSON.parse(saved) as State) };
        // A fight saved before Frenzy carries neither it nor a pending retarget.
        for (const ts of st.titans) {
          if (typeof ts.frenzy !== 'number') ts.frenzy = 0;
          if (ts.retarget === undefined) ts.retarget = null;
        }
        return st;
      }
    } catch {
      /* a blocked or cleared store just means a new fight */
    }
    return fresh();
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* nothing to do: the screen still works for this session */
    }
  }
  function commit() {
    save();
    draw();
  }

  // ------------------------------------------------------------------ the procedures

  /** The Body Part kinds this Titan still has unbroken. */
  function unbroken(ts: TitanState): Record<string, number> {
    const titan = titanById(ts.id);
    const out: Record<string, number> = {};
    for (const p of titan.parts) {
      if (ts.parts[p.id]?.state !== 'broken') out[p.kind] = (out[p.kind] ?? 0) + 1;
    }
    return out;
  }

  /** True when the Titan has every Body Part the entry uses, counting a kind listed twice as two. */
  function hasParts(ts: TitanState, b: Behavior): boolean {
    if (b.parts.length === 0) return true;
    const have = unbroken(ts);
    const need: Record<string, number> = {};
    for (const kind of b.parts) need[kind] = (need[kind] ?? 0) + 1;
    return Object.entries(need).every(([kind, n]) => (have[kind] ?? 0) >= n);
  }

  /**
   * A D6 plus the Titan's Frenzy, read as the table's last entry if it runs past it, then up
   * through the results until an entry can be rolled. Thrash if none can.
   */
  function rollNext(ts: TitanState): { die: number; total: number; id: string } {
    const titan = titanById(ts.id);
    const die = 1 + Math.floor(Math.random() * 6);
    const highest = Math.max(...titan.behaviors.flatMap((b) => b.results));
    const total = Math.min(die + (ts.frenzy || 0), highest);
    const byResult = (n: number) => titan.behaviors.find((b) => b.results.includes(n));
    for (let step = 0; step < 6; step++) {
      const n = ((total - 1 + step) % 6) + 1;
      const entry = byResult(n);
      if (!entry) continue;
      if (entry.id === ts.previous) continue;
      if (!hasParts(ts, entry)) continue;
      return { die, total, id: entry.id };
    }
    return { die, total, id: titan.thrash?.id ?? '' };
  }

  /**
   * What the card resolves, given the holder's Position and the Titan's Body Parts, and which
   * soldiers a retarget could land on. The screen never picks one: the Attention Ladder is the
   * GM's to read.
   */
  function resolveEntry(ts: TitanState, holderPos: string): { entry: Behavior | null; retarget: string[] } {
    const titan = titanById(ts.id);
    const thrash = titan.thrash;
    const find = (id: string | null) => (id ? (titan.behaviors.find((b) => b.id === id) ?? (thrash?.id === id ? thrash : null)) : null);
    const plain = (entry: Behavior | null) => ({ entry, retarget: [] as string[] });
    const entry = find(ts.next);
    if (!entry) return plain(null);
    if (!hasParts(ts, entry)) return plain(thrash);
    if (holderPos && !entry.positions.includes(holderPos)) {
      const reachable = state.squad.filter((s) => s.key !== ts.holder && entry.positions.includes(s.pos[ts.label] ?? ''));
      if (reachable.length) return { entry, retarget: reachable.map((s) => s.key) };
      const back = find(entry.fallback);
      if (!back || back.id === ts.previous || !hasParts(ts, back)) return plain(thrash);
      if (!back.positions.includes(holderPos)) return plain(thrash);
      return plain(back);
    }
    return plain(entry);
  }

  // ------------------------------------------------------------------ drawing

  const el = <T extends HTMLElement>(sel: string) => root!.querySelector<T>(sel);
  const pips = (n: number, filled: number, onClick: (i: number) => void) => {
    const span = document.createElement('span');
    span.className = 'pips';
    for (let i = 0; i < n; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-pressed', String(i < filled));
      b.setAttribute('aria-label', `Segment ${i + 1} of ${n}`);
      b.addEventListener('click', () => onClick(i));
      span.append(b);
    }
    return span;
  };

  function drawBar() {
    el('[data-round-n]')!.textContent = String(state.round);
    const select = el<HTMLSelectElement>('[data-rating]')!;
    if (!select.options.length) {
      for (const r of data.ratings) {
        const o = document.createElement('option');
        o.value = r.id;
        o.textContent = r.name;
        select.append(o);
      }
      select.addEventListener('change', () => {
        state.rating = select.value;
        state.anchors = data.ratings.find((r) => r.id === select.value)?.anchors ?? 0;
        commit();
      });
    }
    select.value = state.rating;
    el('[data-anchor-n]')!.textContent = String(state.anchors);
    const rating = data.ratings.find((r) => r.id === state.rating);
    el('[data-trait]')!.textContent = rating ? `${rating.name}: ${rating.trait}` : '';

    const box = el('[data-retreat]')!;
    box.replaceChildren(
      pips(data.retreatClock, state.retreat, (i) => {
        state.retreat = state.retreat === i + 1 ? i : i + 1;
        commit();
      }),
    );
    el('[data-retreat-flag]')!.hidden = state.retreat < data.retreatClock;
  }

  function drawTitans() {
    const host = el('[data-titans]')!;
    host.replaceChildren();
    for (const ts of state.titans) {
      const titan = titanById(ts.id);
      const card = document.createElement('section');
      card.className = 'scr-titan';

      const head = document.createElement('h3');
      head.textContent = `Focus Titan ${ts.label}`;
      card.append(head);

      const pick = document.createElement('select');
      pick.setAttribute('aria-label', `Which Titan is Focus Titan ${ts.label}`);
      for (const t of data.titans) {
        const o = document.createElement('option');
        o.value = t.id;
        o.textContent = t.name;
        pick.append(o);
      }
      pick.value = ts.id;
      pick.addEventListener('change', () => {
        const kept = ts.label;
        Object.assign(ts, freshTitan(kept, pick.value));
        commit();
      });
      card.append(pick);

      const stats = document.createElement('p');
      stats.className = 'scr-stats';
      const bits: [string, string][] = [
        ['Tempo', String(titan.tempo)],
        ['Nape Depth', String(titan.napeDepth)],
        ['Heave', titan.heave === null ? '—' : String(titan.heave)],
        ['Size', titan.sizeClass + (titan.abnormal ? ' Abnormal' : '')],
      ];
      for (const [k, v] of bits) {
        const s = document.createElement('span');
        const key = document.createElement('span');
        key.className = 'lbl';
        key.textContent = k;
        const val = document.createElement('b');
        val.textContent = v;
        s.append(key, val);
        stats.append(s);
      }
      card.append(stats);

      // Openings and Regeneration
      const row = document.createElement('div');
      row.className = 'scr-row';
      const openingsBox = document.createElement('span');
      openingsBox.className = 'scr-clock';
      const openingsLabel = document.createElement('span');
      openingsLabel.className = 'lbl';
      openingsLabel.textContent = 'Openings';
      openingsBox.append(
        openingsLabel,
        stepper('Openings', ts.openings, (d) => {
          ts.openings = Math.max(0, ts.openings + d);
          commit();
        }),
      );
      row.append(openingsBox);
      const regenBox = document.createElement('span');
      regenBox.className = 'scr-clock';
      regenBox.innerHTML = '<span class="lbl">Regeneration</span>';
      regenBox.append(
        pips(titan.regeneration, ts.regen, (i) => {
          ts.regen = ts.regen === i + 1 ? i : i + 1;
          commit();
        }),
      );
      row.append(regenBox);
      const frenzyBox = document.createElement('span');
      frenzyBox.className = 'scr-clock';
      const frenzyLabel = document.createElement('span');
      frenzyLabel.className = 'lbl';
      frenzyLabel.textContent = 'Frenzy';
      frenzyBox.append(
        frenzyLabel,
        stepper('Frenzy', ts.frenzy, (d) => {
          ts.frenzy = Math.min(3, Math.max(0, ts.frenzy + d));
          commit();
        }),
      );
      row.append(frenzyBox);
      card.append(row);

      // Body Parts
      const table = document.createElement('table');
      table.className = 'scr-table';
      table.innerHTML =
        '<thead><tr><th scope="col">Body Part</th><th scope="col">Count</th><th scope="col">State</th><th scope="col"><span class="sr-only">Change</span></th></tr></thead>';
      const body = document.createElement('tbody');
      for (const p of titan.parts) {
        const st = ts.parts[p.id] ?? { count: 0, state: 'intact' as const };
        const tr = document.createElement('tr');
        const name = document.createElement('th');
        name.scope = 'row';
        name.textContent = p.name;
        const count = document.createElement('td');
        count.textContent = `${st.count} / ${p.toughness}`;
        const stateCell = document.createElement('td');
        const tag = document.createElement('span');
        tag.className = 'scr-part-state';
        tag.dataset.state = st.state;
        tag.textContent = st.state;
        stateCell.append(tag);
        const actions = document.createElement('td');
        actions.append(
          button('+1', () => {
            const s = ts.parts[p.id];
            s.count += 1;
            if (s.count >= p.toughness) {
              s.count = 0;
              const i = STATES.indexOf(s.state);
              s.state = STATES[Math.min(i + 1, STATES.length - 1)];
            }
            commit();
          }),
          button('−1', () => {
            const s = ts.parts[p.id];
            if (s.count > 0) s.count -= 1;
            else {
              const i = STATES.indexOf(s.state);
              if (i > 0) {
                s.state = STATES[i - 1];
                s.count = Math.max(0, p.toughness - 1);
              }
            }
            commit();
          }),
        );
        tr.append(name, count, stateCell, actions);
        body.append(tr);
      }
      table.append(body);
      card.append(table);

      const grounded = titan.parts.some((p) => p.kind === 'leg' && ts.parts[p.id]?.state === 'broken');
      if (grounded) {
        const flag = document.createElement('p');
        flag.className = 'scr-hint';
        flag.innerHTML = '<b>Grounded.</b> Nape strikes gain 2 Bonus Dice and need no working ODM Gear, and the close steps are on foot.';
        card.append(flag);
      }

      // Attention and the Next Behavior
      const next = document.createElement('div');
      next.className = 'scr-next';

      const holderRow = document.createElement('div');
      holderRow.className = 'scr-row';
      const holderLabel = document.createElement('span');
      holderLabel.className = 'lbl';
      holderLabel.textContent = 'Attention';
      const holder = document.createElement('select');
      holder.setAttribute('aria-label', `Who holds Focus Titan ${ts.label}'s Attention`);
      const options: [string, string][] = [
        ['', 'Nothing'],
        ['decoy', 'A decoy'],
        ...state.squad.map((s) => [s.key, s.name] as [string, string]),
      ];
      for (const [v, t] of options) {
        const o = document.createElement('option');
        o.value = v;
        o.textContent = t;
        holder.append(o);
      }
      holder.value = ts.holder;
      holder.addEventListener('change', () => {
        ts.holder = holder.value;
        commit();
      });
      holderRow.append(holderLabel, holder);
      next.append(holderRow);

      const buttons = document.createElement('div');
      buttons.className = 'scr-row';
      buttons.append(
        button(ts.next ? 'Re-roll Next Behavior' : 'Roll Next Behavior', () => {
          const { id } = rollNext(ts);
          ts.next = id;
          ts.revealed = false;
          ts.resolved = null;
          ts.dice = null;
          ts.retarget = null;
          commit();
        }),
      );
      if (ts.next && !ts.revealed) buttons.append(button('Reveal to me', () => { ts.revealed = true; commit(); }));
      if (ts.next) {
        buttons.append(
          button('Resolve card', () => {
            const holderPos = holderPosition(ts);
            const { entry, retarget } = resolveEntry(ts, holderPos);
            ts.resolved = entry?.id ?? null;
            ts.revealed = true;
            ts.dice = null;
            ts.retarget = retarget.length ? retarget : null;
            commit();
          }),
        );
      }
      next.append(buttons);

      const shown = ts.resolved ?? (ts.revealed ? ts.next : null);
      const cardText = document.createElement('div');
      cardText.className = 'scr-next-card';
      if (!ts.next) {
        cardText.innerHTML = '<span class="scr-hidden">No Next Behavior yet. Roll one before its card comes up.</span>';
      } else if (!shown) {
        cardText.innerHTML = '<span class="scr-hidden">Face down. Rolled once, and it stands.</span>';
      } else {
        const entry = [...titan.behaviors, titan.thrash].find((b) => b && b.id === shown) as Behavior | undefined;
        if (entry) {
          const fellBack = ts.resolved && ts.resolved !== ts.next;
          cardText.innerHTML =
            `<b>${entry.name}</b> · ${entry.tier}${entry.isGrab ? ' · <b>Grab</b>' : ''}` +
            (fellBack ? ' <span class="scr-hidden">(fallback)</span>' : '') +
            `<br /><span class="scr-hidden">${entry.targets}. ${entry.attackDice ?? 0} Attack Dice.</span>` +
            (entry.effects.filter((x) => !x.startsWith('Wreck')).length
              ? `<br />${entry.effects.filter((x) => !x.startsWith('Wreck')).join(' · ')}`
              : '') +
            (entry.wrecks ? '<br /><b>Wrecks 1 Anchor</b>, landed or whiffed.' : '') +
            `<br /><em>${entry.text}</em>`;
          if (entry.attackDice) {
            const roll = button(`Roll ${entry.attackDice} Attack Dice`, () => {
              ts.dice = Array.from({ length: entry.attackDice as number }, () => 1 + Math.floor(Math.random() * 6));
              commit();
            });
            cardText.append(document.createElement('br'), roll);
          }
          if (ts.dice) {
            const tray = document.createElement('div');
            tray.className = 'scr-dice';
            for (const d of ts.dice) {
              const die = document.createElement('span');
              die.className = 'scr-die';
              die.dataset.hit = String(d >= 5);
              die.textContent = String(d);
              tray.append(die);
            }
            const sev = document.createElement('p');
            sev.className = 'scr-sev';
            sev.textContent = `Severity ${ts.dice.filter((d) => d >= 5).length}`;
            cardText.append(tray, sev);
          }
          const done = button('Card done', () => {
            ts.previous = ts.resolved ?? ts.next;
            const { id } = rollNext(ts);
            ts.next = id;
            ts.revealed = false;
            ts.resolved = null;
            ts.dice = null;
            ts.retarget = null;
            commit();
          });
          cardText.append(document.createElement('br'), done);
        }
      }
      next.append(cardText);
      card.append(next);
      host.append(card);
    }
    el<HTMLButtonElement>('[data-add-titan]')!.hidden = state.titans.length > 1;
  }

  function holderPosition(ts: TitanState): string {
    const soldier = state.squad.find((s) => s.key === ts.holder);
    return soldier?.pos[ts.label] ?? '';
  }

  function drawClocks() {
    const host = el('[data-bg-clocks]')!;
    host.replaceChildren();
    for (const c of state.clocks) {
      const row = document.createElement('div');
      row.className = 'scr-clock';
      const name = document.createElement('span');
      name.className = 'lbl';
      name.textContent = `Clock of ${c.length}`;
      row.append(name, pips(c.length, c.filled, (i) => {
        c.filled = c.filled === i + 1 ? i : i + 1;
        commit();
      }));
      if (c.filled >= c.length) {
        const flag = document.createElement('span');
        flag.className = 'scr-flag';
        flag.textContent = 'FULL';
        row.append(flag);
      }
      row.append(
        button('+1 flare', () => {
          c.filled = Math.min(c.length, c.filled + 1);
          commit();
        }),
        button('Remove', () => {
          state.clocks = state.clocks.filter((x) => x.key !== c.key);
          commit();
        }),
      );
      host.append(row);
    }
  }

  function drawSquad() {
    const body = el('[data-squad]')!;
    body.replaceChildren();
    const hasB = state.titans.length > 1;
    el('[data-pos-b]')!.hidden = !hasB;
    for (const s of state.squad) {
      const tr = document.createElement('tr');

      const name = document.createElement('th');
      name.scope = 'row';
      name.textContent = s.name;

      const card = document.createElement('td');
      card.append(
        input(s.card, 'Card', (v) => {
          s.card = v;
          save();
        }),
      );

      const stress = document.createElement('td');
      stress.append(
        stepper(String(s.stress), s.stress, (d) => {
          s.stress = Math.max(0, s.stress + d);
          commit();
        }),
      );

      const cells: HTMLTableCellElement[] = [];
      for (const ts of state.titans) {
        const td = document.createElement('td');
        const sel = document.createElement('select');
        sel.setAttribute('aria-label', `${s.name}'s Position relative to Focus Titan ${ts.label}`);
        for (const [v, t] of [['', '—'], ...data.positions.map((p) => [p.id, p.name])] as [string, string][]) {
          const o = document.createElement('option');
          o.value = v;
          o.textContent = t;
          sel.append(o);
        }
        sel.value = s.pos[ts.label] ?? '';
        sel.addEventListener('change', () => {
          s.pos[ts.label] = sel.value;
          commit();
        });
        td.append(sel);
        cells.push(td);
      }
      if (!hasB) cells.push(document.createElement('td'));
      if (!hasB) cells[1].hidden = true;

      const flags = document.createElement('td');
      flags.append(
        toggle('Down', s.down, () => {
          s.down = !s.down;
          commit();
        }),
        button(s.grab ? `Grabbed ${s.grab}/2` : 'Grab', () => {
          s.grab = (s.grab + 1) % 3;
          commit();
        }),
      );
      if (s.grab === 2) {
        const warn = document.createElement('span');
        warn.className = 'scr-flag';
        warn.textContent = 'DEVOURED AT END';
        flags.append(warn);
      }

      const kill = document.createElement('td');
      kill.append(
        button('×', () => {
          state.squad = state.squad.filter((x) => x.key !== s.key);
          commit();
        }),
      );

      tr.append(name, card, stress, ...cells, flags, kill);
      body.append(tr);
    }
  }

  function drawChecks() {
    for (const box of root!.querySelectorAll<HTMLInputElement>('[data-step]')) box.checked = state.steps.includes(box.dataset.step!);
    for (const box of root!.querySelectorAll<HTMLInputElement>('[data-end]')) box.checked = state.ends.includes(box.dataset.end!);
  }

  function draw() {
    drawBar();
    drawTitans();
    drawClocks();
    drawSquad();
    drawChecks();
  }

  // ------------------------------------------------------------------ small builders

  function button(label: string, onClick: () => void): HTMLButtonElement {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.addEventListener('click', onClick);
    return b;
  }
  function toggle(label: string, on: boolean, onClick: () => void): HTMLButtonElement {
    const b = button(label, onClick);
    b.setAttribute('aria-pressed', String(on));
    if (on) b.style.borderColor = 'currentColor';
    return b;
  }
  function input(value: string, label: string, onChange: (v: string) => void): HTMLInputElement {
    const i = document.createElement('input');
    i.type = 'text';
    i.size = 3;
    i.value = value;
    i.setAttribute('aria-label', label);
    i.addEventListener('change', () => onChange(i.value));
    return i;
  }
  function stepper(label: string, value: number, onStep: (d: number) => void): HTMLSpanElement {
    const span = document.createElement('span');
    span.className = 'scr-clock';
    const n = document.createElement('b');
    n.textContent = String(value);
    span.append(button('−', () => onStep(-1)), n, button('+', () => onStep(1)));
    span.setAttribute('aria-label', label);
    return span;
  }

  // ------------------------------------------------------------------ wiring

  for (const b of root.querySelectorAll<HTMLButtonElement>('[data-round]')) {
    b.addEventListener('click', () => {
      state.round = Math.max(1, state.round + Number(b.dataset.round));
      state.steps = [];
      state.ends = [];
      commit();
    });
  }
  for (const b of root.querySelectorAll<HTMLButtonElement>('[data-anchor]')) {
    b.addEventListener('click', () => {
      state.anchors = Math.max(0, state.anchors + Number(b.dataset.anchor));
      commit();
    });
  }
  for (const b of root.querySelectorAll<HTMLButtonElement>('[data-add-clock]')) {
    b.addEventListener('click', () => {
      state.clocks.push({ key: uid(), length: Number(b.dataset.addClock), filled: 0 });
      commit();
    });
  }
  el<HTMLButtonElement>('[data-add-titan]')!.addEventListener('click', () => {
    if (state.titans.length > 1) return;
    state.titans.push(freshTitan('B'));
    commit();
  });
  el<HTMLFormElement>('[data-add-soldier]')!.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const field = form.elements.namedItem('name') as HTMLInputElement;
    const name = field.value.trim();
    if (!name) return;
    state.squad.push({ key: uid(), name, card: '', stress: 0, pos: { A: 'distant', B: 'distant' }, down: false, grab: 0 });
    field.value = '';
    commit();
  });
  el<HTMLButtonElement>('[data-reset]')!.addEventListener('click', () => {
    const squad = state.squad.map((s) => ({ ...s, card: '', pos: { A: 'distant', B: 'distant' }, down: false, grab: 0 }));
    state = { ...fresh(), squad };
    commit();
  });
  root.addEventListener('change', (e) => {
    const box = e.target as HTMLInputElement;
    if (box.dataset.step) {
      state.steps = box.checked ? [...state.steps, box.dataset.step] : state.steps.filter((x) => x !== box.dataset.step);
      save();
    }
    if (box.dataset.end) {
      state.ends = box.checked ? [...state.ends, box.dataset.end] : state.ends.filter((x) => x !== box.dataset.end);
      save();
    }
  });

  draw();
}
