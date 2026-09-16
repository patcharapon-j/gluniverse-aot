/**
 * Player-facing glossary. Definitions are written for the table from the
 * project glossary's meanings; they are short enough for a pop-up.
 */
export interface GlossaryEntry {
  term: string;
  slug: string;
  definition: string;
  aliases: string[];
}

const RAW: { term: string; definition: string; aliases?: string[] }[] = [
  { term: 'Action Catalog', definition: 'The full list of named actions, Reactions, and rolls a soldier can make. Each entry names its attribute and the gear that can add Gear Dice.' },
  { term: 'Anchor Rating', definition: 'How well a battlefield holds ODM Gear anchors, from Open to Giant Forest. It decides which Position changes ODM Gear allows.' },
  { term: 'Cadet', aliases: ['Cadets'], definition: 'A member of the Training Corps who has not yet graduated.' },
  { term: 'Down', definition: 'The state of a soldier at 0 Health, or holding an untreated Critical Injury that says so. A Down soldier can do little more than crawl, and cannot Push, Help, Cover, or make a Reaction.' },
  { term: 'Downtime', definition: 'The time the Squad spends inside the Walls between Expeditions.' },
  { term: 'Downtime Action', aliases: ['Downtime Actions'], definition: 'One of the things a player character does during Downtime, such as Recover or Visit Haven.' },
  { term: 'Fear Roll', aliases: ['Fear Rolls'], definition: 'A roll forced by a horrifying event, such as a comrade Grabbed by a Titan. The dice never cause one.' },
  { term: 'Foe', aliases: ['Foes'], definition: 'A person, or a band of people, the Squad fights in a Skirmish.' },
  { term: 'Grabbed', definition: "Gripped in a Titan's hand. You cannot Help, Cover, or make a Reaction, and the Titan devours you unless you get free in time." },
  { term: 'Graduation Exam', definition: "The optional played prologue of three Trials that helps decide each Cadet's Class Rank." },
  { term: 'Grief', definition: 'The weight a soldier carries after a comrade dies. Each point lowers Resolve by 1 until it is dealt with during Downtime.' },
  { term: 'Haven', definition: 'What a soldier has to return to. During Downtime it lets them lower Stress and Grief.' },
  { term: 'Jam', aliases: ['Jams', 'Jammed'], definition: 'ODM Gear worn down to 0. It stops working and drops an airborne soldier.' },
  { term: 'Net Successes', definition: "An attack's successes left after a Reaction cancels them one for one. The attack lands on 1 or more." },
  { term: 'Overloaded', definition: 'Carrying more than Strength + 4 items. Every ODM move then spends your action as well.' },
  { term: 'Position', aliases: ['Positions'], definition: 'Where a soldier is relative to a Focus Titan: Distant, In Reach, On Body, or Blind Spot.' },
  { term: 'Rally', definition: "The Empathy roll that clears one of a comrade's lasting Stress Responses or pending Fear results for each success. It never lowers their Stress." },
  { term: 'Reaction', aliases: ['Reactions'], definition: 'A dodge or block you make when a Titan or a Foe acts against you, outside your own turn. Each success cancels one of the attack\'s, and it spends a whole turn.' },
  { term: 'Resolve', definition: "A soldier's steadiness: half of Instinct plus Empathy, rounded up, plus 1 per Scar and minus 1 per point of Grief. It counts against Stress Response and Fear Roll results." },
  { term: 'Scar', aliases: ['Scars'], definition: 'A lasting, named trauma that changes how you play. Each one raises your minimum Stress and your Resolve by 1.' },
  { term: 'Severity', definition: 'The successes an attack roll scored, announced to every target. A Reaction must cancel all of them to avoid the attack.' },
  { term: 'Skirmish', aliases: ['Skirmishes'], definition: 'A scene in which soldiers fight people rather than Titans.' },
  { term: 'Squad', definition: 'The Survey Corps unit made up of the player characters and their Squadmates.' },
  { term: 'Squadmate', aliases: ['Squadmates'], definition: 'A named soldier any player can direct. Squadmates ride with the Squad, can be targeted like anyone else, and never Push or Cover.' },
  { term: 'Titan Engagement', aliases: ['Titan Engagements'], definition: 'A scene in which the Squad confronts one or more Titans. It runs in rounds.' },
  { term: 'Wing', aliases: ['Wings'], definition: "A Squadmate's attachment to one player character during a Titan Engagement. The Squadmate acts right after that character." },
  { term: 'Abnormal', definition: 'A Titan that breaks the usual pattern. It acts from its own Behavior Table, and some of its numbers stay unknown until your squad makes a Read.' },
  { term: 'Attack Dice', definition: "The Titan Dice a behavior rolls when it comes for a soldier: 3, 6, 9, or 12, set by the behavior and the Titan's size." },
  { term: 'Base dice', aliases: ['base die'], definition: 'The dice from your attribute, your Talent, and any Bonus Dice. Each 6 is a success.' },
  { term: 'Behavior Table', definition: 'The d6 table a Titan acts from. Titans take no ordinary turns: the GM rolls, and the Titan does what the table says.' },
  { term: 'Body Part', aliases: ['Body Parts'], definition: "A Titan's eyes, arms, and legs. Cut one enough and it breaks, which can blind the Titan or bring it down." },
  { term: 'Bonus Dice', definition: 'Extra base dice from Help, Openings, and the other things a rule names. A roll takes at most 4.' },
  { term: 'Cover', aliases: ['Covering', 'Covers'], definition: "Taking the Stress of a comrade's Push yourself, so they add no new Stress Die." },
  { term: 'Critical Injury', aliases: ['Critical Injuries'], definition: 'A lasting wound with a location and a type. Titan attacks inflict them directly, and some can kill.' },
  { term: 'Death Roll', definition: 'The Strength roll you make when a lethal Critical Injury runs out of time. It can never be Pushed.' },
  { term: 'Expedition', aliases: ['Expeditions'], definition: 'A Survey Corps operation beyond the Walls, ridden one Leg at a time.' },
  { term: 'Gas Roll', definition: 'Two dice rolled each round you use ODM Gear, or three after a Pushed roll made with it. Each 1 costs you gas.' },
  { term: 'Gear Dice', aliases: ['Gear Die'], definition: 'Dice from your equipment. A Push never rolls them again, and a 1 on a Pushed roll wears that gear down.' },
  { term: 'Help', definition: "Adding 1 die to a comrade's roll. Up to three soldiers can Help." },
  { term: 'Nape', definition: "The back of a Titan's neck, and the only place a cut can kill it." },
  { term: 'Nape Depth', definition: 'The successes a single Nape strike needs to kill a Titan. A strike that falls short leaves Openings.' },
  { term: 'ODM Gear', definition: "The gas-powered grappling harness that carries you between anchor points and up to a Titan's Nape." },
  { term: 'Opening', aliases: ['Openings'], definition: 'A chance your strike made for a comrade. Another soldier can spend it as a Bonus Die on a Nape strike before the Titan regenerates.' },
  { term: 'Push', aliases: ['Pushing', 'Pushed'], definition: 'Rolling again for more successes at the cost of 1 Stress. Base dice and Stress Dice not showing a 6 are rolled again. Gear Dice stay.' },
  { term: 'Read', definition: 'Watching a Titan closely to learn something about it, such as what it will do next, for the whole squad.' },
  { term: 'Regeneration', definition: "A Titan's healing clock. When it fills, its worst wound closes by one step and every Opening on it is lost." },
  { term: 'Size Class', definition: "A Titan's height: Small, 3 to 5 m; Medium, 6 to 10 m; or Large, 11 to 15 m." },
  { term: 'Specialty', aliases: ['Specialties'], definition: "Your soldier's training, chosen at Graduation. It grants bonuses but never forbids you anything." },
  { term: 'Stress', definition: 'Mounting fear and adrenaline. It makes you more capable and more likely to break.' },
  { term: 'Stress Dice', aliases: ['Stress Die'], definition: 'One die for each point of Stress you carry, added to your rolls. They succeed on a 6, and a 1 sets off a Stress Response.' },
  { term: 'Stress Response', definition: 'What happens when fear takes hold. A Stress Die showing a 1 sets it off, and you resolve it on the Stress Response table.' },
  { term: 'Talent', aliases: ['Talents'], definition: 'A narrow, practiced ability that adds dice to, or changes a rule for, the actions it names.' },
  { term: 'Tempo', definition: 'How many times a Titan acts each round.' },
  { term: 'Titan', aliases: ['Titans'], definition: 'A mindless, human-shaped creature that regenerates its wounds and dies only when its Nape is cut deep enough.' },
  { term: 'Titan Dice', aliases: ['Titan Attack Dice', 'Titan Attack Die'], definition: 'The dice a Titan attacks with, rolled in the open. They succeed on a 5 or 6 and are never Pushed.' },
  { term: 'Toughness', definition: 'The successes needed, across strikes, to damage a Body Part one step toward broken.' },
  { term: 'Blade Set', aliases: ['Blade Sets'], definition: 'The paired cutting edges fitted to ODM Gear handles: the unit in which they are carried, counted, and lost.' },
  { term: 'Call It', definition: "Spending 2 of a Read's successes, one of them the success that revealed the Next Behavior, so every other soldier that behavior targets gains Bonus Dice on a dodge against it." },
  { term: 'Campaign Year', definition: 'The year the campaign has reached, from 845 to 850, recorded before the first Lifepath. Origin conditions are tested against it.' },
  { term: 'Canon Tie', aliases: ['Canon Ties'], definition: 'An optional personal link to one canon character, drawn from an Origin row. It has no effect on play.' },
  { term: 'Class Rank', definition: "A graduate's final standing in their class, set by Merit, or none for a built or promoted soldier. The Top 10 are offered a place in the Military Police." },
  { term: 'Drive', aliases: ['Drives'], definition: 'What keeps a soldier fighting, written as a "When I ..." trigger. While the trigger is met, it shrugs off one Fear Roll result per session.' },
  { term: 'Free Build', definition: 'Making a soldier by placing one of two 18-point sets of ratings, 4, 3, 3, 3, 3, 2 or 4, 4, 3, 3, 2, 2, with a 4 on the key attribute, then choosing an Origin, a Drive, and Talents. Only when the campaign allows it.' },
  { term: 'Health', definition: 'Half of Strength plus Agility, rounded up, kept as a row of boxes. Untreated Critical Injuries cross off boxes, damage marks the boxes left, and at 0 you are Down.' },
  { term: 'Leg', aliases: ['Legs'], definition: 'One stretch of an Expedition between two Waypoints. The Squad always arrives, but a failed Leg makes the arrival costly.' },
  { term: 'Lifepath', definition: 'The rolled way to make a soldier: an Origin, a reason for enlisting, three Training Years, and Graduation. The only way to a key attribute of 5 or 6 or a Top 10 Class Rank.' },
  { term: 'Merit', definition: 'What a Cadet earns across the Training Years. The total decides Class Rank. A built or promoted soldier records none.' },
  { term: 'Night Camp', aliases: ['Night Camps'], definition: "The stop after a day's Legs, where the camp roll is made, the Night table is read, and a day passes." },
  { term: 'Origin', aliases: ['Origins'], definition: 'Where a Cadet was born and raised, and the first step of the Lifepath.' },
  { term: 'Retirement', aliases: ['retires', 'retire'], definition: 'A soldier leaving play at five Scars, or by choice after losing both arms or both legs, to become an instructor or a Squad contact.' },
  { term: 'Squad Pool', definition: 'The Squadmates currently serving in the Squad.' },
  { term: 'Standard Issue', definition: "The gear every soldier receives on joining the Squad and whenever a rule issues it: ODM Gear, gas canisters, Blade Sets, a horse, and a Medic's medical kit or an Engineer's tool kit." },
  { term: 'Template Build', definition: "Making a soldier from a Specialty's Squadmate template ratings, then choosing an Origin, a Drive, and Talents. Only when the campaign allows it." },
  { term: 'Training Year', aliases: ['Training Years'], definition: 'One of the three Lifepath steps spent in the Training Corps, each with an event and a performance roll.' },
  { term: 'Trial', aliases: ['Trials'], definition: 'One of the three tests of the Graduation Exam: the ODM balance test, the Titan dummy course, and the squad field exercise.' },
  { term: 'Waypoint', aliases: ['Waypoints'], definition: 'A named stopping point on an Expedition route, such as a forest, an abandoned town, or a supply depot.' },
  {
    term: 'Called roll',
    aliases: ['called rolls'],
    definition:
      'A roll the GM calls for an act no rule covers, when the outcome is in doubt and failure would cost something. The GM names its entry, its Circumstances, and its stakes before the pool is built, and the result stands.',
  },
  {
    term: 'Circumstances',
    definition:
      'The one step of a seven-step ladder, from Effortless to Desperate, that the GM names for the situation a roll is made in. A plus step adds Bonus Dice, a minus step is a penalty, and it changes dice, never what the roll needs.',
  },
  {
    term: 'Improvised act',
    aliases: ['improvised acts'],
    definition:
      "An act in a fight that is not a Catalog entry taken as written. The GM names one entry as its model, and the act does only what that entry does, at that entry's size.",
  },
  {
    term: 'Passive roll',
    aliases: ['passive rolls'],
    definition:
      'A Spot or Size Up the GM makes for you out of sight, against something you do not know is there. It has no stakes, cannot be Helped or Pushed, and you learn its result only through what you notice.',
  },
  {
    term: 'Ruling',
    definition:
      'A call the GM makes where the rules are silent: whether to roll, what the roll uses, its Circumstances, and its stakes. A ruling comes before the dice and never changes a die, a table result, a card, or what a roll needs.',
  },
  {
    term: 'Stakes',
    definition:
      'What the GM names before a called roll: what failure costs, from a closed menu, and, where it is not obvious, what success gives. Once the dice are rolled they cannot change.',
  },
  {
    term: 'Focus Titan',
    aliases: ['Focus Titans'],
    definition:
      'A Titan in the fight that is tracked in full, with Body Parts, Attention, a Behavior Table, and its own Positions. At most two are ever in play at once.',
  },
  {
    term: 'Background Titan',
    aliases: ['Background Titans'],
    definition:
      'A Titan run as a closing clock rather than a Focus Titan. When its clock fills it enters as a Focus Titan, or, if two are already alive, the fight becomes a retreat.',
  },
  {
    term: 'Initiative card',
    aliases: ['initiative cards'],
    definition:
      'One of the twenty numbered cards dealt face up each round. They come up lowest first, and each Focus Titan gets as many as its Tempo.',
  },
  {
    term: 'Attention',
    definition:
      "The one soldier or decoy a Focus Titan is fixed on. Its Behavior Table acts against whoever holds it, and the soldier holding it cannot strike that Titan's Nape.",
  },
  {
    term: 'Attention Ladder',
    aliases: ['Attention Ladders'],
    definition: 'The ranked list a Focus Titan reads each time it acts. The highest rung anyone meets decides who it comes for.',
  },
  {
    term: 'Next Behavior',
    definition:
      'The Behavior Table result a Focus Titan will act on next, rolled in advance and hidden until its card comes up, a telegraph shows it, or a Read reveals it.',
  },
  { term: 'Thrash', definition: 'What a Titan does when no other entry can happen. Every Behavior Table has one, and it is never rolled.' },
  {
    term: 'Draw Attention',
    definition:
      'An unrolled action that makes you the loudest thing on a Titan’s ladder until the end of its next card that resolves a behavior. Never taken from Distant.',
  },
  {
    term: 'Break Attention',
    definition:
      "An action that shifts a Titan's Attention onto a decoy for as many of its next cards as its Tempo. Easiest for the soldier holding its Attention, harder for each decoy it has fallen for since it last acted.",
  },
  {
    term: 'Decoy',
    aliases: ['Decoys'],
    definition:
      'What a Break Attention puts in front of a Titan: a flare, a riderless horse, a thrown cloak, or your own Feint. Each of the Titan’s cards it holds resolves nothing.',
  },
  {
    term: 'Feint',
    aliases: ['Feints'],
    definition: 'A decoy that is your own pass across a Titan’s face, from In Reach or On Body. It spends nothing and needs 1 success more.',
  },
  {
    term: 'Nape strike',
    aliases: ['Nape strikes'],
    definition:
      'The Strength roll from Blind Spot that is the only thing that kills a Titan. Reach its Nape Depth and it dies; fall short and every success becomes an Opening.',
  },
  {
    term: 'Body Part strike',
    aliases: ['Body Part strikes'],
    definition: "A Strength roll against a Titan's eyes, arm, or leg. Successes count toward the part's Toughness and move it toward Broken.",
  },
  {
    term: 'Body Part State',
    aliases: ['Body Part States'],
    definition: 'Intact, Wounded, or Broken. A Broken part rules out every behavior that uses it until Regeneration brings it back.',
  },
  {
    term: 'Grounded',
    definition:
      'What a Titan is while one of its legs is Broken. Nape strikes against it gain 2 Bonus Dice and need no working ODM Gear, and the close Positions can be reached on foot.',
  },
  {
    term: 'Steam',
    definition:
      "The scalding vapour of a Titan's body. It burns soldiers On Body or at Blind Spot when it dies, and soldiers On Body when Regeneration brings a Body Part back.",
  },
  {
    term: 'Leap Clear',
    definition: "The Agility roll to get out from under a Titan's body as it comes down. It needs 1 success, is not a Reaction, and spends nothing.",
  },
  {
    term: 'Pinned',
    definition:
      "Held under a Titan's body. You cannot move or be moved, and only a Heave, cutting the pinning Body Part, or a living Titan standing frees you.",
  },
  {
    term: 'Heave',
    definition:
      "The Strength action that lifts a Titan's body off the soldiers it pins. Each success adds 1 to the body's heave count, and the count clears only when a living Titan stands.",
  },
  {
    term: 'Corpse',
    aliases: ['Corpses'],
    definition:
      "A dead Focus Titan's body, which stays on the field for the rest of the fight. It keeps its Positions, holds no Attention, and plays no cards.",
  },
  {
    term: 'Squad Tactic',
    aliases: ['Squad Tactics'],
    definition:
      'A tactic the Squad owns rather than any one soldier. Each one your Squad holds can be used once per Titan Engagement, when its condition is met.',
  },
  {
    term: 'Witness',
    aliases: ['Witnesses'],
    definition: 'Every soldier other than the victim who is alive and holds a Position once a comrade is Grabbed or dies. Each makes a Fear Roll.',
  },
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
