<script lang="ts">
  import { tooltip } from '../actions.ts';
  import { sheetContext, t } from '../context.ts';
  import { soldierFigure, type FigureInjury } from '../figure.ts';
  import type { InjuryView } from '../soldier-view.ts';

  let { injuries, onpin }: { injuries: InjuryView[]; onpin: (id: string) => void } = $props();
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
    return soldierFigure(list, `${uid}-fig`, aria);
  });
</script>

<div class="figwrap soldierfig">
  {@html fig.svg}
  {#each fig.pins as p (p.id)}
    <button type="button" class="pin" class:treated={p.treated} style="left:{p.left};top:{p.top}" aria-label={p.label} use:tooltip={p.label} onclick={() => onpin(p.id)}>{p.n}</button>
  {/each}
</div>
