import { useContext } from 'react';
import { Character } from '../context';
import { Section } from '../components/section';
import { Checkboxes } from '../components/checkboxes';
import { KeyValues } from '../components/key-values';

export const Saves = () => {
	const { character } = useContext(Character);
	return (
		<Section label="Saves">
			<Checkboxes
				qty={character.death_saves ?? 3}
				style={{ margin: '0.5rem 0' }}
			/>
			<KeyValues
				values={character.features.filter(({ group }) => group === 'saves')}
			/>
		</Section>
	);
};
