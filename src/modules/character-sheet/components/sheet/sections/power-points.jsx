import { useContext } from 'react';
import { Character } from '../context';
import { Section } from '../components/section';
import { Checkboxes } from '../components/checkboxes';

export const PowerPoints = () => {
	const { character } = useContext(Character);
	return character.power_points ? (
		<Section label="Power Points">
			<Checkboxes
				qty={character.power_points}
				style={{ marginTop: '0.5rem' }}
			/>
		</Section>
	) : null;
};
