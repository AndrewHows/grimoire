import { useContext } from 'react';
import { KeyValues } from '../components/key-values';
import { Column, Row } from '../components/layout';
import { Section } from '../components/section';
import { TextField } from '../components/text-field';
import { Character } from '../context';

export const Senses = () => {
	const { character } = useContext(Character);

	return (
		<Section label="Passive Senses">
			<Column>
				<Row style={{ justifyContent: 'center' }}>
					<TextField
						value={(character.skills?.Insight ?? 0) + 10}
						label="Insight"
					/>
					<TextField
						value={(character.skills?.Perception ?? 0) + 10}
						label="Perception"
					/>
				</Row>
				<KeyValues
					values={character.features.filter(({ group }) => group === 'senses')}
				/>
			</Column>
		</Section>
	);
};
