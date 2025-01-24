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
					name: item['name-override'] ?? item.name,
					...p,
					path: ['items', itemIdx, 'powers', powerIdx],
				}))
			)
			?.flat() ?? []),
	];

	return {
		...character,
		powers,
		features,
	};
}
