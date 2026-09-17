# Direction preview spec (milestone 1)

Three previews, one per direction, same content, equal effort. Each is ONE self-contained HTML file published as a claude.ai Artifact, so it must obey the Artifact page contract:
- No <!doctype>/<html>/<head>/<body>; start with <title> then <style>.
- Scripts only from cdnjs.cloudflare.com or cdn.jsdelivr.net/npm/ (pin exact versions). three.js via <script type="importmap"> from jsdelivr (e.g. three@0.180.0 build/three.module.js + examples/jsm addons). anime.js v4 from jsdelivr (verify the exact bundle path with context7 or the npm file listing). cannon-es from jsdelivr if dice need physics.
- Fonts only from Google Fonts, with fallback stacks. Every image inline as a data: URI (downscale site icons to about 160px webp; keep the whole file under 4 MB).
- No fetch/XHR, no downloads, no sound. Page must not scroll horizontally at 400px (the sheet can collapse to one column on phones; desktop at 1280-1600px is the primary target).
- Single committed look is allowed; paint body background and all colours explicitly.
- Respect prefers-reduced-motion (still frame, no ambient loops). One WebGL context for the whole page (a shared renderer; use scissor/viewport or one full-page canvas behind the DOM). Dispose nothing leaks.
- anime.js drives all DOM motion from one `MOTION` token object (easings, durations). three.js drives materials, particles, dice.
- Top of the page: a slim bar with the direction name, a one-line pitch, and a Full / Reduced / Off effects toggle that actually works.

## Content (identical across directions)
Sample soldier (plainly an example): **Petra Hollis**, Specialty Slayer, Origin Trost District, Haven the Garrison mess, Drive "Keep Mari alive", Rank Private, XP 3, Class Rank 7th.
- Attributes: Strength 3, Agility 5, Wits 3, Perception 4, Instinct 3, Empathy 2.
- Talents: Twin Blades 2 (dice), Nape Hunter 1 (dice), Cold Nerve 1 (rule).
- Vitals rail (always visible): portrait (use the Slayer specialty icon or an abstract silhouette, not a named character), Health 5 boxes with 2 lost, Stress 3 (min 1 from one Scar), Resolve 3, Down flag off, ODM Gear 3/3, Gas Rating 4 + 1 spare canister, Blade sets: 3 in handles + 2 carried.
- Tabs: Soldier, Kit, Wounds & Mind, Record. Soldier tab and Wounds & Mind tab must be fully built; Kit and Record at least sketched. Tab switching must be animated and satisfying.
  - Soldier: six attributes, Specialty, Talents with levels, Action Catalog quick-roll list (Nape Strike, Body-Part Strike, Dodge, Fly, Read, Rally, Fear Roll).
  - Wounds & Mind: one Critical Injury (Cracked ribs, left side, treated, 4 healing days left), Scars 1 ("Saw the wall fall"), Grief 0/3, Stress track with Stress Dice explained.
- Interactions that must work: clicking a Health box toggles it; Stress +/−; gas canister spends; blade set breaks; each change animates and the WebGL layer reacts (e.g. stress raises tension in the frame).
- Roll card (in a chat-like column): "Nape Strike" = Agility 5 + Twin Blades 2 + Gear 2 (blades) + Stress 3. Show base dice (bone), Gear Dice (gunmetal), Stress Dice (wax red) apart; one Stress Die shows 1 so Push is disabled with a reason, the auto Stress Response line appears, and an applied-changes line with an Undo button. Also a clickable "Roll again" that replays the dice animation (three.js dice, successes on 6, the Wings emblem on the 6 face). A second card variant or toggle where no Stress Die shows 1 so Push and Cover are live and Push re-rolls non-6 base/stress dice.
- Titan panel (GM side): "Medium Titan", Tempo 1, Nape Depth 4, Regeneration clock 3; body silhouette with Eyes, Left/Right Arm, Left/Right Leg, each clickable through intact -> wounded -> broken; Openings count; Attention ladder with the current holder; Next Behavior shown as hidden (sealed).
- Die colours: base #ede6d2 bone, gear #56605f gunmetal, stress #8b2a21 wax red, titan #b38467 flesh (titan dice succeed on 5-6). Dice kinds must differ in material, not colour alone.

## Assets
Site icons (webp) in /Users/frostnoxia/Developer/gluniverse-aot-foundry/site/src/assets/icons (attr-*, specialty-*, die-*, body-*, harm-*, injury-*, gear-*, tier-*, titan-*, roll-push, roll-stress, brand-emblem, seal-wax) and brand wordmarks in site/src/assets/brand. Use them where they fit; otherwise use procedural textures (shaders, canvas noise). Do not call Codex; new assets come after the lock.
