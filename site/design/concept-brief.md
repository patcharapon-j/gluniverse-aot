# Wings of Freedom website: design concept brief

You are building ONE of three design concepts for the Wings of Freedom compendium website. The owner will compare the three and pick a look and feel. The concept is a single self-contained HTML page published as a Claude Artifact.

## The product

Wings of Freedom is a tabletop roleplaying game set in the world of Attack on Titan. Players are soldiers of the Survey Corps: they build squads, ride out beyond the Walls on Expeditions, and fight Titans with ODM gear and blades. It is lethal, tense, and about teamwork. The final website is a professional compendium players browse to learn the game: Home, Learn to Play, Player's Guide, Compendium, GM's Guide, Reference.

## What the concept page must show (stacked sections, with a small sticky nav to jump between them)

1. **Landing hero**: the game's name, one tagline you propose (the owner approves taglines, so write one that fits your direction), a short 1 to 2 sentence pitch, and the site's entry points: Learn to Play, Player's Guide, Compendium, GM's Guide. Include the main nav as the real site would have it.
2. **A rules page**: "Pushing Your Luck", using the content below. It must teach, not dump text: a step diagram of the Push, a visual key for the four kinds of dice, a worked example, and a "Try this roll" button (it can animate a simple dice result or just show the pressed state; a full physics dice tray is NOT required).
3. **Compendium entries**: one Talent card (Clean Cut) and one Titan profile card (Medium Titan with its Behavior Table), using the content below. Show them the way a browsable, filterable compendium would (a hint of filter chips and neighbouring cards is good).

## Hard rules

- **Voice**: a finished, professional TTRPG product. Direct second person ("You roll..."). Never use design or development language: no "ADR", "OQ", "YAML", "data", "schema", "playtest", "probe", "simulator", "provisional", "system", "entry", "catalog id". No em dashes anywhere in the copy; use periods, commas, or colons.
- **Game terms** stay capitalized as given: Push, Stress, Stress Die, Stress Response, Gear Die, base die, Cover, Talent, Specialty, Titan, Nape, Nape Depth, Body Part, Behavior Table, Attack Dice, Tempo, Critical Injury, Survey Corps, ODM Gear, Expedition.
- **Art**: the final site uses semi-realistic, high-quality anime illustrations (original soldiers only, never canon characters like Levi or Eren) generated later. In this concept use PLACEHOLDER art only: CSS/SVG compositions, silhouettes, gradients, or framed placeholders that make the layout and mood clear. Do not load external images (they are blocked). Canon places, uniforms, ODM gear, the Wings of Freedom emblem shape, and generic Titan silhouettes are fine to evoke.
- **Game icons** (dice kinds, Talent type, Titan size, attack tiers) will be generated later as painted icons; use simple placeholder inline SVGs in a consistent style for now.
- **Interface icons** (nav, search, arrows, filters): Font Awesome Free, loaded as the JS build from cdnjs: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/js/all.min.js`. Use `<i class="fa-solid fa-...">` tags.
- **Fonts**: pick a heading, body, and (if useful) accent font for YOUR direction using the google-fonts skill. Load them from fonts.googleapis.com with real fallback stacks.
- **One light live effect** matching your direction (specified in your task). If you use three.js, load it from cdnjs with a pinned version (e.g. `https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.min.js`), keep it to the hero, and honour `prefers-reduced-motion` with a static fallback. Keep it smooth on a laptop.
- **Responsive** down to 400px wide, 16px minimum side gutter, no horizontal body scroll.
- Before writing the file you MUST load the `artifact-design` skill and follow the Artifact tool's publishing rules. A single committed look is fine (you may skip dark-mode tokens) but paint body background and colors explicitly.
- Aim for a page that looks like a premium, shipped product site, not a template. Distinctive typography, deliberate layout, restrained motion.

## Content (already written for players; you may tighten it, but do not change any rule)

### Pushing Your Luck

In-world opener (use or adapt): "Every recruit learns to count their gas. Every veteran learns when to spend it anyway." Survey Corps field manual.

A roll that falls short does not have to be the end. You can **Push**: take on Stress for a second chance at successes. You can Push after a failed roll or after a successful one.

**How a Push works**
1. **Roll.** Roll your pool and count every 6 as a success. If any Stress Die shows a 1, you suffer a Stress Response and cannot Push.
2. **Decide.** Keep what you rolled, or Push. A comrade nearby may Cover you before any die is rolled again.
3. **Take the Stress.** Gain 1 Stress and add 1 new Stress Die to your pool. If a comrade Covers you, they gain the Stress instead, and no new Stress Die is added.
4. **Roll again.** Pick up every die not showing a 6, except a Gear Die showing 1, plus the new Stress Die, and roll them. Dice showing 6 stay. **A Gear Die showing 1 is locked**: it stays showing 1.
5. **Check your Stress Dice.** If any Stress Die now shows a 1, you suffer a Stress Response. A roll never causes more than one Stress Response.

**You cannot Push when**
- a Stress Die showed a 1 on this roll;
- the roll says it cannot be Pushed, like a Death Roll;
- you have already Pushed this roll (you get one Push unless a Talent gives you more).

**The four kinds of dice** (each kind is its own colour at the table)
- **Base dice**: your attribute, Talent, and bonus dice. Succeed on a 6. A 1 means nothing.
- **Gear Dice**: dice from your equipment. Succeed on a 6. Never rolled again on a Push. If you Pushed, each Gear Die showing a 1 wears that gear down by one. Worn-out ODM Gear jams.
- **Stress Dice**: one for each point of Stress you carry. Succeed on a 6. A 1 triggers a Stress Response.
- **Titan Attack Dice**: rolled by the GM for a Titan's attack. Succeed on a 5 or 6. Never Pushed.

**Pushing burns gas.** If you Push a roll made with ODM Gear, your Gas Roll that round uses three dice instead of two.

**Example.** Mira swings in at the Nape. Her pool is 5 base dice, 2 Gear Dice, and 1 Stress Die. She rolls one 6: not enough to kill. She Pushes: she gains 1 Stress, adds a second Stress Die, and rolls every base and Stress die that isn't a 6. Her Gear Dice stay put, and one of them shows a 1, so her gear will wear. The reroll turns up two more 6s. Three successes, and no Stress Die showing a 1.

### Compendium: Talent

**Clean Cut** · Slayer Talent · Dice Talent · Levels 1 to 3
"Practice at the single deep cut through the Nape that kills."
Add 1 base die per level to your Nape Strike rolls.
Neighbouring Slayer Talents (for the grid): **Hamstringer** ("Practice at cutting ankles, arms, and eyes to bring a Titan down." Adds dice to Body Part Strike), **Ground Work** ("Practice at finishing a Titan that is down on the ground." Adds dice to Nape Strike and Body Part Strike against a grounded Titan).
Specialties for filter chips: Slayer, Flier, Hunter, Tactician, Leader, Medic, Engineer, Rider, Brawler. Attributes: Strength, Agility, Wits, Perception, Instinct, Empathy.

### Compendium: Titan

**Medium Titan** · 6 to 10 m
- **Tempo** 1: how many times it acts each round.
- **Nape Depth** 4: successes a single Nape strike needs to kill it.
- **Regeneration** 3: rounds before its wounds close.
- **Body Parts**: Eyes, Left Arm, Right Arm, Left Leg, Right Leg. Toughness 2 each.
- **Attack Dice** by tier: Terrorize 3, Control 6, Kill 9.

**Behavior Table** (roll a d6 when it acts)
| d6 | Behavior | Tier | Attack Dice | What happens |
|---|---|---|---|---|
| 1 | Fixed Grin | Terrorize | 3 | 1 Stress. It reveals its next move. "It stops dead, its eyes wide and empty above a fixed grin, and the way its weight shifts shows what it will do next." |
| 2 | Snap Short | Terrorize | 3 | 1 Stress. "Its jaws snap shut on the air a moment too late." |
| 3 | Swat | Control | 6 | A crushing Critical Injury that cannot kill. "It swings the back of its hand at the soldier, as a person swats at a fly." |
| 4 | Shake Off | Control | 6 | Knocks the soldier loose. "It hunches and rolls its shoulders to shake off whatever clings there." |
| 5 | Bite | Kill | 9 | A Critical Injury to the torso that can kill. "It lunges with its jaws wide and closes them on the soldier's body." |
| 6 | Grab | Kill | 9 | Seizes the soldier. "Its fingers close around the soldier and do not let go." |

## Deliverable

1. Write the page to `<scratchpad>/concepts/<your-slug>.html`.
2. Take a screenshot to check it using the Browser pane tools: open your OWN new tab (`tabs_create`), load the file, check desktop and a ~400px width, fix problems, then close your tab. Other concept agents share the pane, so never touch tabs you did not create.
3. Publish it with the Artifact tool (title: the concept name, e.g. "Field Manual Concept"; pick a fitting favicon emoji).
4. Final report, under 150 words: Artifact URL, font pairing, tagline, palette (hex), the live effect, and two sentences on why this direction suits the game.
