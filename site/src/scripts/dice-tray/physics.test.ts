import { Quaternion } from 'cannon-es';
import { describe, expect, it } from 'vitest';
import { createDiceWorld, FLAT, topFace, traySize } from './physics';

/** A small seeded random source, so throws repeat exactly. */
function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('reading a die', () => {
  it('reads the face pointing up', () => {
    expect(topFace(new Quaternion())).toMatchObject({ value: 2, up: 1 });
    const onSide = new Quaternion();
    onSide.setFromEuler(0, 0, Math.PI / 2);
    expect(topFace(onSide).value).toBe(1);
    const flipped = new Quaternion();
    flipped.setFromEuler(Math.PI, 0, 0);
    expect(topFace(flipped).value).toBe(5);
  });
});

describe('throwing dice', () => {
  it('brings every die to rest flat inside the box, for any box shape and pool size', () => {
    const cases: Array<[aspect: number, count: number]> = [
      [1.6, 8],
      [1, 15],
      [2, 24],
      [0.8, 30],
      [1.6, 42],
    ];
    let snapped = 0;
    let thrown = 0;
    for (const [aspect, count] of cases) {
      for (let seed = 1; seed <= 4; seed++) {
        const size = traySize(aspect);
        const world = createDiceWorld(size, seeded(seed * 1000 + count));
        const ids = Array.from({ length: count }, (_, i) => i);
        const result = world.throwDice(ids);
        thrown += count;
        snapped += result.snapped;
        expect(result.values.size).toBe(count);
        expect(result.frames.length).toBeGreaterThan(1);
        for (const id of ids) {
          const pose = world.pose(id)!;
          const face = topFace(pose.quaternion);
          expect(face.up).toBeGreaterThanOrEqual(FLAT);
          expect(result.values.get(id)).toBe(face.value);
          expect(Math.abs(pose.position.x)).toBeLessThan(size.width / 2);
          expect(Math.abs(pose.position.z)).toBeLessThan(size.depth / 2);
        }
        // No two dice at rest on the same level overlap.
        for (let a = 0; a < count; a++) {
          for (let b = a + 1; b < count; b++) {
            const pa = world.pose(a)!.position;
            const pb = world.pose(b)!.position;
            if (Math.abs(pa.y - pb.y) < 0.5) expect(Math.hypot(pa.x - pb.x, pa.z - pb.z)).toBeGreaterThan(0.9);
          }
        }
      }
    }
    // Laying a die flat is a backstop for a die wedged on its edge, not how dice usually land.
    expect(snapped / thrown).toBeLessThan(0.05);
  }, 60_000);

  it('rolls every face over many throws', () => {
    const world = createDiceWorld(traySize(1.6), seeded(7));
    const seen = new Map<number, number>();
    for (let i = 0; i < 12; i++) {
      for (const value of world.throwDice([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).values.values()) seen.set(value, (seen.get(value) ?? 0) + 1);
    }
    expect([...seen.keys()].sort()).toEqual([1, 2, 3, 4, 5, 6]);
  }, 60_000);

  it('leaves dice that are not thrown exactly where they lie', () => {
    const world = createDiceWorld(traySize(1.6), seeded(42));
    world.throwDice([0, 1, 2, 3, 4, 5]);
    const kept = [0, 2, 4].map((id) => {
      const { position: p, quaternion: q } = world.pose(id)!;
      return [p.x, p.y, p.z, q.x, q.y, q.z, q.w];
    });
    const again = world.throwDice([1, 3, 5, 6]);
    expect(again.values.size).toBe(4);
    expect(world.ids()).toHaveLength(7);
    [0, 2, 4].forEach((id, i) => {
      const { position: p, quaternion: q } = world.pose(id)!;
      [p.x, p.y, p.z, q.x, q.y, q.z, q.w].forEach((v, k) => expect(v).toBeCloseTo(kept[i]![k]!, 6));
    });
  }, 60_000);
});
