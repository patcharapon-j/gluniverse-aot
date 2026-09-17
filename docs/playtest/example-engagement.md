# Example Play: "The Forest Road"

A worked Titan Engagement from setup to end steps, written as fiction with the table's
mechanics beside it. Every roll, table, and number is the rules as written: Chapter 5 for
the fight, Chapter 3 for harm and mind, Chapter 4 for gear, Chapter 1 for the dice. Rules
callouts are marked **[TABLE]**.

**The Squad** — four Rookies, Funding 3 (ODM Gear 2, Blade Set 1, horse 2, one full canister
at Gas 3 and one spare), Stress 1 each, no Scars, no Grief. Squad Tactics: **Hamstring Line**
and **Hook and Cut**. Playtest configuration: four player characters, no Squadmates.

| | Specialty | Str | Agi | Wits | Per | Ins | Emp | Health | Resolve | Talents |
|---|---|---|---|---|---|---|---|---|---|---|
| **Kass Oltmann** | Slayer | 5 | 3 | 2 | 2 | 3 | 3 | 4 | 3 | Clean Cut 2, Relentless |
| **Til Brandt** | Flier | 3 | 5 | 2 | 3 | 2 | 2 | 4 | 2 | Slip Away 2, Wirework 1 |
| **Nore Vasek** | Hunter | 2 | 3 | 2 | 5 | 3 | 3 | 3 | 3 | Lure 2 |
| **Ilse Gunder** | Tactician | 3 | 3 | 2 | 3 | 5 | 3 | 3 | 4 | Titan Reader 2, Sharp Call |

---

## Setup

The forest swallowed the road an hour out from the waypoint, and with the canopy came the
quiet. No birds. Kass noticed it from the saddle before anyone said it aloud, and by then
Nore had already stopped walking, her head turned, and the thing came through the trees
ninety yards off at a walk, brushing trunks aside with its hip like a man wading through
long grass. Eight metres. Grinning. It had not seen them yet.

> **[TABLE]** The Leg's Waypoint is a forest, so the **Anchor Rating is Wooded** — the
> Waypoint's kind names it, nothing is rolled (`data/expedition/route.yaml`). The GM frames
> the **Focus Titan** as the Standard Medium Titan (framing, decision batch 9, 9-15; what the
> GM names is never rolled). The GM leaves the Background Titans to the setup table: D6 → 3
> → **one Background Titan, clock 6**. Its Size Class rolls Medium. **Retreat clock: 8**, no
> roll.
>
> Setup, in order (`engagement-flow.yaml`): the Focus Titan is labelled **A**; every Body
> Part Intact; no Openings; Regeneration clock empty (3 segments for Medium); the GM rolls the
> hidden **Next Behavior** and sets it face down. Everyone starts **Distant** relative to A —
> Kass stays mounted, the other three on foot, nobody airborne, Nore's and the others' horses
> at Distant.
>
> The Titan evaluates its **Attention Ladder** with no cards dealt. Hooked in? No. In reach?
> No. Flags? None. Nearest? Everyone is at Distant, so all four tie, no lower rung narrows
> them, and the card step is skipped because no cards exist yet. **Nothing holds its
> Attention.** Its first card will decide.
>
> Then the **Fear Rolls**: it is all four soldiers' first Titan Engagement. One snapshot —
> everyone rolls together on D6 + Stress − Resolve, from Stress and Resolve as they stand now.
> - Kass (1−3): D6 4 → **1, Heart in Your Throat** — gain 1 Stress → **Stress 2**.
> - Til (1−2): D6 4 → **3, Clenched Trigger** — next action spent; a Gas Roll at once. Two
>   dice show 1 and 4: one 1, so **Gas 3 → 2**. His round-1 action is gone before the first
>   card is dealt.
> - Nore (1−3): D6 2 → **0 or less, Steeled** — nothing.
> - Ilse (1−4): D6 5 → **0 or less, Steeled** — nothing.
>
> The Squad's two Squad Tactics become unused. Round 1 begins.

---

## Round 1 — the approach

> **[TABLE]** Deal: twenty cards, one to each soldier, and **Tempo 1** for the Medium Titan,
> so it gets one. Ilse 4, Titan A 7, Til 9, Nore 12, Kass 16.
>
> **Wings step:** no Squadmates in the playtest configuration, so nothing to assign.
>
> **Swap step:** Kass and Til both hold Distant, so they are at the same Position and may
> exchange cards. Til's action is spent anyway; Kass wants to be moving before the Titan does.
> They swap — **Kass 9, Til 16**.

Ilse did not move. She put her back against a trunk, let the others go past her, and
watched the thing's shoulders and its hands and the way it put its feet down.

"It's going to grab," she said. "Not swat. Grab. Watch the left hand — it's already
carrying it wrong."

> **[TABLE]** Ilse's card (4). **Move:** none, she stays Distant. **Action: Read** — Instinct
> with no gear, needs 1, and a reader at Distant gains **2 Bonus Dice**. Pool: Instinct 5 +
> Titan Reader 2 + 2 Bonus + 1 Stress Die = 9 base, 1 Stress. She rolls **3 successes**, and
> one Stress Die shows a **1**.
>
> Against a standard Titan the only fact a Read can buy is the **Next Behavior**, because the
> rest — Size Class, Nape Depth, Toughness, the ladder — is already public. One success buys
> it: **Grab** (result 6, kill tier, 9 Attack Dice, needs the holder at In Reach or On Body,
> uses an arm).
>
> **Call It** takes 2 of that Read's successes including the revealing one; **Sharp Call**
> lowers it to 1. So Ilse spends 2 of her 3 in total and Calls the Grab: every target *other
> than her* who dodges the card that resolves it gains **2 Bonus Dice**. Her third success buys
> nothing — there is no second fact to buy. (Call It helps comrades only; the reader gains
> nothing from her own.)
>
> **Stress Response**, because a Stress Die showed 1: D6 + Stress − Resolve = D6 4 + 1 − 4 =
> **1, Scattered Thoughts**, lasting — 1-die penalty on Read, Treat Injury, Field Repair. It
> applies from her *next* roll on, never to the roll that caused it. And she cannot Push this
> roll.

The Titan's head came round, and it was looking at Ilse — the one furthest away, the one
still standing still. Then its weight went wrong and it lashed out at nothing at all, at the
trees, at the air, a huge idiot spasm that took a branch off forty feet from anyone.

> **[TABLE]** Titan A's card (7). Not dead; holds nobody; no decoy. **Evaluate the ladder.**
> All four are candidates. No one is On Body or flagged; no one is In Reach; no flags at all;
> so the highest rung met is **nearest**, and the closest Position anyone holds is Distant —
> all four tie. No lower rung narrows them, and the tie goes to **the lowest card this round**:
> Ilse, on 4. **Ilse holds Attention.**
>
> **Choose the behavior:** the Next Behavior is Grab. It needs the holder at In Reach or On
> Body. Ilse is at **Distant**, so the entry becomes its **fallback: Thrash**. Thrash works at
> any Position, uses no Body Parts, and inflicts nothing lethal: **6 Attack Dice**, effect
> **knock-loose**.
>
> **Roll:** 6 Titan Dice, in the open, successes on 5 or 6 — 6, 5, 4, 3, 2, 1 → **Severity 2**.
> Ilse is the only target. Knock-loose reaches an airborne target, or one at On Body or Blind
> Spot; Ilse is on her feet at Distant, so it cannot touch her whatever happens. She **declines
> to dodge** and keeps her Reaction. The card lands on 2 Net Successes and does exactly
> nothing.
>
> (Had anyone dodged, Ilse's Call It would have given them 2 Bonus Dice — a Call applies even
> when the behavior resolves as its fallback or as Thrash.)
>
> **Next:** a card that whiffed or did nothing has still *resolved a behavior*. Thrash becomes
> the previous behavior, decoys in a row returns to 0, **every flag clears**, the Call ends, and
> the GM rolls a new hidden Next Behavior.

Kass put his heels in and went down the road at a gallop, and the horse carried him inside
the thing's reach before it had finished turning. He came past its right leg and cut, and the
blade went in and skidded off bone.

> **[TABLE]** Kass's card (9). **Move:** Distant → In Reach. At Wooded that step can be made
> on foot, mounted, or by ODM; he makes it **mounted**. **Action: Body Part strike** on the
> left leg — Strength with Gear Dice from the Blade Set, from In Reach or On Body. Pool:
> Strength 5 + Blade Set 1 + 2 Stress Dice. He rolls **1 success**.
>
> Left leg: count 1, Toughness 2 — not enough to move its state. The strike had at least 1
> success, so it sets the **just-hurt flag** on Kass.

Nore ran in on foot and did the loudest, stupidest thing she knew how to do: stood under its
hip and screamed at it, waving both arms. It did not so much as glance at her. Its eyes were
on the one who had cut it.

> **[TABLE]** Nore's card (12). **Move:** Distant → In Reach, on foot. **Action: Draw
> Attention** — unrolled, needs a Position other than Distant, sets the **loudest flag**.
>
> Worth noticing at the table: loudest is the ladder's *fourth* rung and **just-hurt** is its
> third. Noise does not beat hurting it. Nore's flag will matter only if Kass's is gone.

Til got to the trees, put two hooks in, and swung himself in under the canopy until he was
level with its waist, and then stopped, because his hands would not do anything else. The
gas had gone out of him in one useless roar when the thing first came through the trees.

> **[TABLE]** Til's card (16). His **action is spent** by the Clenched Trigger. **Move:**
> Distant → In Reach as an **ODM move** (Wooded allows ODM on that step). He is now
> **airborne**, and that is **ODM use**.
>
> **End steps**, in order:
> 1. **Gas Rolls** for everyone who used ODM Gear. Til alone: two dice, 3 and 1 → one 1 →
>    **Gas 2 → 1**. (Kass's strike took its dice from the Blade Set, so it is not ODM use and
>    costs no gas. A mounted move costs none either.)
> 2. **Regeneration:** A's clock 1/3.
> 3. **Background Titan clock** 1/6. **Retreat clock** 1/8.
> 4. Unspent moves and actions are lost.

---

## Round 2 — the hand

> **[TABLE]** Deal: Kass 5, Titan A 11, Ilse 13, Nore 14, Til 18. No swaps — nobody wants one.

"Leg," said Kass. "Same leg. Nore, with me."

She put her shoulder under his cut and held the ankle steady with her whole weight while he
swung again, and the second cut went where the first had opened it.

> **[TABLE]** Kass's card (5). **Action: Body Part strike**, left leg again, and his player
> declares **Hamstring Line** — the condition is a leg strike Helped by at least one comrade,
> declared after Help and before the roll. Nore has an unspent action and is at the same
> Position, so she **Helps**, spending her action for **+1 Bonus Die**.
>
> Pool: Strength 5 + 1 Bonus + Blade Set 1 + 2 Stress. He rolls **1 success** — and Hamstring
> Line gives a strike with at least 1 success **1 more**. Two successes, taken one at a time:
> the first takes the count to 2, which reaches Toughness 2, so the **left leg moves Intact →
> Wounded** and the count returns to 0; the second puts the count back to 1. Just-hurt flag
> set again. Hamstring Line is now **used for this Titan Engagement**.

Its hand came down the way a man picks up a dropped glove.

> **[TABLE]** Titan A's card (11). **Ladder:** nobody is On Body or flagged as hooked; **in
> reach** is met by Kass, Nore, and Til, who tie there; **just-hurt** narrows it to **Kass
> alone.** Kass holds Attention.
>
> **Choose:** the hidden Next Behavior is **Grab** (rolled fresh after round 1's Thrash; nobody
> Read it this round, so the table does not know). Kass is at In Reach ✓. Both arms unbroken ✓.
>
> **Roll:** 9 Titan Dice → 6, 6, 5, 5, 4, 3, 3, 2, 1 → **Severity 4**.
>
> Kass **dodges**: Agility with ODM Gear — Agility 3 + ODM Gear 2 + 2 Stress. No Call It on
> this behavior. He rolls **1 success**. **3 Net Successes: the Grab lands.**
>
> The Grab's steps, none of which read the Net Successes — **the Grab takes no rider**:
> 1. **Hold.** The first unbroken arm in the stat block, the **left arm**, closes on him. While
>    it holds him its Toughness is 1 and its count 0, and its state does not change.
> 2. **Crush.** A torso Critical Injury, Injury Type Crush, that **cannot be lethal**. 2D6 → 8
>    → the torso **8–9** row: **Crushed Ribs**, not Down, 2-die penalty on Nape strike, Body
>    Part strike, and Break Free, 14 healing days. It crosses off a Health box: Kass's current
>    Health **4 → 3**.
> 3. **Attention.** Kass holds it.
> 4. **Witnesses.** Nore, Ilse, and Til each make the `comrade-grabbed` Fear Roll, one
>    snapshot, together:
>    - Nore (Stress 1 − Resolve 3): D6 6 → **4, Retching** — next action spent; gain 1 Stress →
>      **Stress 2**.
>    - Ilse (1 − 4): D6 6 → **3, Clenched Trigger** — next action spent; a Gas Roll at once, two
>      dice, 4 and 6, no 1s → **Gas 3 holds**.
>    - Til (1 − 2): D6 3 → **2, Cold Sweat** — gain 1 Stress → **Stress 2**; 1-die penalty on
>      his next roll.
>
> **The countdown.** It counts Kass's own turns from here. His dodge spent his *next* turn —
> round 3's — because his round-2 turn was already wholly spent when the card came up. The
> refund rule fires: that later turn is **unspent again**, and the **first counted turn counts
> as spent instead**. So round 3's turn is his first counted turn, its action spent by the Grab
> itself. At the end of it, if he is still held, he is **lifted**. At the end of the second —
> round 4 — the Titan **devours him**.
>
> Kass cannot dodge, Help, Cover, or be Helped while Grabbed. His move changes nothing. His
> only action is Break Free — and the Grab has already spent it.

Ilse was bent over with her hands on her knees, and Nore was retching into the leaf litter,
and neither of them could do a thing. Til came off the tree at the hand and cut across the
back of its wrist and took nothing but a sheet of steam in the face.

> **[TABLE]** Ilse's card (13): action spent by the Clenched Trigger. **Move** only — Distant →
> In Reach, on foot. Nore's card (14): action spent by Retching; she is already In Reach.
>
> Til's card (18). **Action: strike the holding arm** — anyone not Grabbed may, and *before the
> lift* it can be made from In Reach, On Body, or Blind Spot, with no penalty. It is a Body Part
> strike, and from In Reach it needs no working ODM Gear. Pool: Strength 3, **less 1 base die
> for Cold Sweat**, + Blade Set 1 + 2 Stress. He rolls **0 successes** — no tally, and no
> just-hurt flag.
>
> **End steps.** Gas Rolls: Kass's dodge took its Gear Dice from ODM Gear, so that is ODM use —
> two dice, 2 and 5, no 1s, **Gas 3 holds**. Til made no ODM move and struck with a Blade Set:
> no roll. Regeneration **2/3**. Background **2/6**. Retreat **2/8**.

---

## Round 3 — the lift, and the hand opened

> **[TABLE]** Deal: Til 2, Nore 6, Kass 8, Titan A 12, Ilse 16.

Til cut again in the same place and opened it to the tendon. Nore climbed the leg with her
bare hands because there was nothing else to climb and put her blade in behind the thumb.
Kass, eight metres up in a fist, could not reach his own harness release.

> **[TABLE]** Til (2): strike the holding arm — Strength 3 + Blade Set 1 + 2 Stress, the Cold
> Sweat penalty spent on last round's roll. **1 success.** Running tally toward freeing Kass:
> **1 of the 2** the escape table needs while the arm is Intact.
>
> Nore (6): **move** In Reach, no change. **Action:** strike the holding arm — Strength 2 +
> Blade Set 1 + 2 Stress. **0 successes.** Still 1 of 2.
>
> Kass (8): **first counted turn.** His move changes nothing; his action is spent by the Grab.
> The turn ends. **He is lifted.** Nothing is harmed by the lift, but from now on Break Free
> takes a **2-die penalty**, and a strike on the arm can be made only from **On Body or Blind
> Spot**.

The Titan did nothing at all. It stood with its fist closed and its head tilted, and for a
long moment it was not a monster, only an animal holding something it had not decided about.

> **[TABLE]** Titan A's card (12). **It holds a living Grabbed soldier**, so the card **resolves
> nothing**: the ladder is not evaluated, the Next Behavior is kept, and the flags stay. That is
> all the danger it poses for these turns — the countdown is the clock.

Ilse put two hooks in its shoulder, went up the outside of the arm in one pass, braced her
boots on the elbow, and cut down into the joint of the thumb with her whole bodyweight behind
it. The hand came open like a gate.

> **[TABLE]** Ilse (16). **Move:** In Reach → On Body. That step is **ODM only** at every
> Anchor Rating — no roll, but it needs ODM Gear that counts as had, and it makes her airborne
> and counts as ODM use. ✓ (Gas 3.)
>
> **Action:** strike the holding arm from **On Body**, which the narrowed reach allows. A Body
> Part strike from On Body needs working ODM Gear ✓. Pool: Strength 3 + Blade Set 1 + 1 Stress.
> **1 success** → the tally reaches **2 of 2**. **Kass is freed.**
>
> **Release, after the lift:** he **falls from On Body's height** and lands In Reach. Band: On
> Body is **high**; the reference Titan is Medium, not Large, and the rating is Wooded, not
> Giant Forest, so **no raise**. D6 4 + 2 = 6 → *hard landing*, **2 damage**. Kass's current
> Health **3 → 1**. The arm's Toughness returns to normal at count 0, and the Titan's Attention
> is **held by nothing** until its next card.
>
> **End steps.** Gas Rolls: Ilse used ODM Gear — two dice, 1 and 3 → **Gas 3 → 2**. Regeneration
> **3/3 — it fills:**
> 1. Every Opening erased (there are none).
> 2. Every Body Part's count to 0.
> 3. The most damaged Body Part moves one state toward Intact: the **left leg, Wounded →
>    Intact.** Two rounds of Kass's and Nore's work, gone.
> 4. A Body Part moved, so **every soldier at On Body is scalded**. Ilse takes steam: damage,
>    Injury Type Burn. Her current Health **3 → 2**.
> 5. The clock empties.
>
> Background **3/6**. Retreat **3/8**.

---

## Round 4 — the flare

> **[TABLE]** Deal: Kass 3, Til 7, Ilse 10, Titan A 15, Nore 19.

Kass lay in the leaves with one arm working and fired the flare straight up into the
canopy, and the whole forest went red. The Titan's head snapped round to follow it, and Kass
was already shouting Til's name.

> **[TABLE]** Kass (3). Attention is held by nothing, so he needs **2** — the need drops to 1
> only for the soldier who holds it. Decoys in a row: 0. **Break Attention** is Perception with
> Gear Dice from ODM Gear: Perception 2 + ODM Gear 2 + 2 Stress. The flare needs a flare in
> Squad Supply and the Titan's eyes not Broken ✓, and is spent when declared. He rolls **4
> successes** — 2 beyond the need, so **2 Openings, created by Kass**.
>
> The decoy holds Attention for as many of the Titan's next cards as its **Tempo**: 1. Decoys
> in a row rises to 1. The flare also **fills 1 segment of every Background Titan's clock** —
> a flare is seen across the field. Background **4/6**.
>
> **Hook and Cut**, declared now: a Break Attention has just succeeded, and a comrade at Blind
> Spot with an unspent action can make a Nape strike. Til is at In Reach, not Blind Spot — **the
> tactic cannot be used.** It stays unspent, and the Squad has lost the tempo.

Til swore, went up and over the shoulder in two passes, and put his blades into the back of
its neck as hard as a man his size could. It was not hard enough. The flesh closed on the
steel and he tore free with the cut half-made.

> **[TABLE]** Til (7). **Move:** In Reach → Blind Spot, an **ODM move** with **no roll** at
> Wooded. (At Sparse that step would have needed a **Fly roll**, needing 1, and a failure would
> have left him at On Body.) He is airborne; ODM use.
>
> **Action: Nape strike** — Strength with Blade Set Gear Dice, needing Blind Spot, not holding
> Attention ✓ (a decoy holds it), working ODM Gear ✓ (Gas 1). **Nape Depth 4.** Bonus Dice: he
> may spend Openings, but **Kass's 2 are the only ones on the Titan and a soldier can never
> spend an Opening they created** — these are Kass's, so Til **can** spend them. +2.
>
> Pool: Strength 3 + 2 Openings + Blade Set 1 + 2 Stress = 5 base, 1 gear, 2 stress. He rolls
> **3 successes — short of 4.** A strike that falls short turns each success into an Opening:
> **3 Openings, created by Til.** He has no Relentless, so no fourth. Every Nape strike, whatever
> its result, sets the **hooked-by-strike flag** on him.

> **[TABLE]** Ilse (10): she stays at **On Body**, moving nothing, and keeps her action unspent
> for a Help next round. Holding a Position without moving is **not ODM use**, even while
> airborne, so it costs her no gas.
>
> Titan A (15): **a decoy holds its Attention**, so the card resolves nothing, the hold drops to
> 0 cards left and **ends**, the Next Behavior counts as spent and a new one is rolled, and **the
> ladder is evaluated** — but **the flags stay**, because this card resolved no behavior.
>
> Ladder: rung 1, **hooked into its body**, is met by **two** candidates — Til, who holds the
> hooked-by-strike flag, and **Ilse, who is at On Body**. They tie, and the tie-break inside
> that rung decides it: when anyone tied there holds the hooked-by-strike flag, **only they stay
> tied**. A Nape striker who fell short draws the Titan before a soldier who is merely On Body.
> **Til holds Attention**, and the card does nothing else.
>
> Nore (19): moves to In Reach, holds her action.
>
> **End steps.** Gas Rolls: Kass (Break Attention with ODM Gear) two dice → no 1s, Gas 3 holds.
> Til (ODM move) two dice, 1 and 1 → **two 1s → Gas 1 → 0.** **Til has run dry.** His ODM Gear
> counts as not had: no Gear Dice, no ODM move, and **no Nape strike from Blind Spot**. He is a
> passenger. He has one spare canister. **Ilse rolls no gas at all** — she only hung there.
> Regeneration **1/3**. Background **5/6**. Retreat **4/8**.

---

## Round 5 — the cut

> **[TABLE]** Deal: Titan A 1, Ilse 4, Nore 6, Kass 11, Til 14.

It went for him first, and it went for him hard, because he was the one with a blade in its
neck. It hunched its shoulders and rolled them, once, the way a horse rolls off a fly, and
Til came off it from eight metres with nothing in his canister to stop the drop.

> **[TABLE]** Titan A (1). **Ladder:** the flags still stand, because no card has resolved a
> behavior since Til's strike set his. Rung 1 again ties Til, flagged, with Ilse at On Body, and
> the flag again wins the tie. **Til holds Attention.**
>
> **Choose:** the new Next Behavior is **Shake Off** (result 4, control tier, needs the holder at
> On Body or Blind Spot, uses no Body Parts, **6 Attack Dice**, effect **knock-loose**). Til is at
> Blind Spot ✓.
>
> **Roll:** 6 Titan Dice → 6, 5, 4, 3, 2, 2 → **Severity 2.** Til dodges: Agility 5 + Slip Away 2
> + **no Gear Dice, because his ODM Gear counts as not had** + 2 Stress. He rolls **1 success** →
> **1 Net Success. It lands.**
>
> **knock-loose:** an airborne target falls. Band: Blind Spot is **high**, no raise. D6 3 + 2 = 5
> → *hard landing*, **2 damage.** Til's current Health **4 → 2.** He lands **In Reach**. He is no
> longer airborne.
>
> **Next:** the behavior resolved, so Shake Off becomes the previous behavior, **every flag
> clears**, decoys in a row returns to 0, and a new Next Behavior is rolled.

Kass got up out of the leaves with one good arm and three ribs gone and walked in under its
hand while it was still busy shaking a man off its neck. Ilse came down the shoulder beside
him and put her hands on the haft with his. Five metres of steel went into the Nape and did
not stop.

> **[TABLE]** Kass (11). **Move:** In Reach → Blind Spot, an **ODM move**, no roll at Wooded;
> Gas 3 ✓. **Action: Nape strike.** He is at Blind Spot ✓, and he does **not** hold Attention — **Til
> still does**, because the ladder was evaluated at the Titan's card and Attention changes only
> at the listed moments, not because flags cleared ✓ — and his ODM Gear is working ✓.
>
> **Bonus Dice:** Til's **3 Openings** are on the Titan and Kass may spend them, because he did
> not create them. **Ilse Helps** — unspent action, and On Body is one Position step from Blind
> Spot ✓ — for 1 more. That is 4, **exactly the Bonus Dice cap.**
>
> **Penalties:** Crushed Ribs, from the Grab's crush, is a **2-die penalty on Nape strike**.
>
> Pool: Strength 5 + Clean Cut 2 + 4 Bonus − 2 penalty = **9 base**, + Blade Set 1, + 2 Stress.
> Needs **4**. He rolls **4 successes.**
>
> **Nape Depth reached. The Titan dies.**
>
> **At once:** every soldier holding a Position gains **1 Stress relief** for the Nape kill —
> Kass to 1, Til to 1, Nore to 1, Ilse to 0. Every Opening is erased. **Steam** at the kill
> scalds everyone at On Body: **Ilse** takes damage, Injury Type Burn — current Health **2 → 1**.
> The body falls and stays on the field as a **corpse**, and each soldier's last Position becomes
> their Position relative to it, except that On Body and Blind Spot read In Reach.
>
> **The ending tests:** no Focus Titan is alive, and **no soldier is Pinned** — nobody was under
> the body when it came down. **It ends at once, mid-round.** The Background Titan, clock 5/6,
> never enters. The retreat clock, 4/8, never fills.
>
> (Had anyone been Pinned, the rounds would have **run on**: the clocks keep filling, the
> Background Titan can still enter, corpse heat crosses off a Health box at the start of each
> Pinned soldier's turn, and the Squad must **Heave** the corpse — Strength, to a heave count of
> 3 for a Medium Titan — before this test can end it.)

---

## The end steps

The steam went up through the canopy for a long time, and the four of them sat in it
because none of them could stand.

> **[TABLE]** The round is cut short, so **that round's Gas Rolls are made at once** before
> Chapter 3's steps: Kass made an ODM move → two dice, no 1s. Then the end steps of Chapter 3,
> section 3.16, in order:
> 1. Turns spent in advance that never came up are cancelled; every ban on Reactions ends; no
>    Fear Roll result is pending.
> 2. **End-of-Engagement Stress relief, 1** to every soldier who held a Position at any point —
>    it **stacks with the Nape kill's**. Kass 0, Til 0, Nore 0, Ilse 0. Every one of them walks
>    out at Stress 0.
> 3. **Ilse's Scattered Thoughts ends** — every lasting Stress Response gained in the fight does.
> 4. No `turn` limits are running.
> 5. **Aftermath rolls:** nobody holds an untreated lethal `engagement` Critical Injury. Kass's
>    Crushed Ribs is not lethal; the two burns and the fall damage are damage, not lethal
>    injuries.
> 6. No lethal `engagement` limits run out. No Death Rolls.
> 7. **A care window:** Ilse treats Kass's Crushed Ribs — Wits with a medical kit she does not
>    have, so on Wits alone — and a success gives back the Health box it crossed off.
> 8. **Grief:** nobody died. None.
> 9. No fifth Scars, no Retirements, no promotions, no left items to share out. Chapter 4 then
>    clears every Position record.
>
> **What the fight cost:** one Grab survived by two comrades' strikes on one hand across two
> rounds; one Critical Injury; four Health boxes to falls and steam; two flares' worth of
> attention — one spent, one never needed; one canister run dry; one Regeneration fill that
> undid two rounds of leg work; both Squad Tactics gone, one of them wasted; and a Medium Titan
> dead in five rounds, which is two slower than the median.

