/**
 * The GM's called roll (data/core/dice-pool.yaml, called_roll): before any dice, the GM names the
 * entry closest to the act (or an attribute alone), the Circumstances, and the stakes. The call is
 * posted as a card; the soldier's player answers it with the roll dialog, where the three stand fixed.
 */
import type { CallCard } from './card.ts';
import { clock, postCard, t } from './post.ts';
import { attributeEntry } from './roll-action.ts';

const esc = (s: string) => foundry.utils.escapeHTML(s);

export async function callRoll(actor: any): Promise<any> {
  if (!game.user.isGM || !actor) return null;
  const W = CONFIG.WOF;
  const entries = (W.actionCatalog as any[]).filter((e) => e.rolled === 'when_called');
  const attrs = W.attributes as { id: string }[];
  const entryOptions = [
    `<optgroup label="${esc(t('WOF.Roll.call.entries'))}">${entries.map((e) => `<option value="entry:${e.id}">${esc(e.name)}</option>`).join('')}</optgroup>`,
    `<optgroup label="${esc(t('WOF.Roll.call.attributes'))}">${attrs.map((a) => `<option value="attr:${a.id}">${esc(t(`WOF.Attribute.${a.id}`))}</option>`).join('')}</optgroup>`,
  ].join('');
  const steps = (W.circumstances as { id: string; name: string }[]).map((c) => `<option value="${c.id}" ${c.id === 'standard' ? 'selected' : ''}>${esc(c.name)}</option>`).join('');
  const stakes = (W.calledRoll.failureMenu as { id: string }[]).map((m) => `<option value="${m.id}">${esc(t(`WOF.Roll.stakeMenu.${m.id}`))}</option>`).join('');
  const result = await foundry.applications.api.DialogV2.input({
    window: { title: t('WOF.Roll.call.title', { name: actor.name }) },
    classes: ['wof-pick'],
    content: `<p class="hint">${esc(t('WOF.Roll.call.hint'))}</p>
<label class="wof-field"><span>${esc(t('WOF.Roll.call.entry'))}</span><select name="what">${entryOptions}</select></label>
<label class="wof-field"><span>${esc(t('WOF.Roll.circumstances'))}</span><select name="circumstances">${steps}</select></label>
<label class="wof-field"><span>${esc(t('WOF.Roll.stakes'))}</span><select name="stakes">${stakes}</select></label>
<label class="wof-field"><span>${esc(t('WOF.Roll.dialog.stakesDetail'))}</span><input type="text" name="detail"></label>`,
    ok: { label: t('WOF.Roll.call.post') },
  });
  if (!result) return null;
  const [kind, id] = String(result.what).split(':');
  const step = (W.circumstances as { id: string; name: string }[]).find((c) => c.id === result.circumstances) ?? W.circumstances[3];
  const entry = kind === 'entry' ? W.actionCatalogById[id] : attributeEntry(id as any);
  const text = [t(`WOF.Roll.stakeMenu.${result.stakes}`), String(result.detail ?? '').trim()].filter(Boolean).join(': ');
  const card: CallCard = {
    v: 1,
    kind: 'call',
    actor: actor.uuid,
    actorName: actor.name,
    img: actor.img,
    time: clock(),
    ops: [],
    entry: kind === 'entry' ? id : null,
    attribute: kind === 'attr' ? id : entry.attribute,
    label: entry.name,
    circumstances: { id: step.id, name: step.name },
    stakes: { id: String(result.stakes), text },
    needs: W.calledRoll.needs,
    rolled: null,
  };
  return postCard(actor, card, [], 'public');
}
