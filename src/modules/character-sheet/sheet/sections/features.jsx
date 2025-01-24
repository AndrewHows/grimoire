import { useContext } from 'react';
import { Character } from '../context';
import { Section } from '../components/section';
import { Column } from '../components/layout';
import { KeyValues } from '../components/key-values';

export const Features = () => {
	const { character } = useContext(Character);

	return (
		<Section label="Features">
			<Column style={{ gap: '0.5rem' }}>
				<KeyValues values={character.features.filter(({ group }) => !group)} />
			</Column>
		</Section>
	);
};
