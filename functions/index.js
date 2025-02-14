const { onCall } = require('firebase-functions/v2/https');
const { xml2js } = require('xml-js');
const fs = require('fs');
const ruledata = JSON.parse(fs.readFileSync('./rules.json', 'utf8'));

function filterXml(set, name, prop = 'type') {
	return set.filter(({ attributes }) => attributes[prop] === name);
}

function getRuleById(id, fromRule) {
	const rule = ruledata.elements[0].elements.find(
		({ attributes: { 'internal-id': iid } }) => iid === id
	);

	if (!rule) {
		console.log(`Could not find rule for ${id}, ${JSON.stringify(fromRule)}`);
		return null;
	}

	return rule;
}

function getRuleFlavor(rule) {
	return rule.elements
		?.find(({ name }) => name == 'Flavor')
		?.elements?.find(({ type }) => type === 'text')
		?.text.trim();
}

function getRuleText(rule, find) {
	return rule.elements
		.find(({ attributes }) => attributes?.name === find)
		?.elements?.find(({ type }) => type === 'text')
		?.text.trim();
}

function getStat(sheet, stat) {
	return parseInt(
		sheet
			.find(({ name }) => name === 'StatBlock')
			.elements.find(({ elements }) =>
				elements.some(({ attributes: { name } }) => name === stat)
			)?.attributes?.value ?? '0'
	);
}

function getResistances(sheet) {
	return Object.fromEntries(
		sheet
			.find(({ name }) => name === 'StatBlock')
			.elements.filter(({ elements }) =>
				elements.some(({ attributes: { name } }) => name?.startsWith('resist:'))
			)
			?.map?.((e) => {
				return [
					e.elements
						.find(({ attributes: { name } }) => name)
						.attributes.name.split(':')?.[1],
					parseInt(e.attributes?.value ?? '0'),
				];
			})
	);
}

function parseBonuses(rules, name) {
	return filterXml(rules, name)
		.map((t) => ({
			name: t.attributes.name,
			text: t.elements
				?.find(({ attributes: { name } }) => name === 'Short Description')
				?.elements.find(({ type }) => type === 'text')
				?.text.trim(),
		}))
		.filter(({ text }) => Boolean(text));
}

function parseItemText(text) {
	if (!text) return [];
	const parts = [
		'',
		...text.split(RegExp('(\n.* \\(.*? Action[\\)\\.])', 'g')),
	];
	const powertext = [];
	for (let i = 0; i < parts.length; i += 2) {
		powertext.push(
			parts
				.slice(i, i + 2)
				.join(' ')
				.replace(RegExp('(\\n\\r)', 'g'), ' ')
				.trim()
		);
	}

	return powertext.map((t) => {
		const [a, b, textpart] = t.split(
			RegExp('(Action|Reaction|Interrupt)\\)?\\.?', 'g')
		);

		const dataline = [a, b].join('');
		const action = dataline.match(
			RegExp('\\(?([^ ]* (Action|Reation|Interrupt))')
		)?.[1];
		const usage = dataline.match(
			RegExp('(At-Will|Encounter|Daily|Consumable)')
		)?.[0];
		const keywordmatch = dataline.match(RegExp('\\((.*)\\) [\\*•]'));
		const keywords = keywordmatch ? keywordmatch[1] : '';

		const lines = textpart.split(RegExp('[\n\r]+', 'g')).map((t) => t.trim());
		const text = lines.filter(Boolean).map((line) => {
			if (line.indexOf(':') < 0) return { name: 'Effect', text: line };
			const [name, text] = line.split(':');
			return { name: name.trim(), text: text.trim() };
		});

		return { usage, action: action?.toLowerCase(), keywords, text };
	});
}

function parseItem(id, item) {
	const rule = getRuleById(id, item);
	if (!rule) return null;

	return {
		name: rule.attributes.name,
		flavor: getRuleFlavor(rule),
		level: parseInt(getRuleText(rule, 'Level') ?? 0),
		cost: parseInt(getRuleText(rule, 'Gold') ?? 0),
		slot:
			getRuleText(rule, 'Item Slot') ?? getRuleText(rule, 'Magic Item Type'),
		source: rule.attributes.source,
		qty: parseInt(item.attributes.count),
		equipped: parseInt(item.attributes['equip-count']) >= 1,
		properties: rule.elements
			?.filter(({ attributes }) => attributes?.name === 'Property')
			?.map((e) => ({
				text: e.elements?.find(({ type }) => type === 'text')?.text.trim(),
			}))
			.filter(({ text }) => Boolean(text)),
		powers: parseItemText(
			rule.elements
				?.find(({ attributes }) =>
					['Power', 'Attack Power'].includes(attributes?.name)
				)
				?.elements?.find(({ type }) => type === 'text')
				?.text.trim()
		),
	};
}

function parsePower(id, power) {
	const rule = getRuleById(id, power);
	if (!rule) return null;

	return {
		name: power.attributes.name,
		usage: power.elements
			.find(({ attributes }) => attributes.name === 'Power Usage')
			.elements.find(({ type }) => type === 'text')
			.text.replace('(Special)', '')
			.trim(),
		flavour: getRuleFlavor(rule),
		action: getRuleText(rule, 'Action Type').toLowerCase(),
		type: getRuleText(rule, 'Power Type'),
		level: parseInt(getRuleText(rule, 'Level') ?? 0),
		class: getRuleText(rule, 'Class')
			? getRuleById(getRuleText(rule, 'Class'), rule)?.attributes?.name ?? null
			: null,
		keywords: getRuleText(rule, 'Keywords'),
		weapons: power.elements
			.filter(({ name }) => name === 'Weapon')
			.map((w) => {
				const attack = w.elements
					.find(({ name }) => name === 'AttackBonus')
					?.elements?.find(({ type }) => type === 'text')
					.text.trim();
				const damage = w.elements
					.find(({ name }) => name === 'Damage')
					?.elements?.find(({ type }) => type === 'text')
					.text.trim();
				if (!attack && !damage) return null;
				return {
					name: w.attributes.name,
					attack,
					damage,
				};
			})
			.filter(Boolean),
		text: rule.elements
			.filter(
				({ attributes }) =>
					attributes?.name &&
					!attributes?.name.startsWith('_') &&
					![
						'Class',
						'Level',
						'Power Type',
						'Power Usage',
						'Display',
						'Keywords',
						'Action Type',
					].includes(attributes?.name)
			)
			.map((line) => {
				return {
					name:
						line.attributes.name.trim() === 'Attack Type'
							? 'Range'
							: line.attributes.name.trim(),
					text: line.elements
						?.find(({ type }) => type === 'text')
						?.text.trim()
						.replaceAll(
							RegExp(
								'([0-9]*\\[W\\]|[0-9]*d[0-9]+) \\+ .*? modifier (.*?damage)',
								'g'
							),
							'<damage> $2'
						)
						.replaceAll(
							RegExp('.*? (vs. (AC|Reflex|Fortitude|Will))', 'g'),
							'<attack> $1'
						),
				};
			})
			.filter(({ text }) => Boolean(text)),
	};
}

exports.generateJson = onCall(
	{
		memory: '512MiB',
		cors: true,
	},
	(req) => {
		const xml = xml2js(req.data);
		const sheet = xml.elements[0].elements.find(
			({ name }) => name === 'CharacterSheet'
		).elements;
		const details = sheet.find(({ name }) => name === 'Details').elements;
		const rules = sheet.find(
			({ name }) => name === 'RulesElementTally'
		).elements;

		const json = {
			name: details
				.find(({ name }) => name === 'name')
				.elements.find(({ type }) => type === 'text')
				.text.trim(),
			level: parseInt(
				details
					.find(({ name }) => name === 'Level')
					.elements.find(({ type }) => type === 'text')
					.text.trim()
			),
			alignment:
				details
					.find(({ name }) => name === 'Alignment')
					.elements?.find(({ type }) => type === 'text')
					.text.trim() ?? 'Unaligned',
			race: filterXml(rules, 'Race')[0]?.attributes?.name,
			deity: filterXml(rules, 'Deity')[0]?.attributes?.name,
			size: filterXml(rules, 'Size')[0]?.attributes?.name,
			languages: filterXml(rules, 'Language').map((t) => t.attributes.name),
			class_name:
				filterXml(rules, 'Hybrid Class')
					.map((t) => t.attributes.name.replace('Hybrid ', ''))
					.join('|') || filterXml(rules, 'Class')[0].attributes.name,
			paragon: filterXml(rules, 'Paragon Path')[0]?.attributes.name,
			epic: filterXml(rules, 'Epic Destiny')[0]?.attributes.name,
			racial_features: [
				...filterXml(rules, 'Vision')
					.map(({ attributes: { name } }) =>
						name === 'Normal'
							? null
							: { name: 'Vision', text: name, group: 'senses' }
					)
					.filter(Boolean),
				...parseBonuses(rules, 'Racial Trait'),
			],
			class_features: parseBonuses(rules, 'Class Feature'),
			feats: parseBonuses(rules, 'Feat'),
			skills: {
				Acrobatics: getStat(sheet, 'Acrobatics'),
				Arcana: getStat(sheet, 'Arcana'),
				Athletics: getStat(sheet, 'Athletics'),
				Bluff: getStat(sheet, 'Bluff'),
				Diplomacy: getStat(sheet, 'Diplomacy'),
				Dungeoneering: getStat(sheet, 'Dungeoneering'),
				Endurance: getStat(sheet, 'Endurance'),
				Heal: getStat(sheet, 'Heal'),
				History: getStat(sheet, 'History'),
				Insight: getStat(sheet, 'Insight'),
				Intimidate: getStat(sheet, 'Intimidate'),
				Nature: getStat(sheet, 'Nature'),
				Perception: getStat(sheet, 'Perception'),
				Religion: getStat(sheet, 'Religion'),
				Stealth: getStat(sheet, 'Stealth'),
				Streetwise: getStat(sheet, 'Streetwise'),
				Thievery: getStat(sheet, 'Thievery'),
			},
			skills_trained: filterXml(rules, 'Skill Training').map(
				({ attributes: { name } }) => name
			),
			attributes: {
				Strength: getStat(sheet, 'Strength'),
				Constitution: getStat(sheet, 'Constitution'),
				Dexterity: getStat(sheet, 'Dexterity'),
				Intelligence: getStat(sheet, 'Intelligence'),
				Wisdom: getStat(sheet, 'Wisdom'),
				Charisma: getStat(sheet, 'Charisma'),
			},
			defences: {
				AC: getStat(sheet, 'AC'),
				Fortitude: getStat(sheet, 'Fortitude'),
				Reflex: getStat(sheet, 'Reflex'),
				Will: getStat(sheet, 'Will'),
			},
			resistances: getResistances(sheet),
			action_points: 1,
			power_points: getStat(sheet, 'Power Points'),
			movement: getStat(sheet, 'Speed'),
			hp_max: getStat(sheet, 'Hit Points'),
			bloodied: Math.floor(getStat(sheet, 'Hit Points') / 2),
			surge_value: Math.floor(getStat(sheet, 'Hit Points') / 4),
			surges: getStat(sheet, 'Healing Surges'),
			initiative: getStat(sheet, 'Initiative'),
			items:
				sheet
					.find(({ name }) => name === 'LootTally')
					.elements?.filter(
						({ attributes }) => parseInt(attributes['count']) >= 1
					)
					.map((e) => {
						const id =
							e.elements.find(
								({ attributes: { type } }) => type === 'Magic Item'
							)?.attributes['internal-id'] ??
							e.elements.find(({ attributes }) =>
								Boolean(attributes['internal-id'])
							)?.attributes['internal-id'];
						return parseItem(id, e);
					})
					.filter(Boolean) ?? [],
			rituals:
				sheet
					.find(({ name }) => name === 'LootTally')
					.elements?.filter(
						({ attributes, elements }) =>
							parseInt(attributes['count']) >= 1 &&
							elements.some(({ attributes: { type } }) => type === 'Ritual')
					)
					.map((e) => {
						const id = e.elements.find(
							({ attributes: { type } }) => type === 'Ritual'
						)?.attributes['internal-id'];
						const rule = getRuleById(id, e);
						const data = rule?.elements?.map((line) => [
							line.attributes?.name?.trim().toLowerCase() ?? 'text',
							line.text
								? line.text.trim()
								: line.elements
										?.find(({ type }) => type === 'text')
										.text.trim(),
						]);
						return data
							? {
									name: rule.attributes.name,
									...Object.fromEntries(data),
							  }
							: null;
					})
					.filter(Boolean) ?? [],
			powers: sheet
				.find(({ name }) => name === 'PowerStats')
				.elements.map((p) => {
					const id = filterXml(rules, p.attributes.name, 'name').filter(
						({ attributes: { type } }) => type === 'Power'
					)[0]?.attributes['internal-id'];
					if (!id) return null;
					return parsePower(id, p);
				})
				.filter(Boolean),
		};
		return json;
	}
);
