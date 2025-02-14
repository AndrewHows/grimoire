import { useContext } from 'react';
import { Character } from '../context';
import { Section } from '../components/section';
import { Column, Row } from '../components/layout';
import { TextField } from '../components/text-field';
import { KeyValues } from '../components/key-values';

export const Movement = (props) => {
	const { character } = useContext(Character);

	return (
		<Section label="Movement" {...props}>
			<Column>
				<Row style={{ justifyContent: 'center' }}>
					<TextField
						value={`${character.initiative >= 0 ? '+' : ''}${
							character.initiative
						}`}
						label="Initiative"
					/>
					<TextField value={character.movement} label="Speed" />
				</Row>
				<KeyValues
					values={character.features.filter(
						({ group }) => group === 'movement'
					)}
				/>
			</Column>
		</Section>
	);
};
