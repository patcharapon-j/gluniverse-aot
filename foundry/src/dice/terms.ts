/**
 * The four die kinds as DiceTerm denominations (ADR-0026; foundry/design/asset-inventory.md, Dice
 * So Nice presets): `db` base, `dg` Gear, `ds` Stress, `dt` Titan. Each is a d6 whose total is its
 * successes (6, or 5 and 6 for Titan Dice), so a WofRoll's total is the roll's raw successes.
 * Dice So Nice reads the type as "d" + denomination, which is why the ids match its presets.
 */
import type { DiceFaces, DieKind } from '../rules/roll.ts';

export const DENOMINATIONS: Record<DieKind, string> = { base: 'b', gear: 'g', stress: 's', titan: 't' };

let WofRollClass: any = null;

/** The system's Roll class, once defineDice has run. */
export function WofRoll(): any {
  return WofRollClass;
}

export function defineDice(): void {
  const DiceTerm = foundry.dice.terms.DiceTerm;
  const W = CONFIG.WOF;
  const faces = (id: string) => (W.dieTypes as { id: string; successFaces: number[] }[]).find((d) => d.id === id)?.successFaces ?? [6];

  function dieClass(kind: DieKind, className: string, success: number[], label: string) {
    class WofDie extends DiceTerm {
      static DENOMINATION = DENOMINATIONS[kind];
      static SUCCESS_FACES = success;
      static KIND = kind;
      constructor(termData: any = {}) {
        super({ ...termData, faces: 6 });
      }
      async roll(options: any = {}) {
        const result = await super.roll(options);
        if ((this.constructor as any).SUCCESS_FACES.includes(result.result)) result.success = true;
        else if (result.result === 1 && (kind === 'gear' || kind === 'stress')) result.failure = true;
        return result;
      }
      get total() {
        if (!this._evaluated) return undefined;
        return this.results.filter((r: any) => r.active && (this.constructor as any).SUCCESS_FACES.includes(r.result)).length;
      }
      getResultCSS(result: any) {
        return [kind, 'd6', result.success ? 'success' : null, result.failure ? 'failure' : null, result.rerolled ? 'rerolled' : null, result.discarded ? 'discarded' : null];
      }
      get flavor() {
        return this.options.flavor ?? game.i18n.localize(label);
      }
    }
    Object.defineProperty(WofDie, 'name', { value: className });
    return WofDie;
  }

  const terms = {
    base: dieClass('base', 'WofBaseDie', faces('base'), 'WOF.Roll.die.base'),
    gear: dieClass('gear', 'WofGearDie', faces('gear'), 'WOF.Roll.die.gear'),
    stress: dieClass('stress', 'WofStressDie', faces('stress'), 'WOF.Roll.die.stress'),
    titan: dieClass('titan', 'WofTitanDie', W.titanDice.successFaces, 'WOF.Roll.die.titan'),
  };
  for (const cls of Object.values(terms)) {
    CONFIG.Dice.terms[(cls as any).DENOMINATION] = cls;
    CONFIG.Dice.termTypes[cls.name] = cls;
    CONFIG.Dice.types.push(cls);
  }

  class WofRollImpl extends foundry.dice.Roll {
    /** A pool as a formula, leaving out empty kinds: "5db + 1dg + 3ds". */
    static formulaFor(counts: Partial<Record<DieKind, number>>): string {
      const parts = (Object.keys(DENOMINATIONS) as DieKind[]).filter((k) => (counts[k] ?? 0) > 0).map((k) => `${counts[k]}d${DENOMINATIONS[k]}`);
      return parts.join(' + ') || '0';
    }

    static async rollPool(counts: Partial<Record<DieKind, number>>, options: Record<string, unknown> = {}) {
      const roll = new (this as any)(this.formulaFor(counts), {}, options);
      await roll.evaluate();
      return roll;
    }

    /** Faces rolled by kind, in order. */
    facesOf(kind: DieKind): number[] {
      return this.dice.filter((d: any) => d.constructor.KIND === kind).flatMap((d: any) => d.results.filter((r: any) => r.active).map((r: any) => r.result));
    }

    get pool(): DiceFaces {
      return { base: this.facesOf('base'), gear: this.facesOf('gear'), stress: this.facesOf('stress') };
    }
  }
  Object.defineProperty(WofRollImpl, 'name', { value: 'WofRoll' });
  CONFIG.Dice.rolls.push(WofRollImpl);
  WofRollClass = WofRollImpl;
}

/** Marks every result of a roll hidden, so Dice So Nice never shows it (its chat hook or showForRoll). */
export function hideDice(roll: any): void {
  for (const die of roll.dice) for (const r of die.results) r.hidden = true;
}

/** Shows a roll with Dice So Nice when it is installed; resolves at once otherwise. */
export async function showDice(roll: any, whisper: string[] | null = null, blind = false): Promise<void> {
  const dice3d = (game as any).dice3d;
  if (!dice3d) return;
  try {
    await dice3d.showForRoll(roll, game.user, true, whisper, blind);
  } catch (err) {
    console.warn('wings-of-freedom | Dice So Nice could not show the roll', err);
  }
}
