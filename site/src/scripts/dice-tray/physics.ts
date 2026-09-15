/**
 * Dice Tray physics with cannon-es: a box with a cloth floor and walls, dice
 * thrown in from one side, and a face read only once every die lies flat.
 * No rendering here, so throws can be tested in Node.
 *
 * cannon-es is used because it is plain JavaScript (about 24 kB gzipped) with
 * sleep detection built in; a WebAssembly engine such as Rapier ships a much
 * larger binary for a box of at most a few dozen dice.
 */
import { Body, Box, ContactMaterial, Material, Plane, Quaternion, Vec3, World } from 'cannon-es';

/** Face values in BoxGeometry group order: +X, -X, +Y, -Y, +Z, -Z. Opposite faces sum to 7. */
export const FACE_VALUES = [1, 6, 2, 5, 3, 4] as const;
const FACE_NORMALS = [new Vec3(1, 0, 0), new Vec3(-1, 0, 0), new Vec3(0, 1, 0), new Vec3(0, -1, 0), new Vec3(0, 0, 1), new Vec3(0, 0, -1)];
const UP = new Vec3(0, 1, 0);

export const STEP = 1 / 60;
const MAX_STEPS = 60 * 6;
/** After this many steps, heavy damping calms any die still rocking. */
const CALM_AFTER = 60 * 3;
/** Steps a die must stay still to count as at rest. */
const REST_STEPS = 8;
/** A die is flat when its top face normal is within about 16 degrees of up. */
export const FLAT = 0.96;
/** Hops each die may take off an edge before it is laid flat. */
const MAX_HOPS = 3;
/** No hops this close to the end of a throw: there would be no time to land. */
const LAST_HOP = MAX_STEPS - 45;
const CEILING = 9;
const FLOOR_AREA = 96;
const DAMPING = 0.08;

export interface TraySize {
  width: number;
  depth: number;
}

/** Floor size for a stage of this aspect ratio, keeping the same floor area. */
export function traySize(aspect: number): TraySize {
  const a = Math.min(2, Math.max(0.8, Number.isFinite(aspect) && aspect > 0 ? aspect : 1.6));
  const width = Math.sqrt(FLOOR_AREA * a);
  return { width, depth: FLOOR_AREA / width };
}

export interface Pose {
  position: { x: number; y: number; z: number };
  quaternion: { x: number; y: number; z: number; w: number };
}

export interface ThrowResult {
  /** One frame per step: position (3) and quaternion (4) of each thrown die, in throw order. */
  frames: Float32Array[];
  /** Settled face of each thrown die, by id. */
  values: Map<number, number>;
  steps: number;
  /** Hops taken by dice that came to rest on an edge. */
  nudges: number;
  /** Dice that never came to rest flat and were laid flat on their nearest face. */
  snapped: number;
}

export interface DiceWorld {
  readonly size: TraySize;
  ids(): number[];
  pose(id: number): Pose | undefined;
  /** Freezes every die not listed where it lies, adds any new ids, and throws the listed dice to rest. */
  throwDice(ids: readonly number[]): ThrowResult;
  clear(): void;
}

const scratch = new Vec3();

/** The face pointing up, how close to straight up it points, and its normal in world space. */
export function topFace(q: { x: number; y: number; z: number; w: number }): { value: number; up: number; normal: Vec3 } {
  const quaternion = q instanceof Quaternion ? q : new Quaternion(q.x, q.y, q.z, q.w);
  let best = 0;
  let up = -2;
  FACE_NORMALS.forEach((normal, i) => {
    quaternion.vmult(normal, scratch);
    if (scratch.y > up) {
      up = scratch.y;
      best = i;
    }
  });
  return { value: FACE_VALUES[best]!, up, normal: quaternion.vmult(FACE_NORMALS[best]!) };
}

export function createDiceWorld(size: TraySize, random: () => number = Math.random): DiceWorld {
  const { width: W, depth: D } = size;
  const rand = (min: number, max: number) => min + random() * (max - min);

  const world = new World({ gravity: new Vec3(0, -48, 0), allowSleep: true });
  (world.solver as unknown as { iterations: number }).iterations = 14;
  const dieMaterial = new Material('die');
  const floorMaterial = new Material('floor');
  const wallMaterial = new Material('wall');
  world.addContactMaterial(new ContactMaterial(dieMaterial, floorMaterial, { friction: 0.32, restitution: 0.22 }));
  world.addContactMaterial(new ContactMaterial(dieMaterial, wallMaterial, { friction: 0.08, restitution: 0.45 }));
  world.addContactMaterial(new ContactMaterial(dieMaterial, dieMaterial, { friction: 0.3, restitution: 0.18 }));
  const addPlane = (material: Material, [px, py, pz]: [number, number, number], [ex, ey, ez]: [number, number, number]) => {
    const body = new Body({ mass: 0, material, shape: new Plane() });
    body.position.set(px, py, pz);
    body.quaternion.setFromEuler(ex, ey, ez);
    world.addBody(body);
  };
  addPlane(floorMaterial, [0, 0, 0], [-Math.PI / 2, 0, 0]);
  addPlane(wallMaterial, [-W / 2, 0, 0], [0, Math.PI / 2, 0]);
  addPlane(wallMaterial, [W / 2, 0, 0], [0, -Math.PI / 2, 0]);
  addPlane(wallMaterial, [0, 0, -D / 2], [0, 0, 0]);
  addPlane(wallMaterial, [0, 0, D / 2], [0, Math.PI, 0]);
  addPlane(wallMaterial, [0, CEILING, 0], [Math.PI / 2, 0, 0]);

  const dice = new Map<number, Body>();

  function addDie(id: number): Body {
    const body = new Body({
      mass: 1,
      material: dieMaterial,
      shape: new Box(new Vec3(0.5, 0.5, 0.5)),
      linearDamping: DAMPING,
      angularDamping: DAMPING,
      allowSleep: true,
      sleepSpeedLimit: 0.3,
      sleepTimeLimit: 0.15,
    });
    world.addBody(body);
    dice.set(id, body);
    return body;
  }

  function setMass(body: Body, dynamic: boolean) {
    body.type = dynamic ? Body.DYNAMIC : Body.STATIC;
    body.mass = dynamic ? 1 : 0;
    body.updateMassProperties();
    body.velocity.setZero();
    body.angularVelocity.setZero();
  }

  /** Throws from both side walls at once, so a big pool spreads over the cloth instead of piling up. */
  function launch(list: readonly Body[]) {
    const first = random() < 0.5 ? -1 : 1;
    const pitch = 1.3;
    const cols = Math.max(1, Math.floor((D - 1.6) / pitch));
    const zStart = -((cols - 1) * pitch) / 2;
    list.forEach((body, i) => {
      const side = i % 2 === 0 ? first : -first;
      const slot = list.length > 6 ? Math.floor(i / 2) : i;
      const col = slot % cols;
      const layer = Math.floor(slot / cols) % 3;
      const row = Math.floor(slot / (cols * 3));
      setMass(body, true);
      body.linearDamping = DAMPING;
      body.angularDamping = DAMPING;
      const throwSide = list.length > 6 ? side : first;
      body.position.set(throwSide * (W / 2 - 0.9 - layer * pitch), 1.6 + row * 1.35, zStart + col * pitch);
      body.quaternion.setFromEuler(rand(0, Math.PI * 2), rand(0, Math.PI * 2), rand(0, Math.PI * 2));
      body.velocity.set(-throwSide * rand(9, 16), rand(1, 4), rand(-3.5, 3.5));
      body.angularVelocity.set(rand(-14, 14), rand(-14, 14), rand(-14, 14));
      body.wakeUp();
      body.aabbNeedsUpdate = true;
    });
  }

  const inBox = (body: Body) =>
    Math.abs(body.position.x) < W / 2 && Math.abs(body.position.z) < D / 2 && body.position.y > 0 && body.position.y < CEILING;

  /** The free spot on the cloth nearest this die, clear of every other die. */
  function freeSpot(body: Body): Vec3 | null {
    const spots: Vec3[] = [];
    for (let x = -W / 2 + 0.7; x <= W / 2 - 0.7; x += 0.6) {
      for (let z = -D / 2 + 0.7; z <= D / 2 - 0.7; z += 0.6) spots.push(new Vec3(x, 0.5, z));
    }
    spots.sort((a, b) => a.distanceTo(body.position) - b.distanceTo(body.position));
    const others = [...dice.values()].filter((other) => other !== body);
    return (
      spots.find((spot) => others.every((o) => o.position.y > 1.1 || Math.hypot(o.position.x - spot.x, o.position.z - spot.z) >= 1.3)) ??
      null
    );
  }

  /** Flicks a die up and over toward the nearest free spot, spinning, so it lands again on open cloth. */
  function hop(body: Body) {
    if (!inBox(body)) body.position.set(rand(-W / 4, W / 4), 2.5, rand(-D / 4, D / 4));
    const spot = freeSpot(body);
    body.wakeUp();
    body.linearDamping = DAMPING;
    body.angularDamping = DAMPING;
    // About a quarter second in the air under this gravity, so 4x the gap lands it near the spot.
    if (spot) body.velocity.set((spot.x - body.position.x) * 4, 6, (spot.z - body.position.z) * 4);
    else body.velocity.set(rand(-1.5, 1.5), 5, rand(-1.5, 1.5));
    body.angularVelocity.set(rand(-8, 8), rand(-8, 8), rand(-8, 8));
  }

  /**
   * The backstop for a die that never came to rest flat: it is laid on the face
   * nearest up, which keeps its reading, at the nearest free spot on the cloth.
   */
  function layFlat(body: Body) {
    const { normal } = topFace(body.quaternion);
    const fix = new Quaternion().setFromVectors(normal, UP);
    body.quaternion.copy(fix.mult(body.quaternion));
    body.quaternion.normalize();
    const spot = freeSpot(body);
    if (spot) body.position.copy(spot);
    else
      body.position.set(
        Math.max(-W / 2 + 0.5, Math.min(W / 2 - 0.5, body.position.x)),
        Math.max(0.5, Math.min(CEILING - 0.5, body.position.y)),
        Math.max(-D / 2 + 0.5, Math.min(D / 2 - 0.5, body.position.z)),
      );
    body.velocity.setZero();
    body.angularVelocity.setZero();
  }

  return {
    size,
    ids: () => [...dice.keys()],
    pose(id) {
      const body = dice.get(id);
      return body ? { position: body.position, quaternion: body.quaternion } : undefined;
    },
    throwDice(ids) {
      const list = ids.map((id) => dice.get(id) ?? addDie(id));
      const thrown = new Set(list);
      for (const body of dice.values()) if (!thrown.has(body)) setMass(body, false);
      launch(list);

      const frames: Float32Array[] = [];
      const record = () => {
        const frame = new Float32Array(list.length * 7);
        list.forEach(({ position: p, quaternion: q }, i) => frame.set([p.x, p.y, p.z, q.x, q.y, q.z, q.w], i * 7));
        frames.push(frame);
      };
      record();

      const rest = list.map(() => 0);
      const hops = list.map(() => 0);
      let steps = 0;
      let nudges = 0;
      while (steps < MAX_STEPS) {
        world.step(STEP);
        steps++;
        record();
        list.forEach((body, i) => {
          const still =
            body.sleepState === Body.SLEEPING || (body.velocity.lengthSquared() < 0.1 && body.angularVelocity.lengthSquared() < 0.25);
          rest[i] = still ? rest[i]! + 1 : 0;
        });
        if (steps === CALM_AFTER) {
          for (const body of list) {
            body.linearDamping = 0.7;
            body.angularDamping = 0.7;
          }
        }
        if (steps < 20) continue;
        const settled = list.map((body) => topFace(body.quaternion).up >= FLAT && inBox(body));
        // A die left resting on its edge, against a wall or another die, hops toward open cloth.
        if (steps <= LAST_HOP) {
          list.forEach((body, i) => {
            if (settled[i] || hops[i]! >= MAX_HOPS || rest[i]! < REST_STEPS * 2) return;
            hop(body);
            hops[i]!++;
            rest[i] = 0;
            nudges++;
          });
        }
        // Done when every die is at rest, flat or out of hops.
        if (list.every((_, i) => rest[i]! >= REST_STEPS && (settled[i] || hops[i]! >= MAX_HOPS || steps > LAST_HOP))) break;
      }

      let snapped = 0;
      for (const body of list) {
        if (topFace(body.quaternion).up < FLAT || !inBox(body)) {
          layFlat(body);
          snapped++;
        }
        body.linearDamping = DAMPING;
        body.angularDamping = DAMPING;
      }
      if (snapped) record();

      // Trim the still tail so playback ends when the dice stop.
      let lastMoving = 0;
      for (let i = 1; i < frames.length; i++) {
        const a = frames[i]!;
        const b = frames[i - 1]!;
        for (let k = 0; k < a.length; k++) {
          if (Math.abs(a[k]! - b[k]!) > 1e-4) {
            lastMoving = i;
            break;
          }
        }
      }

      return {
        frames: frames.slice(0, Math.min(frames.length, lastMoving + 8)),
        values: new Map(ids.map((id) => [id, topFace(dice.get(id)!.quaternion).value])),
        steps,
        nudges,
        snapped,
      };
    },
    clear() {
      for (const body of dice.values()) world.removeBody(body);
      dice.clear();
    },
  };
}
