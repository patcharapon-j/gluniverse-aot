<script lang="ts">
  import { tooltip } from '../actions.ts';
  import { sheetContext, t } from '../context.ts';
  import { isLostLimbRow, soldierFigure, type FigureInjury } from '../figure.ts';
  import type { InjuryView } from '../soldier-view.ts';

  let {
    injuries,
    healed = [],
    dead = false,
    down = false,
    onpin,
  }: { injuries: InjuryView[]; healed?: { row: string; side: 'left' | 'right' | null }[]; dead?: boolean; down?: boolean; onpin: (id: string) => void } = $props();
  const { uid } = sheetContext();

  const fig = $derived.by(() => {
    const list: FigureInjury[] = injuries.map((w) => ({
      id: w.id,
      row: w.row,
      label: w.name,
      location: w.location,
      side: w.side,
      type: w.type,
      severity: w.severity,
      treated: w.treated,
    }));
    const aria = injuries.length
      ? t('WOF.Sheet.figure.aria', {
          list: injuries
            .map((w) => `${w.name}, ${[w.side ? t(`WOF.Side.${w.side}`) : '', w.locationLabel].filter(Boolean).join(' ')}, ${t(w.treated ? 'WOF.Sheet.injury.treated' : 'WOF.Sheet.injury.untreated')}`)
            .join('; '),
        })
      : t('WOF.Sheet.figure.ariaNone');
    const healedLost = healed.filter((h) => isLostLimbRow(h.row)).map((h) => ({ location: h.row.split('-')[0], side: h.side }));
    return soldierFigure(list, `${uid}-fig`, aria, { healedLost, dead, down });
  });
</script>

<div class="figwrap soldierfig">
  {@html fig.svg}
  {#if dead}<span class="stamp figstamp kia">{t('WOF.Sheet.figure.kia')}</span>{:else if down}<span class="stamp figstamp">{t('WOF.Actor.Base.FIELDS.down.label')}</span>{/if}
  {#each fig.pins as p (p.id)}
    <button type="button" class="pin" class:treated={p.treated} style="left:{p.left};top:{p.top}" aria-label={p.label} use:tooltip={p.label} onclick={() => onpin(p.id)}>{p.n}</button>
  {/each}
</div>
