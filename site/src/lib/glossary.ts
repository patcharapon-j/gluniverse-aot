/**
 * Player-facing glossary. Definitions are written for the table from the
 * project glossary's meanings; they are short enough for a pop-up.
 */
/** The Player's Guide chapter that carries a term's rule, by its page id. */
export type ChapterId =
  | 'rules-of-play'
  | 'making-your-soldier'
  | 'wounds-and-fear'
  | 'gear-and-odm'
  | 'fighting-titans'
  | 'expeditions-and-downtime'
  | 'skirmishes';

export interface GlossaryEntry {
  term: string;
  slug: string;
  definition: string;
  aliases: string[];
  /** The chapter the entry links to, and the one the glossary filters it under. */
  chapter: ChapterId;
}

const RAW: { term: string; chapter: ChapterId; definition: string; aliases?: string[] }[] = [
  { term: 'Action Catalog', chapter: 'making-your-soldier', definition: 'The full list of named actions, Reactions, and rolls a soldier can make. Each entry names its attribute and the gear that can add Gear Dice.' },
  { term: 'Anchor Rating', chapter: 'fighting-titans', definition: 'How well a battlefield holds ODM Gear anchors, from Open to Giant Forest. It sets which Position changes ODM Gear allows, how many Anchors the field holds, and the Terrain Trait in play.' },
  { term: 'Cadet', chapter: 'making-your-soldier', aliases: ['Cadets'], definition: 'A member of the Training Corps who has not yet graduated.' },
  { term: 'Down', chapter: 'wounds-and-fear', definition: 'The state of a soldier at 0 Health, or holding an untreated Critical Injury that says so. A Down soldier can do little more than crawl, and cannot Push, Help, Cover, or make a Reaction.' },
  { term: 'Downtime', chapter: 'expeditions-and-downtime', definition: 'The time the Squad spends inside the Walls between Expeditions.' },
  { term: 'Downtime Action', chapter: 'expeditions-and-downtime', aliases: ['Downtime Actions'], definition: 'One of the things a player character does during Downtime, such as Recover or Visit Haven.' },
  { term: 'Fear Roll', chapter: 'wounds-and-fear', aliases: ['Fear Rolls'], definition: 'A roll forced by a horrifying event, such as a comrade Grabbed by a Titan. The dice never cause one.' },
  { term: 'Foe', chapter: 'skirmishes', aliases: ['Foes'], definition: 'A person, or a band of people, the Squad fights in a Skirmish.' },
  { term: 'Grabbed', chapter: 'fighting-titans', definition: "Gripped in a Titan's hand. You cannot Help, Cover, or make a Reaction, and the Titan devours you unless you get free in time." },
  { term: 'Graduation Exam', chapter: 'making-your-soldier', definition: "The optional played prologue of three Stages, each rolling one Trial and the condition it is run under, that helps decide each Cadet's Class Rank." },
  { term: 'Frenzy', chapter: 'fighting-titans', definition: 'How worked up a Focus Titan is. It starts a fight at 0, gains 1 at the end of every even-numbered round to a cap of 3, and is added to its behavior roll — so the longer the fight runs, the further down its table it rolls.' },
  { term: 'Grief', chapter: 'wounds-and-fear', definition: 'The weight a soldier carries after a comrade dies. Each point lowers Resolve by 1 until it is dealt with during Downtime.' },
  { term: 'Haven', chapter: 'making-your-soldier', definition: 'What a soldier has to return to. During Downtime it lets them lower Stress and Grief.' },
  { term: 'Jam', chapter: 'gear-and-odm', aliases: ['Jams', 'Jammed'], definition: 'ODM Gear worn down to 0. It stops working and drops an airborne soldier.' },
  { term: 'Net Successes', chapter: 'rules-of-play', definition: "An attack's successes left after a Reaction cancels them one for one. The attack lands on 1 or more." },
  { term: 'Overloaded', chapter: 'gear-and-odm', definition: 'Carrying more than Strength + 4 items. Every ODM move then spends your action as well.' },
  { term: 'Position', chapter: 'fighting-titans', aliases: ['Positions'], definition: 'Where a soldier is relative to a Focus Titan: Distant, In Reach, On Body, or Blind Spot. An action never changes one. Only your own move does, and the few rules that say so.' },
  { term: 'On Body', chapter: 'fighting-titans', definition: 'Hooked into a Titan or standing on it, anywhere but the Nape. You are on the Titan, and you travel with it.' },
  { term: 'Blind Spot', chapter: 'fighting-titans', definition: 'Out of a Titan’s sight with its Nape within reach, anchored to terrain behind it: a tree, a roof, a beam. You are not on the Titan. It is the only Position a Nape strike is made from, and ground with nothing to anchor to has none at all.' },
  { term: 'Rally', chapter: 'wounds-and-fear', definition: "The Empathy roll that clears one of a comrade's lasting Stress Responses or pending Fear results for each success. It never lowers their Stress." },
  { term: 'Reaction', chapter: 'rules-of-play', aliases: ['Reactions'], definition: 'A dodge or block you make when a Titan or a Foe acts against you, outside your own turn. Each success cancels one of the attack\'s, and it spends a whole turn.' },
  { term: 'Resolve', chapter: 'wounds-and-fear', definition: "A soldier's steadiness: half of Instinct plus Empathy, rounded up, plus 1 per Scar and minus 1 per point of Grief. It counts against Stress Response and Fear Roll results." },
  { term: 'Scar', chapter: 'wounds-and-fear', aliases: ['Scars'], definition: 'A lasting, named trauma that changes how you play. Each one raises your minimum Stress and your Resolve by 1.' },
  { term: 'Severity', chapter: 'rules-of-play', definition: 'The successes an attack roll scored, announced to every target. A Reaction must cancel all of them to avoid the attack.' },
  { term: 'Skirmish', chapter: 'skirmishes', aliases: ['Skirmishes'], definition: 'A scene in which soldiers fight people rather than Titans.' },
  { term: 'Squad', chapter: 'making-your-soldier', definition: 'The Survey Corps unit made up of the player characters and their Squadmates.' },
  { term: 'Squadmate', chapter: 'making-your-soldier', aliases: ['Squadmates'], definition: 'A named soldier any player can direct. Squadmates ride with the Squad, can be targeted like anyone else, and never Push or Cover.' },
  { term: 'Titan Engagement', chapter: 'fighting-titans', aliases: ['Titan Engagements'], definition: 'A scene in which the Squad confronts one or more Titans. It runs in rounds.' },
  { term: 'Wing', chapter: 'making-your-soldier', aliases: ['Wings'], definition: "A Squadmate's attachment to one player character during a Titan Engagement. The Squadmate acts right after that character." },
  { term: 'Abnormal', chapter: 'fighting-titans', definition: 'A Titan that breaks the usual pattern. It acts from its own Behavior Table, and some of its numbers stay unknown until your squad makes a Read.' },
  { term: 'Attack Dice', chapter: 'fighting-titans', definition: "The Titan Dice a behavior rolls when it comes for a soldier: 3, 6, 9, or 12, set by the behavior and the Titan's size." },
  { term: 'Base dice', chapter: 'rules-of-play', aliases: ['base die'], definition: 'The dice from your attribute, your Talent, and any Bonus Dice. Each 6 is a success.' },
  { term: 'Behavior Table', chapter: 'fighting-titans', definition: 'The d6 table a Titan acts from. Titans take no ordinary turns: the GM rolls, and the Titan does what the table says.' },
  { term: 'Body Part', chapter: 'fighting-titans', aliases: ['Body Parts'], definition: "A Titan's eyes, arms, and legs. Cut one enough and it breaks, which can blind the Titan or bring it down." },
  { term: 'Bonus Dice', chapter: 'rules-of-play', definition: 'Extra base dice from Help, Openings, and the other things a rule names. A roll takes at most 4.' },
  { term: 'Cover', chapter: 'rules-of-play', aliases: ['Covering', 'Covers'], definition: "Taking the Stress of a comrade's Push yourself, so they add no new Stress Die." },
  { term: 'Critical Injury', chapter: 'wounds-and-fear', aliases: ['Critical Injuries'], definition: 'A lasting wound with a location and a type. Titan attacks inflict them directly, and some can kill.' },
  { term: 'Death Roll', chapter: 'wounds-and-fear', definition: 'The Strength roll you make when a lethal Critical Injury runs out of time. It can never be Pushed.' },
  { term: 'Expedition', chapter: 'expeditions-and-downtime', aliases: ['Expeditions'], definition: 'A Survey Corps operation beyond the Walls, ridden one Leg at a time.' },
  { term: 'Gas Roll', chapter: 'gear-and-odm', definition: 'Two dice rolled each round you use ODM Gear, or three after a Pushed roll made with it. Each 1 costs you gas.' },
  { term: 'Gear Dice', chapter: 'gear-and-odm', aliases: ['Gear Die'], definition: 'Dice from your equipment. A Push never rolls them again, and a 1 on a Pushed roll wears that gear down.' },
  { term: 'Help', chapter: 'rules-of-play', definition: "Adding 1 die to a comrade's roll. Up to three soldiers can Help." },
  { term: 'Nape', chapter: 'fighting-titans', definition: "The back of a Titan's neck, and the only place a cut can kill it." },
  { term: 'Nape Depth', chapter: 'fighting-titans', definition: 'The successes a single Nape strike needs to kill a Titan. A strike that falls short leaves Openings.' },
  { term: 'ODM Gear', chapter: 'gear-and-odm', definition: "The gas-powered grappling harness that carries you between anchor points and up to a Titan's Nape." },
  { term: 'Opening', chapter: 'fighting-titans', aliases: ['Openings'], definition: 'A chance your strike made for a comrade. Another soldier can spend it as a Bonus Die on a Nape strike before the Titan regenerates.' },
  { term: 'Push', chapter: 'rules-of-play', aliases: ['Pushing', 'Pushed'], definition: 'Rolling again for more successes at the cost of 1 Stress. Base dice and Stress Dice not showing a 6 are rolled again. Gear Dice stay.' },
  { term: 'Read', chapter: 'fighting-titans', definition: 'Watching a Titan closely to learn something about it, such as what it will do next, for the whole squad.' },
  { term: 'Regeneration', chapter: 'fighting-titans', definition: "A Titan's healing clock. When it fills, its worst wound closes by one step and every Opening on it is lost." },
  { term: 'Size Class', chapter: 'fighting-titans', definition: "A Titan's height: Small, 3 to 5 m; Medium, 6 to 10 m; or Large, 11 to 15 m." },
  { term: 'Specialty', chapter: 'making-your-soldier', aliases: ['Specialties'], definition: "Your soldier's training, chosen at Graduation. It grants bonuses but never forbids you anything." },
  { term: 'Stress', chapter: 'rules-of-play', definition: 'Mounting fear and adrenaline. It makes you more capable and more likely to break.' },
  { term: 'Stress Dice', chapter: 'rules-of-play', aliases: ['Stress Die'], definition: 'One die for each point of Stress you carry, added to your rolls. They succeed on a 6, and a 1 sets off a Stress Response.' },
  { term: 'Stress Response', chapter: 'wounds-and-fear', definition: 'What happens when fear takes hold. A Stress Die showing a 1 sets it off, and you resolve it on the Stress Response table.' },
  { term: 'Talent', chapter: 'making-your-soldier', aliases: ['Talents'], definition: 'A narrow, practiced ability that adds dice to, or changes a rule for, the actions it names.' },
  { term: 'Tempo', chapter: 'fighting-titans', definition: 'How many times a Titan acts each round.' },
  { term: 'Titan', chapter: 'fighting-titans', aliases: ['Titans'], definition: 'A mindless, human-shaped creature that regenerates its wounds and dies only when its Nape is cut deep enough.' },
  { term: 'Titan Dice', chapter: 'fighting-titans', aliases: ['Titan Attack Dice', 'Titan Attack Die'], definition: 'The dice a Titan attacks with, rolled in the open. They succeed on a 5 or 6 and are never Pushed.' },
  { term: 'Toughness', chapter: 'fighting-titans', definition: 'The successes needed, across strikes, to damage a Body Part one step toward broken.' },
  { term: 'Blade Set', chapter: 'gear-and-odm', aliases: ['Blade Sets'], definition: 'The paired cutting edges fitted to ODM Gear handles: the unit in which they are carried, counted, and lost.' },
  { term: 'Call It', chapter: 'fighting-titans', definition: "Spending 2 of a Read's successes, one of them the success that revealed the Next Behavior, so every other soldier that behavior targets gains Bonus Dice on a dodge against it." },
  { term: 'Campaign Year', chapter: 'making-your-soldier', definition: 'The year the campaign has reached, from 845 to 850, recorded before the first Lifepath. Origin conditions are tested against it.' },
  { term: 'Canon Tie', chapter: 'making-your-soldier', aliases: ['Canon Ties'], definition: 'An optional personal link to one canon character, drawn from an Origin row. It has no effect on play.' },
  { term: 'Class Rank', chapter: 'making-your-soldier', definition: "A graduate's final standing in their class, set by Merit, or none for a built or promoted soldier. The Top 10 are offered a place in the Military Police." },
  { term: 'Drive', chapter: 'making-your-soldier', aliases: ['Drives'], definition: 'What keeps a soldier fighting, written as a "When I ..." trigger. While the trigger is met, it shrugs off one Fear Roll result per session.' },
  { term: 'Free Build', chapter: 'making-your-soldier', definition: 'Making a soldier by placing one of two 18-point sets of ratings, 4, 3, 3, 3, 3, 2 or 4, 4, 3, 3, 2, 2, with a 4 on the key attribute, then choosing an Origin, a Drive, and Talents. Only when the campaign allows it.' },
  { term: 'Health', chapter: 'wounds-and-fear', definition: '2 plus half of Strength plus Agility, rounded up, kept as a row of boxes: 4 to 6 for most soldiers, 8 at the very top. Untreated Critical Injuries cross off boxes, damage marks the boxes left, and at 0 you are Down.' },
  { term: 'Leg', chapter: 'expeditions-and-downtime', aliases: ['Legs'], definition: 'One stretch of an Expedition between two Waypoints. The Squad always arrives, but a failed Leg makes the arrival costly.' },
  { term: 'Lifepath', chapter: 'making-your-soldier', definition: 'The rolled way to make a soldier: an Origin, a reason for enlisting, three Training Years, and Graduation. The only way to a key attribute of 5 or 6 or a Top 10 Class Rank.' },
  { term: 'Merit', chapter: 'making-your-soldier', definition: 'What a Cadet earns across the Training Years. The total decides Class Rank. A built or promoted soldier records none.' },
  { term: 'Night Camp', chapter: 'expeditions-and-downtime', aliases: ['Night Camps'], definition: "The stop after a day's Legs, where the camp roll is made, the Night table is read, and a day passes." },
  { term: 'Origin', chapter: 'making-your-soldier', aliases: ['Origins'], definition: 'Where a Cadet was born and raised, and the first step of the Lifepath.' },
  { term: 'Retirement', chapter: 'wounds-and-fear', aliases: ['retires', 'retire'], definition: 'A soldier leaving play at five Scars, or by choice after losing both arms or both legs, to become an instructor or a Squad contact.' },
  { term: 'Squad Pool', chapter: 'making-your-soldier', definition: 'The Squadmates currently serving in the Squad.' },
  { term: 'Standard Issue', chapter: 'gear-and-odm', definition: "The gear every soldier receives on joining the Squad and whenever a rule issues it: ODM Gear, gas canisters, Blade Sets, a horse, and a Medic's medical kit or an Engineer's tool kit." },
  { term: 'Template Build', chapter: 'making-your-soldier', definition: "Making a soldier from a Specialty's Squadmate template ratings, then choosing an Origin, a Drive, and Talents. Only when the campaign allows it." },
  { term: 'Training Year', chapter: 'making-your-soldier', aliases: ['Training Years'], definition: 'One of the three Lifepath steps spent in the Training Corps, each with an event and a performance roll.' },
  { term: 'Trial', chapter: 'making-your-soldier', aliases: ['Trials'], definition: "One test of the Graduation Exam, rolled from the six its Stage lists on the tens die of that Stage's D66." },
  { term: 'Waypoint', chapter: 'expeditions-and-downtime', aliases: ['Waypoints'], definition: 'A named stopping point on an Expedition route, such as a forest, an abandoned town, or a supply depot.' },
  {
    term: 'Called roll', chapter: 'rules-of-play',
    aliases: ['called rolls'],
    definition:
      'A roll the GM calls for an act no rule covers, when the outcome is in doubt and failure would cost something. The GM names its entry, its Circumstances, and its stakes before the pool is built, and the result stands.',
  },
  {
    term: 'Circumstances', chapter: 'rules-of-play',
    definition:
      'The one step of a seven-step ladder, from Effortless to Desperate, that the GM names for the situation a roll is made in. A plus step adds Bonus Dice, a minus step is a penalty, and it changes dice, never what the roll needs.',
  },
  {
    term: 'Improvised act', chapter: 'rules-of-play',
    aliases: ['improvised acts'],
    definition:
      "An act in a fight that is not a Catalog entry taken as written. The GM names one entry as its model, and the act does only what that entry does, at that entry's size.",
  },
  {
    term: 'Passive roll', chapter: 'rules-of-play',
    aliases: ['passive rolls'],
    definition:
      'A Spot or Size Up the GM makes for you out of sight, against something you do not know is there. It has no stakes, cannot be Helped or Pushed, and you learn its result only through what you notice.',
  },
  {
    term: 'Ruling', chapter: 'rules-of-play',
    definition:
      'A call the GM makes where the rules are silent: whether to roll, what the roll uses, its Circumstances, and its stakes. A ruling comes before the dice and never changes a die, a table result, a card, or what a roll needs.',
  },
  {
    term: 'Stakes', chapter: 'rules-of-play',
    definition:
      'What the GM names before a called roll: what failure costs, from a closed menu, and, where it is not obvious, what success gives. Once the dice are rolled they cannot change.',
  },
  {
    term: 'Focus Titan', chapter: 'fighting-titans',
    aliases: ['Focus Titans'],
    definition:
      'A Titan in the fight that is tracked in full, with Body Parts, Attention, a Behavior Table, and its own Positions. At most two are ever in play at once.',
  },
  {
    term: 'Background Titan', chapter: 'fighting-titans',
    aliases: ['Background Titans'],
    definition:
      'A Titan run as a closing clock rather than a Focus Titan. When its clock fills it enters as a Focus Titan, or, if two are already alive, the fight becomes a retreat.',
  },
  {
    term: 'Initiative card', chapter: 'fighting-titans',
    aliases: ['initiative cards'],
    definition:
      'One of the twenty numbered cards dealt face up each round. They come up lowest first, and each Focus Titan gets as many as its Tempo.',
  },
  {
    term: 'Attention', chapter: 'fighting-titans',
    definition:
      "The one soldier or decoy a Focus Titan is fixed on. Its Behavior Table acts against whoever holds it, and the soldier holding it cannot strike that Titan's Nape.",
  },
  {
    term: 'Attention Ladder', chapter: 'fighting-titans',
    aliases: ['Attention Ladders'],
    definition: 'The ranked list a Focus Titan reads each time it acts. The highest rung anyone meets decides who it comes for.',
  },
  {
    term: 'Next Behavior', chapter: 'fighting-titans',
    definition:
      'The Behavior Table result a Focus Titan will act on next, rolled in advance and hidden until its card comes up, a telegraph shows it, or a Read reveals it.',
  },
  { term: 'Thrash', chapter: 'fighting-titans', definition: 'What a Titan does when no other entry can happen. Every Behavior Table has one, and it is never rolled.' },
  {
    term: 'Draw Attention', chapter: 'fighting-titans',
    definition:
      'An unrolled action that makes you the loudest thing on a Titan’s ladder until the end of its next card that resolves a behavior. Never taken from Distant.',
  },
  {
    term: 'Break Attention', chapter: 'fighting-titans',
    definition:
      "An action that shifts a Titan's Attention onto a decoy for as many of its next cards as its Tempo. Easiest for the soldier holding its Attention, harder for each decoy it has fallen for since it last acted.",
  },
  {
    term: 'Decoy', chapter: 'fighting-titans',
    aliases: ['Decoys'],
    definition:
      'What a Break Attention puts in front of a Titan: a flare, a riderless horse, a thrown cloak, or your own Feint. Each of the Titan’s cards it holds resolves nothing.',
  },
  {
    term: 'Feint', chapter: 'fighting-titans',
    aliases: ['Feints'],
    definition: 'A decoy that is your own pass across a Titan’s face, from In Reach or On Body. It spends nothing and needs 1 success more.',
  },
  {
    term: 'Nape strike', chapter: 'fighting-titans',
    aliases: ['Nape strikes'],
    definition:
      'The Strength roll from Blind Spot that is the only thing that kills a Titan. Reach its Nape Depth and it dies; fall short and every success becomes an Opening.',
  },
  {
    term: 'Body Part strike', chapter: 'fighting-titans',
    aliases: ['Body Part strikes'],
    definition: "A Strength roll against a Titan's eyes, arm, or leg. Successes count toward the part's Toughness and move it toward Broken.",
  },
  {
    term: 'Body Part State', chapter: 'fighting-titans',
    aliases: ['Body Part States'],
    definition: 'Intact, Wounded, or Broken. A Broken part rules out every behavior that uses it until Regeneration brings it back.',
  },
  {
    term: 'Grounded', chapter: 'fighting-titans',
    definition:
      'What a Titan is while one of its legs is Broken. Nape strikes against it gain 2 Bonus Dice and need no working ODM Gear, and the close Positions can be reached on foot.',
  },
  {
    term: 'Steam', chapter: 'fighting-titans',
    definition:
      "The scalding vapour of a Titan's body. It burns soldiers On Body or at Blind Spot when it dies, and soldiers On Body when Regeneration brings a Body Part back.",
  },
  {
    term: 'Leap Clear', chapter: 'fighting-titans',
    definition: "The Agility roll to get out from under a Titan's body as it comes down. It needs 1 success, is not a Reaction, and spends nothing.",
  },
  {
    term: 'Pinned', chapter: 'fighting-titans',
    definition:
      "Held under a Titan's body. You cannot move or be moved, and only a Heave, cutting the pinning Body Part, or a living Titan standing frees you.",
  },
  {
    term: 'Heave', chapter: 'fighting-titans',
    definition:
      "The Strength action that lifts a Titan's body off the soldiers it pins. Each success adds 1 to the body's heave count, and the count clears only when a living Titan stands.",
  },
  {
    term: 'Corpse', chapter: 'fighting-titans',
    aliases: ['Corpses'],
    definition:
      "A dead Focus Titan's body, which stays on the field for the rest of the fight. It keeps its Positions, holds no Attention, and plays no cards.",
  },
  {
    term: 'Squad Tactic', chapter: 'fighting-titans',
    aliases: ['Squad Tactics'],
    definition:
      'A tactic the Squad owns rather than any one soldier. Each one your Squad holds can be used once per Titan Engagement, when its condition is met.',
  },
  {
    term: 'Witness', chapter: 'fighting-titans',
    aliases: ['Witnesses'],
    definition: 'Every soldier other than the victim who is alive and holds a Position once a comrade is Grabbed or dies. Each makes a Fear Roll.',
  },
  {
    term: 'Titan attack', chapter: 'wounds-and-fear',
    aliases: ['Titan attacks'],
    definition:
      'The harm a Behavior Table entry inflicts when a Titan’s card resolves it against you. It is always a Critical Injury, never damage, whatever your Health.',
  },
  {
    term: 'Damage', chapter: 'wounds-and-fear',
    definition:
      'The kind of harm that marks Health boxes: a fall, steam, a weapon, or a called roll you failed. At 0 current Health it gives a Critical Injury instead.',
  },
  {
    term: 'Current Health', chapter: 'wounds-and-fear',
    definition: 'Your Health, minus the boxes untreated Critical Injuries have crossed off, minus the Health you have lost to damage. It never goes below 0.',
  },
  {
    term: 'Injury Type', chapter: 'wounds-and-fear',
    aliases: ['Injury Types'],
    definition: 'What made the wound: Crush, Bite, Burn, Cut, or Pierce. It picks the wound’s name and applies its table’s rider, if there is one.',
  },
  {
    term: 'Injury Location', chapter: 'wounds-and-fear',
    aliases: ['Injury Locations'],
    definition: 'Where a Critical Injury lands: an arm, a leg, the torso, or the head. An arm or a leg is held at its side, left or right.',
  },
  {
    term: 'Worsening', chapter: 'wounds-and-fear',
    definition: 'The 2 added to a Critical Injury roll for each one that already counts at that same Injury Location and side. The same place hurt twice reads worse.',
  },
  {
    term: 'Treat Injury', chapter: 'wounds-and-fear',
    definition: 'The Wits action that treats one Critical Injury or revives a Down comrade. It takes Gear Dice from a medical kit, and needs 1 success.',
  },
  {
    term: 'Care window', chapter: 'wounds-and-fear',
    aliases: ['care windows'],
    definition:
      'The only moment Treat Injury is rolled away from a fight. Each has a scope of soldiers, and each of them may make one roll and Help one other.',
  },
  {
    term: 'Aftermath roll', chapter: 'wounds-and-fear',
    aliases: ['aftermath rolls'],
    definition: 'The one chance at treatment a dying soldier gets when a fight ends, before the Death Rolls. One per patient, one per treater, no Help.',
  },
  {
    term: 'Stabilized', chapter: 'wounds-and-fear',
    definition: 'What a lethal Critical Injury becomes once treatment or a good Death Roll settles it. It is no longer lethal and never rolls again.',
  },
  {
    term: 'Prosthetic', chapter: 'wounds-and-fear',
    aliases: ['Prosthetics'],
    definition: 'A fitted arm or leg that lowers a lost-limb grade one step. It gives no dice, is never a weapon, and waits until the loss has healed.',
  },
  { term: 'Airborne', chapter: 'gear-and-odm', definition: "In the air on your own ODM Gear. An ODM move puts you there; a move that is not an ODM move, a fall, a Grab, or the end of the fight takes you out of it." },
  { term: 'Current rating', chapter: 'gear-and-odm', aliases: ['current ratings'], definition: 'How much of a gear item\u2019s rating is left, from 0 up to that rating. It is the item\u2019s Gear Dice, and wear is what lowers it.' },
  { term: 'Field Repair', chapter: 'gear-and-odm', definition: 'The Wits action that mends ODM Gear, a tool kit, or a firearm. It needs 1 success, and each success raises the current rating by 1.' },
  { term: 'Funding', chapter: 'gear-and-odm', definition: "What the Survey Corps can afford, from 1 to 6. It sets Standard Issue and the Squad's stock of Squad Supply. Until the Funding rules are written it is 3." },
  { term: 'Gas Rating', chapter: 'gear-and-odm', definition: 'The gas left in the canister fitted to your ODM Gear, from 0 to 3. Each 1 on a Gas Roll costs you a point of it.' },
  { term: 'Gear item', chapter: 'gear-and-odm', aliases: ['gear items'], definition: 'One of the things on the gear list: ODM Gear, gas canisters, Blade Sets, horses, medical and tool kits, firearms, and prosthetics. No other object is one, and no other object adds Gear Dice.' },
  { term: 'Kept item', chapter: 'gear-and-odm', aliases: ['kept items'], definition: 'An item a Requisition gave you. Standard Issue never takes it away unless you hand it in.' },
  { term: 'Lame', chapter: 'gear-and-odm', definition: 'A horse worn down to 0. It cannot be mounted, adds no Gear Dice, and drops any rider, who falls from a horse.' },
  { term: 'Mounted', chapter: 'gear-and-odm', definition: 'Riding your own horse. A mounted soldier is never airborne, and an ODM move dismounts them before it moves them.' },
  { term: 'ODM move', chapter: 'gear-and-odm', aliases: ['ODM moves'], definition: 'A move you make on your own ODM Gear. It needs a harness that is not Jammed and gas above 0, it is what makes you airborne, and in a Titan Engagement it is a Flight.' },
  { term: 'Flight', chapter: 'fighting-titans', aliases: ['Flights'], definition: 'Every ODM move in a Titan Engagement. Roll Fly with your own ODM Gear: the step happens whatever the roll gives, each success is 1 Momentum, and no successes leaves you marked loudest.' },
  { term: 'Momentum', chapter: 'fighting-titans', definition: 'Speed you are carrying, from 0 up to the Anchors left. A Flight earns it, Carry, Bite, Brace, Quiet and a clean line spend it, and a round with no ODM move loses all of it.' },
  { term: 'Anchor', chapter: 'fighting-titans', aliases: ['Anchors'], definition: 'The fight’s public pool of things worth hooking, set by the Anchor Rating. Whatever is left is every soldier’s Momentum cap. A Titan wrecks them and nothing puts them back.' },
  { term: 'Terrain Trait', chapter: 'fighting-titans', aliases: ['Terrain Traits'], definition: 'The one printed line each Anchor Rating gives beyond its Anchors and its step rows. Wooded has none.' },
  { term: 'Running dry', chapter: 'gear-and-odm', aliases: ['run dry', 'runs dry', 'ran dry'], definition: 'Reaching Gas Rating 0. Your ODM Gear counts as not had until you have gas again, but running dry never drops you.' },
  { term: 'Squad Supply', chapter: 'gear-and-odm', definition: 'The rations, flares, medical supplies, and shot the Squad holds together. No soldier carries it, and it counts as no item.' },
  { term: 'Mission Brief', chapter: 'expeditions-and-downtime', definition: "Command's written orders for an Expedition: the Waypoints in order, each Leg's Distance Band and Formation Post, and the days a Hard Ride is ordered." },
  { term: 'Distance Band', chapter: 'expeditions-and-downtime', aliases: ['Distance Bands'], definition: 'How far out a Leg carries the Squad: Near, Far, or Deep. The deeper the Leg, the worse its hazard reads.' },
  { term: 'Formation Post', chapter: 'expeditions-and-downtime', aliases: ['Formation Posts'], definition: 'Where the whole Squad rides in the long-range formation. It sets the entry the Leg roll uses and what the Leg adds to its hazard, and it changes only at a Waypoint.' },
  { term: 'Hard Ride', chapter: 'expeditions-and-downtime', aliases: ['Hard Rides'], definition: "A third Leg squeezed in before dark. It is ridden on Ride, costs twice the rations, and makes the Leg's hazard worse by 1." },
  { term: 'Lead', chapter: 'expeditions-and-downtime', definition: 'The soldier who makes a Leg roll: one soldier on the Expedition who is not Down, chosen by the players. On a Hard Ride the Lead must be mounted.' },
  { term: 'Depot', chapter: 'expeditions-and-downtime', aliases: ['Depots'], definition: 'A Waypoint stocked by the Corps. Reaching one gives every soldier a full Standard Issue and restocks Squad Supply.' },
  { term: 'Waypoint scene', chapter: 'expeditions-and-downtime', aliases: ['Waypoint scenes'], definition: 'A scene the GM frames at a Waypoint between Legs. It runs on called rolls, rides no Leg, and reads no hazard.' },
  { term: 'Camp Relief', chapter: 'expeditions-and-downtime', definition: 'The 1 Stress every soldier on the Expedition loses when the camp roll succeeds and the camp does not meet hunger.' },
  { term: 'Hunger', chapter: 'expeditions-and-downtime', definition: 'What a Leg or a Night Camp meets when the Squad holds fewer rations than it must spend. It costs every ration left and 1 Stress each, and it cancels the Camp Relief.' },
  { term: 'Requisition', chapter: 'expeditions-and-downtime', aliases: ['Requisitions'], definition: 'The Downtime Action that asks Command for gear beyond Standard Issue. There are no prices: Funding, Scarcity, and your roll decide.' },
  { term: 'Scarcity', chapter: 'expeditions-and-downtime', definition: 'How hard an item is to come by: Standard, Limited, or Rare. It sets the successes a Requisition roll needs, and Funding decides which Scarcity Command will consider.' },
  { term: 'Ledger', chapter: 'expeditions-and-downtime', definition: "Command's patience within one Downtime. It starts at 0, rises by 1 with each Requisition granted, and adds itself to what the next roll needs." },
  { term: 'Squad Action', chapter: 'expeditions-and-downtime', aliases: ['Squad Actions'], definition: 'The one action the Squad takes together each Downtime, chosen by the players.' },
  {
    term: 'Engaged', chapter: 'skirmishes',
    definition: "Within arm's reach of a Foe in a Skirmish, held separately for each Foe. Fight attacks need it, and only a move changes it.",
  },
  {
    term: 'Apart', chapter: 'skirmishes',
    definition: "Not within arm's reach of a Foe in a Skirmish, held separately for each Foe. Everyone starts Apart from every Foe unless the start says otherwise.",
  },
  {
    term: 'Ambush', chapter: 'skirmishes',
    definition:
      'The opening advantage in a Skirmish. The side that has it takes round 1 first, adds dice against anyone who has not yet acted, and cannot be answered by them.',
  },
  {
    term: 'Guard', chapter: 'skirmishes',
    definition:
      "A Foe's cancelling roll, rolled in the open against every attack on it. Each success cancels one of the attack's, and it is never Pushed and spends nothing.",
  },
  { term: 'Grit', chapter: 'skirmishes', definition: 'How many of a Foe group must be out of the Skirmish before it breaks, at the latest. A Size Up is how you learn the number.' },
  {
    term: 'Grapple', chapter: 'skirmishes',
    aliases: ['Grapples'],
    definition: 'A Fight roll declared as one before you roll, with no Gear Dice, that deals no damage. If it lands, the Foe is Held by you.',
  },
  {
    term: 'Held', chapter: 'skirmishes',
    definition: 'Caught in a hold. A Held Foe cannot move and attacks only its holder, and a holder cannot move, Shoot, or Reload while the hold lasts.',
  },
  { term: 'Release', chapter: 'skirmishes', definition: 'Letting go of a Foe you hold. No roll, and it spends nothing, at any point of your turn.' },
  { term: 'Break Free', chapter: 'fighting-titans', definition: "The action that ends a hold on you: 2 successes against a person, or a Titan's grip in a Grab." },
  {
    term: 'Block', chapter: 'skirmishes',
    aliases: ['Blocks', 'Blocked'],
    definition: 'The Strength Reaction that answers a Fight attack, with a Blade Set for Gear Dice. Titans cannot be blocked, so it belongs to Skirmishes.',
  },
  {
    term: 'Dodge', chapter: 'rules-of-play',
    aliases: ['Dodges', 'dodging'],
    definition: "The Agility Reaction that answers a Titan's card, a Fight attack, or a shot, with Gear Dice from ODM Gear or from the horse while you are mounted.",
  },
  {
    term: 'Parley', chapter: 'skirmishes',
    aliases: ['Parleys'],
    definition: 'The Persuade roll that asks a whole Foe group to stand down, let you pass, answer, or surrender. A success ends the Skirmish.',
  },
  { term: 'Parley value', chapter: 'skirmishes', definition: 'The base successes a Parley against a Foe group needs. A failed threat raises it by 1 for the rest of the Skirmish.' },
  {
    term: 'Size Up', chapter: 'skirmishes',
    definition:
      'The Instinct roll that reads a Foe group: its Grit, how many more must fall before it breaks, and what each of its Foes is about to do. Once per group, for the whole Squad.',
  },
  { term: 'Watch', chapter: 'skirmishes', definition: 'The successes a Sneak roll needs to take the Ambush from a Foe group.' },
  {
    term: 'Out of the Skirmish', chapter: 'skirmishes',
    definition: 'What a Foe at 0 Health is: dead from Cut, Pierce, or Burn, or out cold from Crush. It takes no further part and is never a target again.',
  },
  { term: 'Attribute roll', chapter: 'rules-of-play', aliases: ['attribute roll', 'attribute rolls'], definition: 'A roll whose rule names an attribute: an action, a Reaction, a called roll, and every roll a rule calls for. Only an attribute roll builds a pool, counts successes, and can be Pushed.' },
  { term: 'Turn', chapter: 'rules-of-play', definition: 'One move and one action, taken when your card comes up. A Reaction spends a whole turn, both parts of it.' },
  { term: 'Action', chapter: 'rules-of-play', definition: 'The one thing you do on your turn besides moving: an Action Catalog entry, Help, an improvised act, or a called roll.' },
  { term: 'Move', chapter: 'rules-of-play', definition: 'The part of your turn that changes where you are. In a Titan Engagement it changes your Position relative to one Titan by one step, and it can include one mount or dismount.' },
  { term: 'Model entry', chapter: 'rules-of-play', aliases: ['model entry', 'model entries'], definition: "The Action Catalog entry the GM names as the one an improvised act imitates. The act does only what that entry does, at that entry's size." },
  { term: 'Attribute', chapter: 'making-your-soldier', aliases: ['Attributes'], definition: 'One of the six ratings on your sheet: Strength, Agility, Wits, Perception, Instinct, and Empathy. They are set when you make your soldier and never rise.' },
  { term: 'Key attribute', chapter: 'making-your-soldier', aliases: ['key attribute', 'key attributes'], definition: 'The one attribute your Specialty is built on. Graduation swaps your highest rating onto it, and it is the only attribute that can reach 6.' },
  { term: 'Dice Talent', chapter: 'making-your-soldier', aliases: ['dice Talent', 'dice Talents', 'Dice Talents'], definition: 'A Talent that adds base dice equal to its level to the entries it names. A roll uses at most one.' },
  { term: 'Rule Talent', chapter: 'making-your-soldier', aliases: ['rule Talent', 'rule Talents', 'Rule Talents'], definition: 'A Talent that bends a rule each time its trigger happens instead of adding dice. They stack with each other and with the dice Talent.' },
  { term: 'Fixed roll', chapter: 'making-your-soldier', aliases: ['fixed roll', 'fixed rolls'], definition: 'A roll that is not an attribute roll and rolls exactly the dice its rule states: the Fear Roll, the Stress Response roll, and the Gas Roll.' },
  { term: 'Roll-off', chapter: 'making-your-soldier', aliases: ['roll-off', 'roll-offs'], definition: 'How the table settles a choice the players share. Each proposal is rolled for with a D6, the highest takes it, and a tie rolls again.' },
  { term: 'Performance roll', chapter: 'making-your-soldier', aliases: ['performance roll', 'performance rolls'], definition: "The roll that closes each Training Year, made on the attribute alone. Its successes set that year's Merit, and it is never tried again." },
  { term: 'Promotion', chapter: 'making-your-soldier', aliases: ['promotion', 'promotions', 'Promotions'], definition: 'What replaces a player character who dies or retires: their player takes over a living Squadmate, which keeps everything it holds and rolls an Origin, a Drive, and three Training Year Talents.' },
  { term: 'Rank', chapter: 'making-your-soldier', definition: "A soldier's place in the chain of command: Private, Squad Leader, or Section Commander. Every new soldier is a Private." },
  { term: 'Round', chapter: 'fighting-titans', definition: 'One pass through a Titan Engagement: Wings, the deal, swaps, every card in order, then the end steps. Your move and your action refresh at the start of each one.' },
  { term: 'Telegraph', chapter: 'fighting-titans', aliases: ['telegraph', 'telegraphs', 'Telegraphs'], definition: "An effect on a behavior that shows everyone the Titan's new Next Behavior. It applies whether the card landed or whiffed." },
  { term: 'Retreat', chapter: 'fighting-titans', definition: 'What a Titan Engagement becomes when its retreat clock fills. Nothing more arrives, every move is forced toward Distant, and no Nape strike is made.' },
  { term: 'Retreat clock', chapter: 'fighting-titans', aliases: ['retreat clock', 'retreat clocks'], definition: 'The clock every Titan Engagement carries. It fills 1 segment at the end of each round, never from a flare, and the fight becomes a retreat when it is full.' },
  { term: 'Falling Titan', chapter: 'fighting-titans', aliases: ['falling Titan'], definition: "A Focus Titan's body coming down, which happens when it dies and when it becomes grounded. Everyone On Body or at Blind Spot who is not airborne must Leap Clear or be Pinned." },
  { term: 'Corpse heat', chapter: 'fighting-titans', aliases: ['Corpse Heat', 'corpse heat'], definition: 'The heat of an evaporating corpse. It gives a soldier Pinned under one a Burn Critical Injury at the start of each of their turns, and 1 Burn damage to each soldier who Heaves it.' },
  { term: 'Rating', chapter: 'gear-and-odm', definition: 'What a gear item is worth whole, from 1 to 3, set when you receive it. It never changes: the current rating is the number that moves.' },
  { term: 'Wear', chapter: 'gear-and-odm', definition: 'What a Gear Die showing 1 on a Pushed roll costs the item that supplied it: 1 off its current rating. A roll you did not Push wears nothing.' },
  { term: 'Left item', chapter: 'gear-and-odm', aliases: ['Left items'], definition: "A dead soldier's gear that stays behind for the Squad. Take Item lifts one during the fight, and the rest is shared out when the fight ends." },
  { term: 'Carried', chapter: 'gear-and-odm', definition: 'Being lifted and moved by a comrade. You hold their Position, your move changes nothing, and you are never airborne on your own harness.' },
  { term: 'Shot', chapter: 'gear-and-odm', definition: "The Squad Supply a firearm's Reload spends, one unit a shot." },
  { term: 'Leg roll', chapter: 'expeditions-and-downtime', aliases: ['Leg rolls'], definition: 'The one roll a Leg is ridden on, made by the Lead. It needs 1 success, and the Squad reaches the Waypoint whatever it shows.' },
  { term: 'Camp roll', chapter: 'expeditions-and-downtime', aliases: ['camp roll', 'camp rolls'], definition: 'The Survive roll made at a Night Camp. A success, at a camp that does not meet hunger, gives every soldier the Camp Relief.' },
  { term: 'Hazard', chapter: 'expeditions-and-downtime', aliases: ['hazard', 'hazards', 'Hazards'], definition: 'What a Leg or a Night Camp throws at the Squad, rolled by the GM in the open. The Distance Band, the Formation Post, the Pace, and your Leg roll all move the total.' },
  { term: 'Pace', chapter: 'expeditions-and-downtime', definition: 'How hard Command drives a Leg: Steady, or a Hard Ride squeezed in before dark at twice the rations.' },
  { term: 'Straggler', chapter: 'expeditions-and-downtime', aliases: ['Stragglers'], definition: 'The soldier one hazard takes off the back of the formation. A roll picks them, never a choice, and they roll Endure to come away whole.' },
];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const GLOSSARY: GlossaryEntry[] = RAW.map((e) => ({ ...e, aliases: e.aliases ?? [], slug: slugify(e.term) })).sort((a, b) =>
  a.term.localeCompare(b.term, 'en'),
);

export function getGlossaryEntry(term: string): GlossaryEntry | undefined {
  const key = term.trim().toLowerCase();
  return GLOSSARY.find((e) => e.term.toLowerCase() === key || e.aliases.some((a) => a.toLowerCase() === key));
}
