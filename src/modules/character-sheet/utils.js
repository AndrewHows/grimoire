export function getWeaponTrait(power, attribute) {
	const weapons = getProp(power, 'weapons');

	return (
		(power.weapon
			? weapons.find(({ name }) => name === power.weapon)
			: weapons?.[0])?.[attribute] ?? ''
	);
}

export function getAttributeMod(value) {
	return Math.floor((value - 10) / 2);
}

export function processText(text, character, power) {
	return text
		.replaceAll(
			RegExp(`<(${Object.keys(character.attributes ?? {}).join('|')})>`, 'g'),
			(_, attr) => getAttributeMod(character.attributes[attr])
		)
		.replaceAll('<attack>', power && `+${getWeaponTrait(power, 'attack')}`)
		.replaceAll('<damage>', power && getWeaponTrait(power, 'damage'));
}

export const featureGroups = [
	{ label: 'Action Points', value: 'action-point' },
	{ label: 'Health', value: 'health' },
	{ label: 'Defences', value: 'defences' },
	{ label: 'Movement', value: 'movement' },
	{ label: 'Senses', value: 'senses' },
	{ label: 'Saves', value: 'saves' },
	{ label: 'Skills', value: 'skills' },
	{ label: 'None', value: '' },
];

export const actionOrder = [
	'No Action',
	'Free Action',
	'Opportunity Action',
	'Immediate Interrupt',
	'Immediate Reaction',
	'Minor Action',
	'Move Action',
	'Standard Action',
	'Ritual',
];

export const usageOrder = [
	'At-Will',
	'Encounter',
	'Daily',
	'Consumable',
	'Ritual',
];

export const getProp = (obj, prop) => {
	return obj[`${prop}-override`] ?? obj[prop];
};

export const sortPowers = (character) => (a, b) => {
	switch (character.powerSort) {
		case 'action': {
			return (
				actionOrder.indexOf(getProp(a, 'action')) -
				actionOrder.indexOf(getProp(b, 'action'))
			);
		}
		case 'usage':
		default: {
			return (
				usageOrder.indexOf(getProp(a, 'usage')) -
				usageOrder.indexOf(getProp(b, 'usage'))
			);
		}
	}
};
