# ODM equipment header

The PC header holds two physical equipment assemblies on muted olive mounting plates. Editable SVG and state transitions live in `src/sheets/components/EquipmentRig.svelte`; `Vitals.svelte` supplies actor state and existing document actions. No external images or extra runtime dependencies are required.

| Mechanism | Silhouette and materials | Values and states |
| --- | --- | --- |
| Fitted gas tank | Horizontal pressure vessel, retaining clamps, threaded valve and hose | Segmented inspection window and numeral within the vessel. No detached gas counter. |
| Spare gas | Top-down tank caps in square sockets | Each cap has its own segmented ring and remaining-gas numeral. Click or keyboard-activate any cap to fit it. Empty sockets stay visible. Additional spares extend the rack. |
| Fitted blades | Large horizontal segmented blade and mechanical control grip | Gear Dice remain below. Breakage drops two blade fragments, leaving the grip. |
| Stored blades | Horizontal magazine with protruding blade ends | Exact carried-set count engraved above the magazine; three illustrative rails. Replacement travels from the magazine toward the grip. |

Gas spends pulse the vessel and vent briefly. Tank swaps lift a cap and seat a replacement; a partly used outgoing tank returns to storage with its remaining gas. Empty outgoing tanks are discarded by the existing rules. Equal-level swaps also animate. Incoming actor-state changes animate without requiring a local button click. Reduced motion uses a brief brightness change; Off and OS reduced-motion disable travel and fragments. Changing motion preferences clears previous visual events. Read-only controls remain disabled; document writes are serialized while pending.

Health sits above Stress in the left column, with a compact Resolve number beside Stress. The Resolve calculation is available in its tooltip and accessible label. Below 860px, that stacked summary spans the sheet above the two equipment assemblies. The equipment has no perpetual animation or additional WebGL context.

## Interactive proof

Open `design/equipment-preview.html`. It mounts the production Header, Vitals and EquipmentRig components with sample character data and simulated document actions. Controls change only that preview. Rebuild from the `foundry` directory with `node tools/build-equipment-preview.mjs`; run browser checks with `node tools/check-equipment-browser.cjs`. The browser check uses bundled Playwright, or `PLAYWRIGHT_MODULE_PATH`, and installed Chrome.

This fixture validates rendering and motion, not live Foundry persistence or engagement permissions. Existing `soldier-ops.ts` and rules remain authoritative in the real sheet.

## Verification

- Existing sheet rules: 20 passing tests, including returning partly used canisters and discarding empty ones.
- TypeScript and Svelte checks pass; production code builds. Existing Titan wording synchronization warnings remain.
- Browser exercises gas spend, partial and equal-level tank swaps, empty-tank replacement, blade break and magazine transfer, Reduced/Off motion, read-only controls, five widths from 400 to 1080px, and eight independently displayed spares.
- Live Foundry interaction is not checked.

Merge verification: main's Play/Edit header, portrait controls and hover-card styles are preserved. The full suite passes all 376 tests with six fixture files temporarily normalized to LF; their original bytes were restored afterward. Without that normalization, six existing string-replacement tests fail on this Windows checkout. TypeScript, Svelte and production build checks pass, and the regenerated equipment browser fixture passes.
