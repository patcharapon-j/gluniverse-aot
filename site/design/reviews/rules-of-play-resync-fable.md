# Rules accuracy review: The Rules of Play (Circumstances resync)

Page: `site/src/content/rules/rules-of-play.mdx`. Sources: `docs/rules/01-core-rules.md` (C), `data/core/dice-pool.yaml` (DP). Tables, Fig. 1, Fig. 2, Fig. 4, DiceKey, and all four worked examples reproduce their sources; the Circumstances ladder and the failure menu match the YAML rows except as noted.

1. **Major.** "What a ruling never touches", third bullet (mdx 264) calls the Death Roll and the performance roll "rolls that are not attribute rolls". Both are attribute rolls (C 62; DP `roll_exceptions`), and mdx 84 says so. Source C 49 says "the fixed rolls and their tables". Fix: replace "the rolls that are not attribute rolls" with "the fixed rolls".

2. **Major.** `PushSteps.astro`, step 2: "A comrade who could Help you may Cover you." C 157 says "one eligible comrade", and Cover eligibility differs from Help's: a Squadmate can Help but never Covers (mdx 391; C 192), and in a Titan Engagement a spent action bars Help but not Covering (C 191-198). Fix: "One eligible comrade may offer to Cover you before any die is rolled again."

3. **Major.** Failure menu, "A fall" row (`core-tables.ts` 173-176) drops the default height: DP 195-198 and C 45 say "low or high as the GM names from the height, or low if the GM names none". Fix: add "or low if the GM names none" after "from the height".

4. **Minor.** mdx 242: "Damage that empties your last Health box still does what all damage does" has no source in C 50 or DP 219, which only require the GM to state current Health. Fix: cut the clause and keep the Health statement.

5. **Minor.** mdx 244 omits that in a fight a called roll's success never gives found Squad Supply, since a called search is made outside a fight (DP 227-232; C 52). Fix: add "and never Squad Supply found in a fight".

6. **Minor.** mdx 262 lists "Help" as untouched by rulings; C 49 says "Help's effect and cap", since on a called roll the GM does rule who can Help and may name its cost (mdx 491, 503). Fix: "Help's effect and cap".
