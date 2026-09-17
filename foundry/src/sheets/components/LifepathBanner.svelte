<script lang="ts">
  /** On an empty Soldier, the offer to open the Lifepath wizard; on an unfinished one, to resume it. */
  import { iconPath } from '../../art.ts';
  import { openLifepath } from '../../lifepath/wizard-app.ts';
  import { settle } from '../../lifepath/components/motion.ts';
  import { t } from '../context.ts';

  let { offer, sheet }: { offer: { kind: 'open' | 'resume'; step: number }; sheet: any } = $props();
</script>

<div class="lp-banner" role="note">
  <img class="ic s32" src={iconPath('seal-wax')} alt="" />
  <div class="lp-banner-text">
    <strong>{t(offer.kind === 'open' ? 'WOF.Lifepath.banner.emptyTitle' : 'WOF.Lifepath.banner.resumeTitle')}</strong>
    <span>{t(offer.kind === 'open' ? 'WOF.Lifepath.banner.emptyText' : 'WOF.Lifepath.banner.resumeText', { step: offer.step })}</span>
  </div>
  {#if offer.kind === 'open'}<span class="stamp" use:settle>{t('WOF.Lifepath.banner.stamp')}</span>{/if}
  <button type="button" class="mini red" onclick={() => openLifepath(sheet.document)}>
    <i class="fa-solid fa-stamp" inert></i>{t(offer.kind === 'open' ? 'WOF.Lifepath.banner.open' : 'WOF.Lifepath.banner.resume')}
  </button>
</div>
