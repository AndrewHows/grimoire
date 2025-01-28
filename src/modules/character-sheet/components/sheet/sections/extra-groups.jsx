import { useContext } from 'react';
import { Character } from '../context';
import { Section } from '../components/section';
import { Column } from '../components/layout';
import { KeyValues } from '../components/key-values';
import { featureGroups } from '@/modules/character-sheet/utils';

export const ExtraGroups = () => {
	const { character } = useContext(Character);

	const extraGroups = character.features
		.filter(
			(f) =>
				f.group && !featureGroups.map(({ value }) => value).includes(f.group)
		)
		.map(({ group }) => ({ label: group, value: group }))
		.filter(
			({ value }, idx, orig) =>
				idx === orig.map(({ value: v }) => v).indexOf(value)
		);

	return extraGroups.map((group) => (
		<Section key={group.value} label={group.label}>
			<Column style={{ gap: '0.5rem' }}>
				<KeyValues
					values={character.features.filter(
						({ group: fGroup }) => fGroup === group.value
					)}
				/>
			</Column>
		</Section>
	));
};
