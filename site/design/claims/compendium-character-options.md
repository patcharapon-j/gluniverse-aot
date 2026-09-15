# Claims: Compendium character options

Pages: `/compendium/talents/`, `/compendium/actions/`, `/compendium/specialties/`, `/compendium/origins/`.

Tables are rendered from `data/character/*`; names, numbers, kinds, attributes, gear, levels, lists, D66 ranges, Merit, and Class Rank rows are never retyped. Check these instead:

## Wording files (check each entry against its row)

- `site/src/content/compendium/talent-text.yaml`: trigger and effect of every Rule Talent, keyed by id. Source: `data/character/talents.yaml` row of the same id; referenced tables in its `sources` list. Dice Talent effects are built in `site/src/lib/shared-data.ts` (`diceEffect`) from `max_level`, `names`, and `condition`.
- `site/src/content/compendium/action-text.yaml`: requires, needs, does, help, gear note of every Action Catalog entry, keyed by id. Source: `data/character/action-catalog.yaml` row of the same id plus the table sections it points to (listed in `sources`). Gear lines are built in `shared-data.ts` from `gear`, `requires_gear`, `without_gear`.

## Talents page key

- Dice Talent adds base dice equal to its level to a roll for a named entry meeting its condition; at most one per roll. T 20-24
- Rule Talent applies each time its trigger occurs; stacks with other Rule Talents and the roll's Dice Talent. T 25-28
- "You declare" trigger met at declaration, before requirements, pool, cost checked. T 30-34
- Levels 0 to 3; at most 2 at creation; a one-level Talent held at 1 means having it. T 15-18, 27-28
- Once per Titan Engagement also applies once per Leg, Night Camp, Skirmish; a Titan Engagement or Skirmish inside a Leg or Night Camp has its own use. T 44-52
- Once per Leg, Night Camp, Skirmish, Downtime: once in each, never outside. T 55-65

`T` = `data/character/talents.yaml`.

## Actions page key

- Kinds: action, reaction, roll, option, fixed roll, as the Catalog's kind comments state. AC 13-24
- Gear Dice come from the listed items; an item worn to 0 counts as not had. AC 29-30, 50-52
- Every soldier can attempt every entry. S 22-24

`AC` = `data/character/action-catalog.yaml`, `S` = `data/character/specialties.yaml`.

## Specialties page

- Key attribute is the only attribute that can be rated 6. S 17
- One level in a Talent on the list at Graduation or a build's Talents step, at most level 2. S 19
- Never permission: any soldier attempts any entry and holds any Talent. S 21-24
- The level a Specialty grants never goes into a general Talent. S 34-37
- Medic and Engineer Standard Issue extras (medical kit, tool kit, rating 1). `data/gear/standard-issue.yaml` `by_specialty`

## Origins & Lifepath page

- Drive: shrug off one Fear Roll result per session while its trigger is met. `data/character/enlistment.yaml` 20-28
- Event Talent fallback to the year's curriculum when neither Talent can gain a level. `data/character/training-years.yaml` 17-22
- Performance roll uses the higher of the year's two performance attributes; the Graduation Exam replaces year 3's. TY 31-42
- Merit total from three years sets Class Rank in a class of 200; ranks can be shared; only Top 10 has an effect. `data/character/class-rank.yaml` 10-13, 63-69
- Top 10: Military Police offer declined; +1 key attribute at Graduation, up to 6. CR 64-68; `data/character/attributes.yaml` 74
- A built soldier has no Merit and no Class Rank. CR 71-81
