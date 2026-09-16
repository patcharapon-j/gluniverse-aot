# Direction preview spec, round 2 (milestone 1)

Owner feedback on round 1 (preview-*.html, kept only as history): far too much. The sheet itself is flat, not 3D. three.js is used ONLY for two small vitals widgets (gas canisters and blade sets). Dice So Nice already tumbles dice in real Foundry, so the chat card only shows the result, with each die as an icon. The base look is the owner's Titan World "field dossier" sheet, done better.

## The base: Titan World field dossier
Reference screenshots: foundry/design/reference/{overview,wounds,gear,titan,chat}.png (look at all five). Source (read-only, never edit): "/Users/frostnoxia/Foundry User Data/Data/systems/gluniverse-titan-world" - styles/titan-world.css (tokens lines 11-26, CSS textures lines 34-95), docs/field-dossier-design.md, docs/ui-2.0-spec.md, PRODUCT.md, templates/, module/kit-3d.mjs (its three.js blade/gas rig), module/chat-fx.mjs, module/icons.mjs. You may study and adapt its CSS, tokens, layout and components; this is the owner's own work.
Keep what makes it good: paper in a leather binder, brass eyelets, red margin, numbered file tabs, section rules "§n Title ---- hint [action]", stat cards with big numerals, stamps, hard offset shadows, square corners, CSS-only textures, the product principles in PRODUCT.md (read at a glance mid-combat; physicality is the interface; each viewer controls intensity).
Do better on its known weak spots: no text under 10px (it has 6.5-7.5px labels); one spacing scale (4px base) instead of 37 gap values; a real type scale; consistent component rhythm; a crest/emblem that uses the palette (use site/src/assets/icons/brand-emblem.webp or seal-wax.webp); respect prefers-reduced-motion.

## Artifact page contract (unchanged)
One self-contained HTML file; no <!doctype>/<html>/<head>/<body>; <title> then <style> first. Scripts only from cdnjs.cloudflare.com or cdn.jsdelivr.net/npm/ with pinned versions (three via importmap from jsdelivr; anime.js v4 from jsdelivr). Fonts only from Google Fonts. Images inline as data: URIs (downscale icons to about 96-160px). Under 2 MB. No fetch, no downloads, no sound. No horizontal scroll at 400px (desktop 1100-1400px is the target; the sheet window is about 860x760 like Foundry). Paint body background explicitly.

## Stack for the preview
Flat HTML/CSS; anime.js v4 for all DOM motion from one MOTION token object (subtle, weighty, quick: 120-450ms). three.js ONLY inside the two vitals widgets, one shared renderer, rendering only when a value changes (plus a short settle animation), not a continuous loop. A small Motion setting (Full / Reduced / Off) in a slim top bar; Off shows the widgets as static icons.

## Content (correct per data/)
Sample soldier (an example): Petra Hollis, Specialty Slayer (key attribute Strength), Origin Trost District, Haven the Garrison mess, Canon Tie, Drive "Keep Mari alive", Rank Private, Class Rank 7th, XP 3.
- Attributes (two-fours build, 18 points): Strength 4, Agility 4, Wits 3, Perception 3, Instinct 2, Empathy 2.
- Health 4 = ceil((Str+Agi)/2); 1 box lost. Resolve 3 = ceil((Ins+Emp)/2)=2 + 1 Scar - 0 Grief. Stress 3 (minimum 1 from 1 Scar). Down: no.
- Talents (read real text from data/character/talents.yaml; use player wording from site/ where it exists): Clean Cut 2 (dice, Nape strike), Blade Discipline 1 (rule), Relentless 1 (rule).
- Gear: ODM Gear rating 3/3; Gas Rating 3 of full 3, plus 1 spare canister (3); Blade Set in handles plus 2 carried (read data/gear/blade-sets.yaml for the ratings and wear, and data/gear/odm-gear.yaml for gas). Medical kit 1.
- Scar: "Saw the wall fall". Grief 0/3. One Critical Injury: pick a real row from data/harm/critical-injuries.yaml (with side, treated, healing days left).
- Action Catalog quick rolls (read data/character/action-catalog.yaml for each attribute): Nape strike, Body-part strike, Dodge, Fly, Read, Rally, Fear Roll.

## What to build (one page)
1. Soldier sheet window: header (portrait slot, name, identity line, state tags), persistent vitals (Health boxes, Stress track with minimum, Resolve, Down, and the two three.js widgets: gas canisters with level; blade sets showing wear/breaks), tabs Soldier / Kit / Wounds & Mind / Record. Soldier and Wounds & Mind fully built; Kit and Record sketched. Health box click, Stress +/-, spend gas, wear/break a blade must work and animate.
2. Chat column with result cards (no dice animation): header with action, attribute, Talent, Gear, Circumstances; one row per die kind with each die as an icon showing its face (base bone, Gear gunmetal, Stress wax red; distinct by material/shape, not colour alone; successes on 6 highlighted; a Stress Die 1 marked); big success count; Stakes line; Push and Cover buttons (Push disabled with the reason when a Stress Die shows 1); Stress Response result line; "Applied: +1 Stress" line with Undo. Show two cards: Nape strike with a Stress 1 (Push blocked), and a Dodge where Push is live; clicking Push updates that same card in place (re-rolls non-6 base and Stress dice, +1 Stress).
3. Titan sheet window (GM), modelled on the reference titan.png: Medium Titan (read data/engagement/size-classes.yaml and data/titans/standard-medium.yaml), Tempo, Nape Depth, Regeneration clock, Heave; body figure or part cards for Eyes, Left/Right Arm, Left/Right Leg with Body Part State intact -> wounded -> broken on click and Toughness; Openings; Attention ladder with holder; Next Behavior sealed (hidden). Titan Dice (flesh, succeed on 5-6) shown in a small attack result card.

Top of page: slim bar with the variant name, one-line pitch, and the Motion setting.
