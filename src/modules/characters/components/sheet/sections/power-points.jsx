import { useContext } from 'react';
import { Character } from '../context';
import { Section } from '../components/section';
import { Checkboxes } from '../components/checkboxes';

export const PowerPoints = (props) => {
	const { character } = useContext(Character);
	if (!character.power_points)
		return <Section label="Power Points" {...props} />;

	return (
		<Section label="Power Points" {...props}>
			<Checkboxes
				qty={character.power_points}
				style={{ marginTop: '0.5rem' }}
			/>
		</Section>
	);
};
