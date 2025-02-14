export const MOBILE_BREAKPOINT = 'xs';
export const CONTENT_WIDTH = '1600px';
export const PROFILE_COLLECTION = 'people';
export const FEATURE_FLAG_COLLECTION = 'feature-flags';
export const CHARACTER_COLLECTION = 'characters';
export const MONSTER_COLLECTION = 'monsters';
export const ENCOUNTER_COLLECTION = 'encounters';
export const GAME_COLLECTION = 'games';
export const PARTY_COLLECTION = 'parties';
export const LANGUAGES = [
	{ code: 'en', icon: '🇬🇧', name: 'English' },
	{ code: 'de', icon: '🇩🇪', name: 'Deutsch' },
];
export const AUDIENCES = {
	nobody: () => false,
	everybody: () => true,
	admin: (user) => Boolean(user.profile?.secure?.admin),
};

export const PAGE_SIZE = 25;

export const monsterRoles = [
	{
		name: 'Brute',
		hpBase: 26,
		hpLevel: 10,
		acMod: -2,
		damageMultiplier: 1.25,
	},
	{
		name: 'Artillery',
		hpBase: 21,
		hpLevel: 6,
		acMod: -2,
	},
	{
		name: 'Controller',
		hpBase: 24,
		hpLevel: 8,
	},
	{
		name: 'Lurker',
		hpBase: 21,
		hpLevel: 6,
	},
	{
		name: 'Skirmisher',
		hpBase: 24,
		hpLevel: 8,
	},
	{
		name: 'Soldier',
		hpBase: 24,
		hpLevel: 8,
		acMod: +2,
	},
];

export const monsterVariants = [
	{
		name: 'Elite',
		hpMultiplier: 2,
		xpMultiplier: 2,
	},
	{
		name: 'Solo',
		hpMultiplier: 4,
		xpMultiplier: 5,
	},
	{
		name: 'Minion',
		hpSet: 1,
		damageMultiplier: 0.5,
		xpMultiplier: 0.25,
	},
	{
		name: 'Normal',
	},
];

export const defenceRatings = [
	{
		name: 'Strong',
		mod: 2,
	},
	{
		name: 'Normal',
		mod: 0,
	},
	{
		name: 'Weak',
		mod: -2,
	},
];

export const skills = [
	'Acrobatics',
	'Arcana',
	'Athletics',
	'Bluff',
	'Diplomacy',
	'Dungeoneering',
	'Endurance',
	'Heal',
	'History',
	'Insight',
	'Intimidate',
	'Nature',
	'Perception',
	'Religion',
	'Stealth',
	'Streetwise',
	'Thievery',
];

export const monsterBase = {
	ac: 14,
	nads: 12,
	accuracy: 5,
	damage: 8,
};

export const nads = ['Fortitude', 'Reflexes', 'Will'];

export const sizes = [
	{ name: 'Tiny', reach: 0, space: 0.5 },
	{ name: 'Small', reach: 1, space: 1 },
	{ name: 'Medium', reach: 1, space: 1 },
	{ name: 'Large', reach: 2, space: 2 },
	{ name: 'Huge', reach: 3, space: 3 },
	{ name: 'Gargantuan', reach: 4, space: 4 },
];

export const powerRanges = [
	{ name: 'Self' },
	{
		name: 'Melee',
		options: ['Distance', 'Basic'],
		icon: 'M',
		render: ({ Distance }) => `Reach ${Distance}; `,
	},
	{
		name: 'Ranged',
		options: ['Distance', 'Basic'],
		icon: 'R',
		render: ({ Distance }) => `Ranged ${Distance}; `,
	},
	{
		name: 'Burst',
		damageMultiplier: 0.75,
		options: ['Size', 'Distance'],
		render: ({ Size, Distance }) => `Burst ${Size} within ${Distance}; `,
		icon: 'a',
	},
	{
		name: 'Close Burst',
		damageMultiplier: 0.75,
		options: ['Size'],
		icon: 'c',
		render: ({ Size }) => `Close Burst ${Size}; `,
	},
	{
		name: 'Close Blast',
		damageMultiplier: 0.75,
		options: ['Size'],
		icon: 'c',
		render: ({ Size }) => `Close Blast ${Size}; `,
	},
];

export const usages = [
	{ name: 'At-Will' },
	{ name: 'Recharge', options: ['Condition'], damageMultiplier: 1.25 },
	{ name: 'Encounter', damageMultiplier: 1.5 },
];

export const origins = [
	'Aberrant',
	'Elemental',
	'Fey',
	'Immortal',
	'Natural',
	'Shadow',
];

export const monsterTypes = ['Animate', 'Beast', 'Humanoid', 'Magical Beast'];

export const languages = [
	'Abyssal',
	'Common',
	'Draconic',
	'Dwarven',
	'Elven',
	'Deep Speech',
	'Giant',
	'Goblin',
	'Primordial',
	'Supernal',
];

export const alignments = [
	'Lawful Good',
	'Good',
	'Evil',
	'Chaotic Evil',
	'Unaligned',
];

export const skillAttributeMapping = {
	Strength: ['Athletics'],
	Constitution: ['Endurance'],
	Dexterity: ['Acrobatics', 'Stealth', 'Thievery'],
	Intelligence: ['Arcana', 'History', 'Religion'],
	Wisdom: ['Dungeoneering', 'Heal', 'Insight', 'Nature', 'Perception'],
	Charisma: ['Bluff', 'Diplomacy', 'Intimidate', 'Streetwise'],
};
