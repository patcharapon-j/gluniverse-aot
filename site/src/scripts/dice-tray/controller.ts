/**
 * Dice Tray controls: pool counts, Roll, Push, Cover, Pushes allowed, Reset, and
 * the text result. Rules come from ~/lib/dice-rules; die values come from the 3D
 * stage when it can run, or straight from a random source (reduced motion, no
 * WebGL, or the stage failing), with the same rules either way.
 */
import { describePool, dieSvg, KIND, type DieKind } from '~/lib/dice';
import {
  applyPush,
  checkPush,
  clampPool,
  clampPushes,
  d6,
  planPush,
  poolKinds,
  poolSize,
  startRoll,
  summarize,
  type Die,
  type Pool,
  type RollState,
  type Values,
} from '~/lib/dice-rules';
import type { ThrowDie, TrayStage } from './stage';

/** The `detail` of a `wof:try-roll` event, as TryRollButton sends it. */
export interface TryRollDetail {
  pool?: Partial<Pool>;
  pushable?: boolean;
  label?: string;
}

export interface TrayController {
  load(detail: unknown): void;
  focusRoll(): void;
}

const KINDS: readonly DieKind[] = ['base', 'gear', 'stress', 'titan'];
const STAGE_WAIT_MS = 4000;

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const successes = (n: number) => plural(n, 'success', 'successes');
const motionQuery = () => window.matchMedia('(prefers-reduced-motion: reduce)');
const canUse3D = () => !motionQuery().matches && typeof window.WebGL2RenderingContext === 'function';

const trays = new WeakMap<HTMLElement, TrayController>();

export function trayFor(root: HTMLElement): TrayController {
  let tray = trays.get(root);
  if (!tray) {
    tray = mountTray(root);
    trays.set(root, tray);
  }
  return tray;
}

function need<T extends Element>(root: HTMLElement, selector: string): T {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`Dice Tray is missing ${selector}`);
  return el;
}

function mountTray(root: HTMLElement): TrayController {
  const form = need<HTMLFormElement>(root, '[data-tray-form]');
  const counts = Object.fromEntries(KINDS.map((kind) => [kind, need<HTMLInputElement>(root, `input[name="${kind}"]`)])) as Record<
    DieKind,
    HTMLInputElement
  >;
  const pushesInput = need<HTMLInputElement>(root, 'input[name="pushes"]');
  const coverInput = need<HTMLInputElement>(root, 'input[name="cover"]');
  const rollButton = need<HTMLButtonElement>(root, '[data-tray-roll]');
  const pushButton = need<HTMLButtonElement>(root, '[data-tray-push]');
  const resetButton = need<HTMLButtonElement>(root, '[data-tray-reset]');
  const reasonEl = need<HTMLElement>(root, '[data-tray-reason]');
  const facesEl = need<HTMLElement>(root, '[data-tray-faces]');
  const resultEl = need<HTMLElement>(root, '[data-tray-result]');
  const logEl = need<HTMLElement>(root, '[data-tray-log]');
  const sourceEl = need<HTMLElement>(root, '[data-tray-source]');
  const stageHost = need<HTMLElement>(root, '[data-tray-stage]');

  const readPool = (): Pool => clampPool(Object.fromEntries(KINDS.map((kind) => [kind, counts[kind].value])));
  const writePool = (pool: Pool) => KINDS.forEach((kind) => (counts[kind].value = String(pool[kind])));

  let preset = readPool();
  let pushable = true;
  let roll: RollState | null = null;
  let rolling: Pool | null = null;
  let busy = false;
  let generation = 0;

  /* ---- 3D stage, loaded on demand ---- */
  let stage: TrayStage | null = null;
  let stagePromise: Promise<TrayStage | null> | null = null;
  let stageFailed = false;

  function dropStage() {
    stage?.dispose();
    stage = null;
    stagePromise = null;
    root.classList.remove('is-3d');
  }

  function getStage(): Promise<TrayStage | null> {
    if (stageFailed || !canUse3D()) {
      if (stage) dropStage();
      return Promise.resolve(null);
    }
    stagePromise ??= import('./stage')
      .then(({ createStage }) => {
        root.classList.add('is-3d');
        stage = createStage(stageHost);
        return stage;
      })
      .catch((error: unknown) => {
        console.warn('Dice Tray: 3D dice are unavailable, showing flat dice.', error);
        stageFailed = true;
        dropStage();
        return null;
      });
    return stagePromise;
  }

  function stageForThrow(): Promise<TrayStage | null> {
    return Promise.race([getStage(), new Promise<null>((resolve) => window.setTimeout(() => resolve(null), STAGE_WAIT_MS))]);
  }

  motionQuery().addEventListener('change', () => {
    if (motionQuery().matches) dropStage();
  });

  /** Throws dice on the stage if it can, and returns their values in `dice` order. */
  async function throwValues(dice: readonly ThrowDie[], mode: 'roll' | 'reroll'): Promise<Values> {
    const current = await stageForThrow();
    if (!current) return Math.random;
    try {
      const faces = await (mode === 'roll' ? current.roll(dice) : current.reroll(dice));
      return dice.map((d) => faces.get(d.id) ?? d6());
    } catch (error) {
      console.warn('Dice Tray: the 3D throw failed, rolling flat dice.', error);
      stageFailed = true;
      dropStage();
      return Math.random;
    }
  }

  /* ---- output ---- */
  function announce(message: string) {
    // Clear first so a repeated sentence is still announced.
    logEl.textContent = '';
    window.setTimeout(() => (logEl.textContent = message), 40);
  }

  function setUnavailable(button: HTMLButtonElement, unavailable: boolean) {
    button.setAttribute('aria-disabled', String(unavailable));
  }

  function press(button: HTMLButtonElement) {
    button.classList.add('is-pressed');
    window.setTimeout(() => button.classList.remove('is-pressed'), 180);
  }

  function flags(die: Die, state: RollState): string {
    let f = '';
    if (state.pushes > 0) {
      if (die.status === 'kept') f += 'k';
      if (die.status === 'locked') f += 'l';
      if (die.status === 'new') f += 'n';
    }
    if (die.value === 1 && (die.kind === 'stress' || (die.kind === 'gear' && state.pushes > 0))) f += 'x';
    return f;
  }

  function renderFaces() {
    const groups: string[] = [];
    for (const kind of KINDS) {
      let faces: string[] = [];
      if (roll) faces = roll.dice.filter((d) => d.kind === kind).map((d) => dieSvg(kind, String(d.value), flags(d, roll!)));
      else if (rolling) faces = Array.from({ length: rolling[kind] }, () => dieSvg(kind, '?'));
      if (faces.length === 0) continue;
      groups.push(
        `<div class="grp"><div class="dice" role="list" aria-label="${KIND[kind].plural}">${faces
          .map((svg) => `<span role="listitem">${svg}</span>`)
          .join('')}</div><span class="lbl" aria-hidden="true">${KIND[kind].plural} ×${faces.length}</span></div>`,
      );
    }
    facesEl.innerHTML = groups.length
      ? `<div class="pool">${groups.join('')}</div>`
      : '<p class="dtray-empty">No dice thrown yet. Set your pool and press Roll.</p>';
  }

  function renderResult() {
    const rows: Array<[string, string, string?]> = [];
    if (!roll) {
      rows.push(['Successes', '–'], ['Stress Response', '–'], ['Pushes', '–'], ['Gear wear', '–'], ['Stress added', '–']);
    } else {
      const s = summarize(roll);
      if (s.hasSoldierDice) rows.push(['Successes', String(s.successes), 'big']);
      if (s.hasTitanDice) rows.push(['Titan successes', String(s.titanSuccesses), 'big']);
      if (s.hasSoldierDice) {
        rows.push(['Stress Response', s.stressResponse ? 'Yes' : 'No', s.stressResponse ? 'bad' : '']);
        rows.push(['Pushes', roll.pushable ? `${s.pushes} of ${roll.pushesAllowed}` : 'Not allowed']);
        rows.push(['Gear wear', s.gearWear ? plural(s.gearWear, 'point', 'points') : s.pushes ? 'None' : 'None (not Pushed)', s.gearWear ? 'bad' : '']);
        const added = [s.stressAdded ? `You +${s.stressAdded}` : '', s.coverStress ? `Covering comrade +${s.coverStress}` : ''].filter(Boolean);
        rows.push(['Stress added', added.join(', ') || 'None']);
      }
    }
    resultEl.replaceChildren(
      ...rows.flatMap(([term, value, tone]) => {
        const dt = document.createElement('dt');
        dt.textContent = term;
        const dd = document.createElement('dd');
        dd.textContent = value;
        if (tone) dd.className = tone;
        return [dt, dd];
      }),
    );
  }

  function pushReason(): string {
    if (busy) return 'The dice are still rolling.';
    if (!roll) return 'Roll first. You can Push after a roll.';
    const check = checkPush(roll, { covered: coverInput.checked });
    return check.allowed ? '' : check.reason;
  }

  function sync() {
    const empty = poolSize(readPool()) === 0;
    setUnavailable(rollButton, busy || empty);
    const reason = pushReason();
    setUnavailable(pushButton, reason !== '');
    if (empty && !busy) reasonEl.textContent = 'Add at least one die to roll.';
    else if (reason) reasonEl.textContent = roll || busy ? `Push unavailable: ${reason}` : reason;
    else reasonEl.textContent = coverInput.checked ? 'You can Push. A comrade Covers it and takes the Stress.' : 'You can Push. You gain 1 Stress.';
  }

  function render() {
    renderFaces();
    renderResult();
    sync();
  }

  /* ---- actions ---- */
  function rollSentence(state: RollState): string {
    const s = summarize(state);
    const parts = [`Rolled ${plural(state.dice.length, 'die', 'dice')}.`];
    if (s.hasSoldierDice) parts.push(`${successes(s.successes)}.`);
    if (s.hasTitanDice) parts.push(`Titan Dice: ${successes(s.titanSuccesses)}.`);
    if (s.stressResponse) parts.push('A Stress Die shows a 1: Stress Response.');
    const check = checkPush(state);
    parts.push(check.allowed ? 'You can Push.' : `No Push: ${check.reason}`);
    return parts.join(' ');
  }

  function pushSentence(state: RollState, covered: boolean): string {
    const s = summarize(state);
    const parts = [`Pushed${covered ? ' with Cover' : ''}. ${successes(s.successes)}.`];
    parts.push(s.stressResponse ? 'A Stress Die shows a 1: Stress Response.' : 'No Stress Response.');
    if (s.gearWear) parts.push(`${plural(s.gearWear, 'Gear Die shows', 'Gear Dice show')} a 1: the gear wears by ${s.gearWear}.`);
    parts.push(covered ? 'Your comrade gains 1 Stress.' : 'You gain 1 Stress.');
    return parts.join(' ');
  }

  async function doRoll() {
    if (busy) return;
    const pool = readPool();
    if (poolSize(pool) === 0) return announce('Add at least one die to roll.');
    const token = ++generation;
    busy = true;
    roll = null;
    rolling = pool;
    press(rollButton);
    render();
    const dice = poolKinds(pool).map((kind, id) => ({ id, kind }));
    const values = await throwValues(dice, 'roll');
    if (token !== generation) return;
    roll = startRoll(pool, values, { pushable, pushesAllowed: clampPushes(pushesInput.value) });
    rolling = null;
    busy = false;
    render();
    announce(rollSentence(roll));
  }

  async function doPush() {
    if (busy) return;
    const reason = pushReason();
    if (!roll || reason) return announce(`Push unavailable: ${reason}`);
    const before = roll;
    const covered = coverInput.checked;
    const plan = planPush(before, { covered });
    const dice: ThrowDie[] = plan.rerollIds.map((id) => ({ id, kind: before.dice[id]!.kind }));
    if (plan.newDieId !== null) dice.push({ id: plan.newDieId, kind: 'stress' });
    const token = ++generation;
    busy = true;
    press(pushButton);
    sync();
    const values = await throwValues(dice, 'reroll');
    if (token !== generation) return;
    roll = applyPush(before, plan, values);
    busy = false;
    render();
    announce(pushSentence(roll, covered));
  }

  function resetTray(message: string) {
    generation++;
    busy = false;
    roll = null;
    rolling = null;
    writePool(preset);
    coverInput.checked = false;
    pushesInput.value = '1';
    stage?.clear();
    render();
    announce(message);
  }

  /* ---- events ---- */
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    void doRoll();
  });
  rollButton.addEventListener('click', (event) => {
    if (rollButton.getAttribute('aria-disabled') === 'true') {
      event.preventDefault();
      if (!busy) announce('Add at least one die to roll.');
    }
  });
  pushButton.addEventListener('click', () => void doPush());
  resetButton.addEventListener('click', () => resetTray('Tray reset. The dice are cleared.'));
  root.addEventListener('click', (event) => {
    const step = (event.target as Element | null)?.closest<HTMLButtonElement>('[data-step]');
    if (!step || !root.contains(step)) return;
    const input = counts[step.dataset.kind as DieKind];
    if (!input) return;
    const next = clampPool({ ...readPool(), [step.dataset.kind!]: Number(input.value) + Number(step.dataset.step) });
    writePool(next);
    sync();
  });
  for (const input of Object.values(counts)) {
    input.addEventListener('change', () => {
      writePool(readPool());
      sync();
    });
    input.addEventListener('input', () => sync());
  }
  pushesInput.addEventListener('change', () => {
    const allowed = clampPushes(pushesInput.value);
    pushesInput.value = String(allowed);
    if (roll) roll = { ...roll, pushesAllowed: allowed };
    render();
  });
  coverInput.addEventListener('change', () => sync());

  render();
  if (root.dataset.variant === 'page' && canUse3D()) {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    idle(() => void getStage());
  }

  return {
    load(detail) {
      const d = (detail && typeof detail === 'object' ? detail : {}) as TryRollDetail;
      preset = clampPool(d.pool);
      pushable = d.pushable !== false;
      const summary = describePool(preset) || 'no dice';
      sourceEl.textContent = `${d.label || 'Try this roll'}: ${summary}`;
      resetTray(`Loaded ${summary}.${pushable ? '' : ' This roll cannot be Pushed.'} Press Roll.`);
      if (canUse3D()) void getStage();
    },
    focusRoll() {
      rollButton.focus();
    },
  };
}
