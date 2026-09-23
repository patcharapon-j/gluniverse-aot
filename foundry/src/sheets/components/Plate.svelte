<script lang="ts">
  /**
   * The photographic plate every actor sheet wears in its header: the character's image, the ways
   * to change it (browse, upload, drop a file on it), and the door to the Token editor.
   *
   * `size="slim"` is the Dossier's small clipped plate (52 x 62, dossier.css): no caption, and the
   * browse, upload and Token buttons in an overlay that shows on hover and on focus.
   */
  import { contextMenu, tooltip } from '../actions.ts';
  import { t } from '../context.ts';
  import { browseImage, openTokenStudio, resetImage, saveUploadedImage, type ImageTargets } from '../portrait.ts';

  let {
    actor,
    src,
    alt,
    caption = '',
    editable = false,
    size = 'full',
  }: { actor: any; src: string; alt: string; caption?: string; editable?: boolean; size?: 'full' | 'slim' } = $props();

  let file: HTMLInputElement | undefined = $state();
  let over = $state(false);
  let busy = $state(false);

  /** Uploads and saves one file, keeping the plate busy so a second drop cannot race the first. */
  async function take(dropped: File | null | undefined, targets: ImageTargets = { portrait: true }) {
    if (!editable || busy || !dropped) return;
    busy = true;
    try {
      await saveUploadedImage(actor, dropped, targets);
    } finally {
      busy = false;
    }
  }

  function onDrop(event: DragEvent) {
    const dropped = event.dataTransfer?.files?.[0];
    if (!editable || !dropped) return;
    // A dropped image is ours; anything else is left to the sheet's own drop handling.
    event.preventDefault();
    event.stopPropagation();
    over = false;
    take(dropped, { portrait: true, token: true });
  }

  function onDragOver(event: DragEvent) {
    if (!editable || !event.dataTransfer?.types.includes('Files')) return;
    event.preventDefault();
    event.stopPropagation();
    over = true;
  }

  const menu = () => [
    { label: t('WOF.Sheet.portrait.browse'), icon: 'fa-solid fa-folder-open', visible: editable, onClick: () => browseImage(actor, { portrait: true }) },
    { label: t('WOF.Sheet.portrait.upload'), icon: 'fa-solid fa-upload', visible: editable, onClick: () => file?.click() },
    { label: t('WOF.Sheet.portrait.tokenBrowse'), icon: 'fa-solid fa-image', visible: editable, onClick: () => browseImage(actor, { token: true }) },
    { label: t('WOF.Sheet.portrait.tokenFromPortrait'), icon: 'fa-solid fa-clone', visible: editable, onClick: () => actor.update({ 'prototypeToken.texture.src': actor.img }) },
    { label: t('WOF.Sheet.token.open'), icon: 'fa-solid fa-user-pen', visible: editable, onClick: () => openTokenStudio(actor) },
    { label: t('WOF.Sheet.portrait.reset'), icon: 'fa-solid fa-rotate-left', visible: editable, onClick: () => resetImage(actor, { portrait: true, token: true }) },
  ];
</script>

<figure
  class="plate"
  class:slim={size === 'slim'}
  class:over
  class:busy
  use:contextMenu={menu}
  ondrop={onDrop}
  ondragover={onDragOver}
  ondragleave={() => (over = false)}
>
  {#if size === 'slim'}
    <svg class="clip" viewBox="0 0 12 30" aria-hidden="true"><path d="M3 26V6a3 3 0 0 1 6 0v19a4.5 4.5 0 0 1-9 0V9" fill="none" stroke="#9aa1a6" stroke-width="1.6" stroke-linecap="round" /><path d="M3.4 26V6.2" stroke="#e7ecee" stroke-width=".6" stroke-linecap="round" /></svg>
  {/if}
  {#if editable}
    <button
      type="button"
      class="plate-img"
      aria-label={t('WOF.Sheet.header.portraitEdit')}
      use:tooltip={t('WOF.Sheet.header.portraitEdit')}
      onclick={() => browseImage(actor, { portrait: true })}
    ><img {src} {alt} data-edit="img" /></button>
    <div class="plate-acts">
      <button type="button" class="pbtn" aria-label={t('WOF.Sheet.portrait.browse')} use:tooltip={t('WOF.Sheet.portrait.browse')} onclick={() => browseImage(actor, { portrait: true })}>
        <i class="fa-solid fa-folder-open" inert></i>
      </button>
      <button type="button" class="pbtn" disabled={busy} aria-label={t('WOF.Sheet.portrait.upload')} use:tooltip={t('WOF.Sheet.portrait.uploadTip')} onclick={() => file?.click()}>
        <i class="fa-solid {busy ? 'fa-spinner' : 'fa-upload'}" inert></i>
      </button>
      <button type="button" class="pbtn" aria-label={t('WOF.Sheet.token.open')} use:tooltip={t('WOF.Sheet.token.tip')} onclick={() => openTokenStudio(actor)}>
        <i class="fa-solid fa-user-pen" inert></i>
      </button>
    </div>
    <input
      class="sr"
      type="file"
      accept="image/*"
      bind:this={file}
      aria-label={t('WOF.Sheet.portrait.upload')}
      onchange={(e) => {
        take(e.currentTarget.files?.[0], { portrait: true });
        e.currentTarget.value = '';
      }}
    />
  {:else}
    <img {src} {alt} data-edit="img" class="disabled" />
  {/if}

  {#if size !== 'slim' && caption}<figcaption>{caption}</figcaption>{/if}
</figure>
