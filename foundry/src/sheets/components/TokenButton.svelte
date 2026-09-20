<script lang="ts">
  /**
   * The door to the Token editor: Phil's Token Studio when that module is installed, Foundry's own
   * prototype Token sheet when it is not (portrait.ts).
   */
  import { tooltip } from '../actions.ts';
  import { t } from '../context.ts';
  import { openPrototypeToken, openTokenStudio, tokenStudioActive } from '../portrait.ts';

  let { actor, editable = false, label = false }: { actor: any; editable?: boolean; label?: boolean } = $props();

  const tip = () => (tokenStudioActive() ? t('WOF.Sheet.token.tip') : t('WOF.Sheet.token.tipFallback'));
</script>

{#if editable}
  <span class="tokbtn">
    <button
      type="button"
      class="mini tiny"
      class:icon={!label}
      aria-label={t('WOF.Sheet.token.open')}
      use:tooltip={tip()}
      onclick={() => openTokenStudio(actor)}
    ><i class="fa-solid fa-user-pen" inert></i>{#if label}{t('WOF.Sheet.token.open')}{/if}</button>
    <button
      type="button"
      class="mini tiny icon"
      aria-label={t('WOF.Sheet.token.prototype')}
      use:tooltip={t('WOF.Sheet.token.prototype')}
      onclick={() => openPrototypeToken(actor)}
    ><i class="fa-solid fa-circle-dot" inert></i></button>
  </span>
{/if}
