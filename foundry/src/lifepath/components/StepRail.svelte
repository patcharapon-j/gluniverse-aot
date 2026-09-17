<script lang="ts">
  /** The step rail: numbered file tabs down the file's edge, stamped once filed. */
  import { t } from '../../sheets/context.ts';
  import type { StepId } from '../../rules/lifepath-state.ts';
  import type { WizardView } from '../wizard-app.ts';

  let { view }: { view: WizardView } = $props();
  const r = $derived(view.r);
  const s = $derived(view.state);

  function onKey(event: KeyboardEvent, i: number) {
    const dir = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
    if (!dir) return;
    event.preventDefault();
    const list = (event.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
    if (!list?.length) return;
    const all = [...list];
    const here = all.indexOf(event.currentTarget as HTMLButtonElement);
    all[(here + dir + all.length) % all.length]?.focus();
  }

  const open = (id: StepId) => view.act.goTo(id);
</script>

<nav class="lp-rail" aria-label={t('WOF.Lifepath.rail')}>
  {#each r.rail as id, i (id)}
    {@const st = r.status[id]}
    <button
      type="button"
      class="lp-tab {st}"
      aria-current={s.step === id ? 'step' : undefined}
      disabled={st === 'blocked' || (st !== 'done' && id !== r.current)}
      onclick={() => open(id)}
      onkeydown={(e) => onKey(e, i)}
    >
      <span class="n">{String(i + 1).padStart(2, '0')}</span>
      <span class="tl">{t(`WOF.Lifepath.step.${id}`)}</span>
      {#if st === 'done'}<span class="stamp tab-stamp">{t('WOF.Lifepath.filedShort')}</span>{/if}
      <span class="sr">{t(`WOF.Lifepath.status.${st}`)}</span>
    </button>
  {/each}
</nav>
