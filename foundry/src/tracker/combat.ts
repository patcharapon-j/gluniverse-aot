/**
 * The Engagement tracker's documents (foundry/docs/tracker-plan.md, section 2): a Titan Engagement or
 * a Skirmish is a Combat of system type `engagement`; each dealt card is a Combatant of type `card`.
 * Core combat features keep working; the order, the round, and the card events follow
 * data/engagement/round.yaml.
 */
import { SYSTEM_ID } from '../config.ts';
import { turnOrder } from '../rules/engagement/cards.ts';
import { fieldKit } from '../models/fields.ts';

export const ENGAGEMENT = 'engagement';
export const CARD = 'card';

/** Hooks the engine registers, so this file stays free of the engine's imports. */
export interface CombatHandlers {
  cardStart(combat: any, combatant: any, skipped: boolean): Promise<void>;
  cardEnd(combat: any, combatant: any, skipped: boolean): Promise<void>;
  nextTurn(combat: any): Promise<any>;
  nextRound(combat: any): Promise<any>;
  deal(combat: any): Promise<any>;
  changed(combat: any): void;
}

let handlers: CombatHandlers | null = null;
export const setCombatHandlers = (h: CombatHandlers) => (handlers = h);

export const isEngagement = (combat: any) => combat?.type === ENGAGEMENT;

export function defineCombatModels() {
  const k = fieldKit();
  const { f } = k;
  const TypeDataModel = foundry.abstract.TypeDataModel;
  const strings = () => new f.ArrayField(new f.StringField({ required: true, blank: false }));
  const nullableSchema = (fields: Record<string, unknown>) => new f.SchemaField(fields, { required: true, nullable: true, initial: null });

  class EngagementModel extends TypeDataModel {
    static defineSchema() {
      return {
        mode: k.choice(['titan', 'skirmish'], 'titan'),
        step: k.choice(['setup', 'wings', 'deal', 'swap', 'play', 'end', 'closing'], 'setup'),
        anchor: k.str('wooded'),
        soldiers: strings(),
        titans: new f.ArrayField(
          new f.SchemaField({
            key: k.str(),
            label: k.str(),
            status: k.choice(['focus', 'corpse'], 'focus'),
            entered: k.nonNeg(1),
            grab: nullableSchema({ soldier: k.str(), counted: k.nonNeg(), lifted: k.bool(), arm: k.str() }),
            decoy: nullableSchema({ name: k.str(), left: k.nonNeg() }),
            decoysInRow: k.nonNeg(),
            flags: new f.SchemaField({ hooked: strings(), hurt: strings(), loud: strings() }),
            dodges: new f.ArrayField(new f.SchemaField({ soldier: k.str(), successes: k.nonNeg(), message: k.str() })),
            pending: k.str(),
            clearTheHand: k.bool(),
            // batch F2: rises 1 at the end of every even-numbered round to FRENZY_CAP, and is added to the behavior roll.
            frenzy: k.nonNeg(),
            // The zone it stands in (decision batch 16; zones.yaml). A corpse's never changes.
            zone: k.nonNeg(),
          }),
        ),
        background: new f.ArrayField(
          new f.SchemaField({ name: k.str(), titan: k.str(), actor: k.str(), length: k.int(6, { min: 1 }), filled: k.nonNeg(), entered: k.nonNeg() }),
        ),
        retreat: new f.SchemaField({ length: k.int(8, { min: 1 }), filled: k.nonNeg(), active: k.bool(), began: k.nonNeg() }),
        // The field (zones.yaml; decision batch 16, 16-2 to 16-6): its size, field rating, and each zone's
        // rating, start rating, Sparse grace, and effects. Null outside a Titan Engagement.
        field: nullableSchema({
          size: k.choice(['skirmish', 'standard', 'set-piece'], 'standard'),
          rating: k.str('wooded'),
          centre: k.int(7, { min: 1 }),
          squadStart: k.int(8, { min: 1 }),
          zones: new f.ArrayField(
            new f.SchemaField({
              n: k.int(1, { min: 1 }),
              q: k.int(0),
              r: k.int(0),
              rating: k.str('wooded'),
              start: k.str('wooded'),
              graceUsed: k.bool(),
              effects: new f.ArrayField(new f.StringField({ required: true, blank: false, choices: ['steam', 'dust', 'fire'] })),
            }),
          ),
        }),
        // Each soldier's zone (null: off field), attachment, and horse's zone (zones.yaml, attachments; 16-8, 16-25).
        placements: new f.ArrayField(
          new f.SchemaField({
            soldier: k.str(),
            zone: k.nullableInt({ min: 1 }),
            kind: k.choice(['ground', 'anchored', 'on-body', 'blind-spot', 'grabbed', 'pinned'], 'ground'),
            body: k.str(),
            horseZone: k.nullableInt({ min: 1 }),
            // A rising stamp set when the attachment became on-body, blind-spot, or grabbed: the board's order of arrival.
            since: k.nonNeg(),
          }),
        ),
        // The last thing the board animates, written in the same update as the change it shows; seq only rises.
        boardEvent: nullableSchema({
          seq: k.nonNeg(),
          kind: k.choice(['stride', 'flight', 'wreck', 'fall', 'steam', 'enter'], 'stride'),
          data: new f.ObjectField(),
        }),
        wings: new f.ArrayField(new f.SchemaField({ mate: k.str(), pc: k.str() })),
        wingsSet: k.bool(),
        wingsOpen: k.bool(),
        reassign: strings(),
        swaps: new f.ArrayField(new f.SchemaField({ a: k.str(), b: k.str(), cardA: k.nonNeg(), cardB: k.nonNeg() })),
        proposal: nullableSchema({ a: k.str(), b: k.str(), by: k.str() }),
        odmUsed: strings(),
        // Soldiers whose move this round is spent (blade-sets.yaml, swap), and who bought a clean line.
        movesSpent: strings(),
        cleanLine: strings(),
        // Soldiers who spent Momentum on quiet this round: they set no flag this turn (anchor-ratings.yaml, spends, quiet; 16-14).
        quiet: strings(),
        tactics: new f.SchemaField({ held: strings(), used: strings() }),
        cloaks: strings(),
        noOneStanding: k.nonNeg(),
        endLog: new f.ArrayField(new f.ObjectField()),
        ended: k.bool(),
        skirmish: new f.SchemaField({
          kind: k.str(),
          name: k.str(),
          night: k.bool(),
          ambush: k.choice(['none', 'squad', 'foes'], 'none'),
          foes: strings(),
          acted: strings(),
          engaged: new f.ArrayField(new f.SchemaField({ soldier: k.str(), foe: k.str() })),
          holds: new f.ArrayField(new f.SchemaField({ soldier: k.str(), foe: k.str() })),
          lastAttacker: new f.ArrayField(new f.SchemaField({ foe: k.str(), soldier: k.str() })),
          gritRise: k.nonNeg(),
          parleyRise: k.nonNeg(),
          broken: k.bool(),
          left: strings(),
          sizedUp: k.bool(),
          parleyed: strings(),
          yielded: k.bool(),
        }),
      };
    }
  }

  class CardModel extends TypeDataModel {
    static defineSchema() {
      return {
        kind: k.choice(['soldier', 'wing', 'titan', 'foe-group'], 'soldier'),
        titan: k.str(),
        index: k.nonNeg(),
      };
    }
  }

  return { combat: { [ENGAGEMENT]: EngagementModel }, combatant: { [CARD]: CardModel } };
}

/** Turn order for an engagement: the combatants that hold a card this round, in card order. */
export function engagementTurns(combat: any): any[] {
  const sys = combat.system;
  const all = [...combat.combatants] as any[];
  const byKind = (kind: string) => all.filter((c) => c.system?.kind === kind);
  const soldiers: Record<string, number | null> = {};
  const soldierCombatant = new Map<string, any>();
  for (const c of [...byKind('soldier'), ...byKind('wing')]) {
    soldiers[c.actorId] = Number.isFinite(c.initiative) && c.system.kind === 'soldier' ? c.initiative : null;
    soldierCombatant.set(c.actorId, c);
  }
  const titans: Record<string, number[]> = {};
  const titanCombatant = new Map<string, any>();
  for (const c of byKind('titan')) {
    if (!Number.isFinite(c.initiative)) continue;
    (titans[c.system.titan] ??= []).push(c.initiative);
    titanCombatant.set(`${c.system.titan}:${c.initiative}`, c);
  }
  const group = byKind('foe-group')[0];
  const wings = Object.fromEntries((sys.wings ?? []).map((w: any) => [w.mate, w.pc]));
  const order = turnOrder({
    soldiers,
    titans: Object.fromEntries(Object.entries(titans).map(([k, v]) => [k, v.sort((a, b) => a - b)])),
    wings: sys.mode === 'skirmish' ? {} : wings,
    foeGroup: group ? { id: group.id, card: Number.isFinite(group.initiative) ? group.initiative : null } : null,
    ambush: sys.mode === 'skirmish' && combat.round === 1 && sys.skirmish.ambush !== 'none' ? sys.skirmish.ambush : null,
  });
  return order
    .map((s) => (s.kind === 'titan' ? titanCombatant.get(`${s.id}:${s.card}`) : s.kind === 'foe-group' ? group : soldierCombatant.get(s.id)))
    .filter(Boolean);
}

export function defineCombatDocuments() {
  const Combat = foundry.documents.Combat;
  const Combatant = foundry.documents.Combatant;

  class WofCombat extends Combat {
    get isEngagement() {
      return isEngagement(this);
    }

    setupTurns() {
      if (!this.isEngagement) return super.setupTurns();
      this.turns ||= [];
      const turns = engagementTurns(this);
      if (this.turn !== null) {
        if (!turns.length) this.turn = null;
        else if (this.turn < 0) this.turn = 0;
        else if (this.turn >= turns.length) this.turn = turns.length - 1;
      }
      turns.forEach((c: any, i: number) => (c.turnNumber = i));
      this.current = this._getCurrentState(this.turn === null ? undefined : turns[this.turn]);
      if (!this.previous) this.previous = this.current;
      return (this.turns = turns);
    }

    async startCombat() {
      if (!this.isEngagement) return super.startCombat();
      return this;
    }

    async nextTurn() {
      if (!this.isEngagement || !handlers) return super.nextTurn();
      return handlers.nextTurn(this);
    }

    async previousTurn() {
      if (!this.isEngagement) return super.previousTurn();
      if (this.system.step !== 'play' || !this.turn) return this;
      return super.previousTurn();
    }

    async nextRound() {
      if (!this.isEngagement || !handlers) return super.nextRound();
      return handlers.nextRound(this);
    }

    async previousRound() {
      if (!this.isEngagement) return super.previousRound();
      ui.notifications.warn(game.i18n.localize('WOF.Tracker.noRewind'));
      return this;
    }

    async rollInitiative(ids: any, options: any) {
      if (!this.isEngagement || !handlers) return super.rollInitiative(ids, options);
      if (game.user.isGM && this.system.step === 'deal') await handlers.deal(this);
      else ui.notifications.info(game.i18n.localize('WOF.Tracker.dealtNotRolled'));
      return this;
    }

    async rollAll() {
      return this.rollInitiative([], {});
    }

    async rollNPC() {
      return this.rollInitiative([], {});
    }

    _onUpdate(changed: any, options: any, userId: string) {
      if (this.isEngagement && changed.system) this.setupTurns();
      super._onUpdate(changed, options, userId);
      if (this.isEngagement) {
        if (changed.system && this.isView) ui.combat?.render();
        handlers?.changed(this);
      }
    }

    _onUpdateDescendantDocuments(...args: any[]) {
      super._onUpdateDescendantDocuments(...args);
      if (this.isEngagement) handlers?.changed(this);
    }

    _onCreateDescendantDocuments(...args: any[]) {
      super._onCreateDescendantDocuments(...args);
      if (this.isEngagement) handlers?.changed(this);
    }

    _onDeleteDescendantDocuments(...args: any[]) {
      super._onDeleteDescendantDocuments(...args);
      if (this.isEngagement) handlers?.changed(this);
    }

    _onCreate(data: any, options: any, userId: string) {
      // An engagement is created already at round 1, before any combatant sets up the turn state.
      if (this.isEngagement) this.previous ??= this.current;
      super._onCreate(data, options, userId);
      if (this.isEngagement) handlers?.changed(this);
    }

    _onDelete(options: any, userId: string) {
      super._onDelete(options, userId);
      if (this.isEngagement) handlers?.changed(this);
    }

    async _onStartTurn(combatant: any, context: any) {
      await super._onStartTurn(combatant, context);
      if (this.isEngagement && handlers && this.system.step === 'play') await handlers.cardStart(this, combatant, !!context?.skipped);
    }

    async _onEndTurn(combatant: any, context: any) {
      await super._onEndTurn(combatant, context);
      if (this.isEngagement && handlers) await handlers.cardEnd(this, combatant, !!context?.skipped);
    }
  }

  class WofCombatant extends Combatant {
    /** A Wing Squadmate holds no card; the tracker shows "W". */
    get isWing() {
      return this.system?.kind === 'wing';
    }

    getInitiativeRoll() {
      return new foundry.dice.Roll('0');
    }
  }

  Object.defineProperty(WofCombat, 'name', { value: 'WofCombat' });
  Object.defineProperty(WofCombatant, 'name', { value: 'WofCombatant' });
  return { WofCombat, WofCombatant };
}

/** The engagement the tracker shows: the viewed or active combat of type engagement. */
export function currentEngagement(): any | null {
  const viewed = game.combats?.viewed;
  if (isEngagement(viewed)) return viewed;
  const active = game.combats?.active;
  if (isEngagement(active)) return active;
  return [...(game.combats ?? [])].find((c: any) => isEngagement(c) && c.active && !c.system.ended) ?? null;
}

export const FLAG_SCOPE = SYSTEM_ID;
