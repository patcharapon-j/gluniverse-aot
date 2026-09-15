# Chapter 6: Standard Titans — review round 1 (Codex)

## Verdict

Chapter 6's four YAML blocks are complete, render exactly into the prose, use the required Size Class values, cover every D6 result, and remain rollable after every previous-behavior and Broken-part state checked by the supplied validator. All harming behaviors resolve through Chapter 3 Critical Injuries or Chapter 5's non-lethal Grab crush; none kills outright. The standard Medium meets every ADR-0014 band in an independent run.

The round remains open on four Major and two Minor findings. The largest issues are that the Sprinting Abnormal borrows its signature conduct from a Shifter, is unavailable under every written Phase 1 starting procedure, and is accepted under a bar that permits both a trivial race and an unwinnable reference-build sensitivity. Several tables also declare fewer Body Parts than their fiction requires.

## Findings

### 1. Major — The Sprinting Abnormal's signature behaviors are the Female Titan's Shifter tactics

**Location:** `docs/rules/06-standard-titans.md`, lines 264–285; `docs/rules/OPEN-QUESTIONS.md`, OQ-102, lines 2294–2316; `data/titans/sprinting-abnormal.yaml`, `leap` and `snatch`

**Problem:** OQ-102's canon argument joins two different encounters in manga chapter 22/anime episode 17. The ordinary Abnormal ignores the outer guard, runs toward the formation's center, and is brought down by Ness and Siss cutting its legs before the Nape kill. The Titan that then rushes the riders, snatches Siss out of the air, catches Ness's ODM lines, and deliberately changes course is Annie's Female Titan. Those latter acts supply this table's Leap, Snatch, mounted-first/airborne ladder, and the claim that it hunts riders. They are intelligent Shifter tactics, precisely the content this chapter says is later and outside Phase 1.

**Concrete play scenario:** A mounted soldier at Distant automatically outranks everyone. The Titan rolls Snatch and deliberately runs that rider down, plucks them from the saddle, and holds them. That reproduces Annie selecting and intercepting a target, not the ordinary Abnormal's indiscriminate rush toward a concentration of people.

**Fix options:**

1. Base this Abnormal on the ordinary chapter-22 runner: keep the center-breaking sprint, hard legs, and erratic movement, but remove the deliberate Snatch and the mounted/airborne prey ladder.
2. Base it on a documented Pure Abnormal such as the quadrupedal runner/jumper, with a table and ladder that do not reproduce Annie's intelligent counters.
3. Move this stat block to the later Shifter material and draft a Pure Abnormal for Chapter 6.

### 2. Major — Broken limbs do not disable several behaviors that explicitly use those limbs

**Location:** `data/titans/standard-small.yaml`, lines 49–63 and 114–128; `data/titans/standard-medium.yaml`, lines 52–65; `data/titans/standard-large.yaml`, lines 85–98; `data/titans/sprinting-abnormal.yaml`, lines 56–69 and 105–119

**Problem:** `body_parts_used` is the rule that makes a Broken kind illegal, but several entries contradict their own fiction:

- Small **Totter Closer** uses no leg, although the chapter expressly says cut legs prevent it from tottering.
- Small **Grab** needs one arm while its text requires both hands.
- Medium **Groping Reach** closes a hand but uses no arm.
- Large **Brush Off** drags a hand over its neck but uses no arm.
- Sprinting Abnormal **Run Past** pounds past at speed but uses no leg; **Snatch** can run down a Distant rider with an arm and no leg.

The validator consequently proves only the declared dependencies, not that Broken-part disabling leaves fictionally legal entries. The omissions also make limb attacks less valuable than Chapter 5 promises.

**Concrete play scenario:** The Squad Breaks both of the Small Titan's legs. Result 2 still resolves Totter Closer instead of moving up, directly contradicting section 6.2's design note. A legless Sprinting Abnormal can likewise resolve Run Past, or Snatch a foot soldier or rider from Distant.

**Fix options:**

1. Add the necessary kinds, including two arms for the two-handed Grab, then re-run every previous-plus-Broken kill share, full fight, and Jam cell.
2. Where the added dependency would violate the one-half kill-share bound, rewrite the behavior so the declared surviving anatomy can actually perform it.
3. Change the Small Grab to one hand and restrict Distant Snatch to a target state the format can express, while giving its chase a leg dependency.

### 3. Major — The only Abnormal is dead content in the written Phase 1 game

**Location:** `docs/rules/06-standard-titans.md`, lines 3–5 and 40–48; `docs/rules/OPEN-QUESTIONS.md`, OQ-104, lines 2351–2367

**Problem:** The chapter presents the Sprinting Abnormal as one of the Titans a Squad fights in Phase 1, then makes it impossible for any written Phase 1 procedure to select. OQ-104(a) defers the only entry path to unwritten Mission Briefs or another hypothetical starting rule. That is not a playable Phase 1 rule and leaves the Abnormal, its hidden Read facts, its Fear Roll, and all its tuning work unreachable.

**Concrete play scenario:** A group plays every currently written Titan Engagement and follows the interim setup table exactly. Every Small, Medium, and Large result resolves to the standard roster entry; no roll or deterministic step can ever introduce the Sprinting Abnormal.

**Fix options:**

1. Take OQ-104(b): add the deterministic Medium replacement roll to Chapter 5's setup YAML and prose after the conformance review, then re-measure Phase 1 outcomes at that frequency.
2. Add a complete, deterministic Chapter 6 starting procedure that the Phase 1 setup invokes.
3. If it is intentionally future Mission-Brief content, remove the claim that it is a Phase 1 Titan and defer the block rather than shipping unreachable rules.

### 4. Major — OQ-103's Abnormal bar can accept a trivial fight and excuses a failed reference build

**Location:** `docs/rules/06-standard-titans.md`, lines 281–286 and 581–604; `docs/rules/OPEN-QUESTIONS.md`, OQ-103, lines 2319–2348; `data/titans/tuning.yaml`, `targets.abnormals`

**Problem:** "Not trivial" requires only more Critical Injuries and deaths than the standard Medium. It places no lower bound on fight length or upper bound on early kills, so a one-card speed bump that injures someone and then dies would pass. The current rider sensitivity already kills it by round 3 in 84.1% of fights, yet passes the rationale because riders take harm. Conversely, the ADR-0014 template reference build has a 30.1% no-kill rate at round 12, over the bar's 20% ceiling, and the draft simply exempts it as a sensitivity. A bar meant to prove that no Chapter 6 fight is trivial or unwinnable cannot discard the reference build that fails it.

**Concrete play scenario:** Four reference PCs bring two mounted Squadmates. The riders hold Attention at Distant while the PCs cut; the Titan is killed by round 3 in 84.1% of fights. A template Squad instead reaches round 12 without a kill 30.1% of the time and suffers 0.613 deaths per fight. The same block is therefore close to a formality for one legal reference arrangement and outside its own winnability limit for another.

**Fix options:**

1. Add a lower duration/early-kill bound and require every ADR-0014 reference build and named sensitivity to meet a stated winnability ceiling.
2. Keep sensitivities untuned, but stop claiming the table proves no fight is trivial or unwinnable and leave OQ-103 open for the Phase 1 simulator.
3. Retune the ladder, Distant entries, or Nape Depth against both rider and template cases, then re-run all listed sensitivities.

### 5. Minor — The rider probe omits the mandatory fall when a mounted soldier becomes Down

**Location:** `tools/probes/chapter-06/fight6.py`, lines 274–282

**Problem:** After a Critical Injury, the model calls `fall()` only when the victim is Down and airborne. Chapter 4 also requires a mounted soldier who becomes Down to dismount and take a low fall after the harm resolves. The simulated rider instead remains mounted, keeps the Abnormal ladder's top rung, and can keep using the horse.

**Concrete play scenario:** A rider fails against Leap, gains a Down Critical Injury, and remains mounted in the probe. In 50,000 rider fights, the committed logic recorded 0.0696 falls per fight; adding the required Down-mounted trigger raised that to 0.1755. Aggregate Critical Injuries and deaths happened to remain within sampling, so this is a model-conformance defect rather than a new balance finding.

**Fix options:**

1. After Critical Injury harm, invoke the Chapter 4 down-mounted dismount and low-fall procedure as well as down-airborne.
2. Centralize both forced-fall triggers in `after_harm`, then regenerate the rider row.

### 6. Minor — The Small Titan's scale cannot put its head at a standing soldier's waist

**Location:** `docs/rules/06-standard-titans.md`, lines 94, 120, and 125; `docs/rules/OPEN-QUESTIONS.md`, OQ-101, line 2270

**Problem:** The block is 3–5 m tall, but the prose says its head is at a standing soldier's middle and uses that claim to fix Bite at the leg. Even the shortest member is substantially taller than a person; its head is not naturally waist-high. Small Titans biting low is plausible when crouching or falling, but the stated anatomy is not.

**Concrete play scenario:** A 3 m Titan stands beside a roughly 1.7 m soldier. Its waist may be near the soldier's head, while its own head is well above them, so the declared reason that its nearest bite is necessarily a leg does not follow.

**Fix options:**

1. Say it crouches, crawls, or drops its head before the leg bite.
2. Use rolled location or torso and re-run the Small death rate.
3. Remove the anatomical justification while keeping the leg location as an overt balance abstraction.

## Independent checks and quoted figures

I ran all Monte Carlo checks from `/private/tmp/wof-ch6-codex-r1`, outside the repository. The stat-block validator returned zero problems for all four Titans; the render check also passed. It found a maximum move-up kill share of 0.50 for every table, at least two legal non-Thrash entries in every Broken state, and In Reach access of 5/6 Small, 5/6 Medium, 4/6 Large, and 5/6 Abnormal.

At 10,000 fights per baseline case, the independent full-fight run produced:

| Titan | Median | Killed by round 3 | No kill by round 12 | Critical Injuries | Deaths | Grabs |
|---|---:|---:|---:|---:|---:|---:|
| Standard Small | 2 | 81.3% | 1.5% | 0.84 | 0.043 | 0.261 |
| Standard Medium | 3 | 62.1% | 4.9% | 0.68 | 0.030 | 0.208 |
| Standard Large | 3 | 61.1% | 13.4% | 1.38 | 0.163 | 0.304 |
| Sprinting Abnormal | 2 | 70.9% | 10.7% | 1.96 | 0.262 | 0.697 |

The template Abnormal reproduced the exception: median round 4, 41.1% killed by round 3, 30.2% still alive after round 12, 3.41 Critical Injuries, and 0.603 deaths per fight. The mounted-rider case reproduced 84.1% by round 3 at 20,000 trials.

At 500,000 independent Nape trials, the standard Medium gave the fight-start Stress 1 Rookie **13.082%** and the Stress 2 Levi-grade soldier **47.415%**, meeting the amended 8–14% and about-50% targets. The Small and Abnormal, both Nape Depth 3, gave **33.311%** and **33.197%** for the Rookie; the Large shares the Medium's Nape Depth and odds.

At 200,000 independent Medium Grab trials, death was **69.907%** after a failed dodge and **73.040%** without a dodge. With one in-reach comrade it was **33.615%** at witness Stress 2/Grief 0 and **44.993%** at Stress 3/Grief 1. These reproduce the amended one-comrade and lone targets. Grab procedure and hand Toughness are shared by all four blocks; Severity changes only the failed-dodge conditioning and did not materially move the committed cells.

I also tested the disputed Break Attention dependency without reviewing OQ-81 itself. With two screening Squadmates, the standard Medium under current escalation was 67.4% killed by round 3, 0.48 Critical Injuries, and 0.664 cards resolved per round. Capping the need at 3 gave 66.5%, 0.48, and 0.660; removing escalation gave 68.8%, 0.42, and 0.600. The Abnormal moved from 75.5%, 1.50, and 1.336 to 77.4%, 1.34, and 1.273 without escalation. No stat block becomes unwinnable, but non-escalation further suppresses harm; OQ-103's weak triviality bar and the untested Phase 1 frequency remain the Chapter 6 content most exposed to that outcome.

The decided Jam policy explicitly Pushes the one dodge toward the first card's Severity, so the Tempo-2 probe follows OQ-96 even though a player may legally skip that card and react later. I therefore raise no Jam finding. The supplied worst legal cells remain below one third; every-card-at-kill rows are correctly reported only as upper bounds.

## Provisional-decision audit

- **OQ-100:** sound. The redundant `marked_grab` and `harm` fields are mechanically checked against `effects`; OQ-105 correctly names the Chapter 3 and Chapter 5 schema/pointer changes.
- **OQ-101:** the strict previous-plus-Broken interpretation is sound, and all tables satisfy its numeric bound, but provisional table choice (a) remains unsound because of finding 2 and the Small scale issue.
- **OQ-102:** unsound as drafted because its canon case imports Female Titan tactics and its declared limb dependencies are incomplete (findings 1 and 2).
- **OQ-103:** unsound as an acceptance bar (finding 4). The values themselves stay inside the allowed Medium ranges and are accurately reported.
- **OQ-104:** unsound for a chapter presented as playable Phase 1 material (finding 3).
- **OQ-105:** its ten deferred earlier-chapter edits are necessary and appear complete. Applying them does not cure OQ-104; selecting a playable Abnormal-entry rule would add the Chapter 5 setup change OQ-104 already names.

No Shifter mechanics other than the OQ-102 behavioral borrowing appear, and no other Phase 2 procedure is required by the standard stat blocks.

## Open finding count

- Critical: 0
- Major: 4
- Minor: 2
