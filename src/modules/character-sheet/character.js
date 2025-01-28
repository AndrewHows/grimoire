import { getProp } from '@/modules/character-sheet/utils';

export const defaultLayout = [
	{
		page: [
			{ section: 'Traits' },
			{
				columns: [
					{ column: ['Portrait', 'Attributes', 'Skills'] },
					{
						column: [
							'PowerPoints',
							'Health',
							'Defences',
							'Movement',
							'Senses',
							'Saves',
							'ExtraGroups',
						],
					},
					{ column: ['Features'] },
				],
			},
		],
	},
	{ section: 'Powers' },
];

export function processCharacter(character) {
	const features = [
		...(character?.racial_features ?? []).map((f, raceIdx) => ({
			...f,
			path: ['racial_features', raceIdx],
		})),
		...(character?.feats ?? []).map((f, featIdx) => ({
			...f,
			path: ['feats', featIdx],
		})),
		...(character?.class_features ?? []).map((f, classIdx) => ({
			...f,
			path: ['class_features', classIdx],
		})),
		...(character?.items
			?.map((i, itemIdx) =>
				i.properties.map((p, propertyIdx) => ({
					name: i.name,
					'name-override': i['name-override'],
					...p,
					path: ['items', itemIdx, 'properties', propertyIdx],
				}))
			)
			?.flat() ?? []),
	];

	const powers = [
		...(character?.powers ?? []).map((p, powerIdx) => ({
			...p,
			path: ['powers', powerIdx],
		})),
		...(character?.items
			?.map((item, itemIdx) =>
				item.powers.map((p, powerIdx) => ({
					name: getProp(item, 'name'),
					...p,
					path: ['items', itemIdx, 'powers', powerIdx],
				}))
			)
			?.flat() ?? []),
		...(character?.rituals ?? []).map((r, ritualIdx) => ({
			name: r.name,
			usage: 'ritual',
			action: 'ritual',
			path: ['rituals', ritualIdx],
			hide: r.hide,
			size: r.size,
			keywords: r.category,
			text: [
				{ name: 'Cost', text: r['component cost'] },
				{ name: 'Skill', text: r.skill },
				{ name: 'Time', text: r.skill },
				{ name: 'Duration', text: r.duration },
				{ name: 'Effect', text: r.text },
			].filter(({ text }) => Boolean(text)),
		})),
	];

	return {
		...character,
		powers,
		features,
	};
}
