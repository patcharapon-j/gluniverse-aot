/**
 * The "Wings of Freedom preferences" menu (core-plan 2e): the viewer's Motion and Gore as stamped
 * choices on a paper slip, and, for the GM, the auto-apply switches of ADR-0026 in the same place.
 * Motion and Gore also stay in Configure Settings as plain entries.
 */
import { SYSTEM_ID } from './config.ts';
import { APPLY_CATEGORIES } from './rules/roll.ts';
import { iconPath } from './art.ts';

const esc = (s: string) => foundry.utils.escapeHTML(s);
const t = (k: string) => game.i18n.localize(k);

const MOTION = ['full', 'reduced', 'off'] as const;
const GORE = ['low', 'standard', 'graphic'] as const;

function choiceGroup(setting: 'motion' | 'gore', values: readonly string[], current: string): string {
  const cards = values
    .map(
      (v) => `<label class="pchoice">
  <input type="radio" name="${setting}" value="${v}" ${v === current ? 'checked' : ''}>
  <span class="pc-body"><strong>${esc(t(`WOF.Settings.${setting}.${v}`))}</strong><small>${esc(t(`WOF.Settings.${setting}.${v}Hint`))}</small></span>
</label>`,
    )
    .join('');
  return `<fieldset class="pgroup">
  <legend>${esc(t(`WOF.Settings.${setting}.name`))}</legend>
  <p class="note">${esc(t(`WOF.Settings.${setting}.menuHint`))}</p>
  <div class="pchoices">${cards}</div>
</fieldset>`;
}

export function defineSettingsMenu() {
  const { ApplicationV2 } = foundry.applications.api;

  class WofPreferences extends ApplicationV2 {
    static DEFAULT_OPTIONS = {
      id: 'wof-preferences',
      tag: 'form',
      classes: ['wof-app', 'wof-prefs-app'],
      window: { title: 'WOF.Settings.menu.title', icon: 'fa-solid fa-sliders', contentClasses: ['wof-content'] },
      position: { width: 460, height: 'auto' },
      form: { handler: WofPreferences.#onSubmit, closeOnSubmit: true },
    };

    async _renderHTML() {
      const isGM = game.user.isGM;
      const motion = game.settings.get(SYSTEM_ID, 'motion') as string;
      const gore = game.settings.get(SYSTEM_ID, 'gore') as string;
      const os = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? `<p class="note warn">${esc(t('WOF.Settings.motion.osReduced'))}</p>` : '';
      const lp = CONFIG.WOF.lifepath as { campaignChoices: { id: string }[]; campaignYears: { min: number; max: number } };
      const choice = game.settings.get(SYSTEM_ID, 'campaignChoice') as string;
      const year = Number(game.settings.get(SYSTEM_ID, 'campaignYear'));
      const years = Array.from({ length: lp.campaignYears.max - lp.campaignYears.min + 1 }, (_, i) => lp.campaignYears.min + i);
      const campaign = isGM
        ? `<fieldset class="pgroup gm">
  <legend>${esc(t('WOF.Settings.menu.campaign'))}<span class="gm-tag">${esc(t('WOF.Settings.menu.gmOnly'))}</span></legend>
  <label class="pfield"><span>${esc(t('WOF.Settings.campaignChoice.name'))}</span><select name="campaignChoice">${lp.campaignChoices
    .map((c, i) => `<option value="${esc(c.id)}" ${c.id === choice ? 'selected' : ''}>${esc(t(`WOF.Settings.campaignChoice.option${i}`))}</option>`)
    .join('')}</select></label>
  <p class="note">${esc(t('WOF.Settings.campaignChoice.menuHint'))}</p>
  <label class="pfield"><span>${esc(t('WOF.Settings.campaignYear.name'))}</span><select name="campaignYear"><option value="0">${esc(t('WOF.Settings.campaignYear.unset'))}</option>${years
    .map((y) => `<option value="${y}" ${y === year ? 'selected' : ''}>${y}</option>`)
    .join('')}</select></label>
  <p class="note">${esc(t('WOF.Settings.campaignYear.menuHint'))}</p>
</fieldset>`
        : '';
      const apply = isGM
        ? `<fieldset class="pgroup gm">
  <legend>${esc(t('WOF.Settings.menu.autoApply'))}<span class="gm-tag">${esc(t('WOF.Settings.menu.gmOnly'))}</span></legend>
  <p class="note">${esc(t('WOF.Settings.menu.autoApplyHint'))}</p>
  ${APPLY_CATEGORIES.map((c) => {
    const on = game.settings.get(SYSTEM_ID, `autoApply.${c}`) !== false;
    return `<label class="ptoggle" data-tooltip="${esc(t(`WOF.Settings.autoApply.${c}.hint`))}">
    <input type="checkbox" name="autoApply.${c}" ${on ? 'checked' : ''}>
    <span class="pt-box" aria-hidden="true"></span>
    <span>${esc(t(`WOF.Settings.autoApply.${c}.short`))}</span>
  </label>`;
  }).join('')}
</fieldset>`
        : '';
      return `<div class="wof-prefs">
  <header class="ph"><img src="${iconPath('brand-emblem')}" alt=""><div><span class="kicker">${esc(t('WOF.SystemTitle'))}</span><h2>${esc(t('WOF.Settings.menu.heading'))}</h2></div></header>
  <p class="note">${esc(t('WOF.Settings.menu.intro'))}</p>
  ${choiceGroup('motion', MOTION, motion)}${os}
  ${choiceGroup('gore', GORE, gore)}
  ${campaign}
  ${apply}
  <footer class="pf"><button type="submit" class="pbtn"><i class="fa-solid fa-stamp" inert></i>${esc(t('WOF.Settings.menu.save'))}</button></footer>
</div>`;
    }

    _replaceHTML(result: string, content: HTMLElement) {
      content.innerHTML = result;
    }

    static async #onSubmit(_event: Event, _form: HTMLFormElement, formData: any) {
      const data = formData.object as Record<string, unknown>;
      const writes: Promise<unknown>[] = [];
      for (const key of ['motion', 'gore']) {
        if (typeof data[key] === 'string' && data[key] !== game.settings.get(SYSTEM_ID, key)) writes.push(game.settings.set(SYSTEM_ID, key, data[key]));
      }
      if (game.user.isGM) {
        if (typeof data.campaignChoice === 'string' && data.campaignChoice !== game.settings.get(SYSTEM_ID, 'campaignChoice')) writes.push(game.settings.set(SYSTEM_ID, 'campaignChoice', data.campaignChoice));
        const year = Number(data.campaignYear);
        if (Number.isInteger(year) && year !== Number(game.settings.get(SYSTEM_ID, 'campaignYear'))) writes.push(game.settings.set(SYSTEM_ID, 'campaignYear', year));
        for (const c of APPLY_CATEGORIES) {
          const on = !!(data[`autoApply.${c}`] ?? foundry.utils.getProperty(data, `autoApply.${c}`));
          if (on !== (game.settings.get(SYSTEM_ID, `autoApply.${c}`) !== false)) writes.push(game.settings.set(SYSTEM_ID, `autoApply.${c}`, on));
        }
      }
      await Promise.all(writes);
    }
  }
  Object.defineProperty(WofPreferences, 'name', { value: 'WofPreferences' });
  return WofPreferences;
}

export function registerSettingsMenu(): void {
  game.settings.registerMenu(SYSTEM_ID, 'preferences', {
    name: 'WOF.Settings.menu.name',
    label: 'WOF.Settings.menu.label',
    hint: 'WOF.Settings.menu.hint',
    icon: 'fa-solid fa-sliders',
    type: defineSettingsMenu(),
    restricted: false,
  });
}
