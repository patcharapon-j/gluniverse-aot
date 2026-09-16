/**
 * The Wings of Freedom emblem as canvas paths, drawn from the same feather and
 * wing geometry as the `#wing` symbol in SvgDefs.astro. Used for the
 * hero's pressed seal and the emblem faces of the Dice Tray's dice.
 */
const FEATHER = 'M0 0C12-7 34-18 52-16 38-8 19-1 0 5Z';
/** Rotation (degrees) and scale of each feather in one wing. */
const FEATHERS: ReadonlyArray<readonly [number, number]> = [
  [-62, 0.62],
  [-45, 0.84],
  [-28, 1],
  [-11, 0.96],
  [6, 0.74],
];

let featherPath: Path2D | null = null;
const feather = (): Path2D => (featherPath ??= new Path2D(FEATHER));

export interface WingStyle {
  fill: string;
  /** Outline drawn under the second wing, so the two wings read apart. */
  edge?: string;
  edgeWidth?: number;
}

function wing(ctx: CanvasRenderingContext2D, style: WingStyle, outline: boolean): void {
  for (const [deg, s] of FEATHERS) {
    ctx.save();
    ctx.rotate((deg * Math.PI) / 180);
    ctx.scale(s, s);
    if (outline && style.edge) {
      ctx.strokeStyle = style.edge;
      ctx.lineWidth = (style.edgeWidth ?? 2) / s;
      ctx.lineJoin = 'round';
      ctx.stroke(feather());
    }
    ctx.fillStyle = style.fill;
    ctx.fill(feather());
    ctx.restore();
  }
}

/**
 * Crossed wings as on the wax seal, centred on the origin. They span about
 * 82 units wide and 44 tall; scale the context before calling.
 */
export function drawWings(ctx: CanvasRenderingContext2D, style: WingStyle): void {
  ctx.save();
  ctx.translate(0, 18);
  ctx.save();
  ctx.translate(-5, 0);
  wing(ctx, style, false);
  ctx.restore();
  ctx.save();
  ctx.translate(5, 0);
  ctx.scale(-1, 1);
  wing(ctx, style, true);
  ctx.restore();
  ctx.restore();
}
