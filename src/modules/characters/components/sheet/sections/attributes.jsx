import { useContext } from 'react';
import { Character } from '../context';
import { Section } from '../components/section';
import { Column } from '../components/layout';
import { Attribute } from '../components/attribute';

export const attributeOrder = [
	'Strength',
	'Constitution',
	'Dexterity',
	'Intelligence',
	'Wisdom',
	'Charisma',
];

export const Attributes = (props) => {
	const { character } = useContext(Character);

	return (
		<Section label="Attributes" {...props}>
			<Column style={{ gap: 0 }}>
				{Object.entries(character.attributes ?? {})
					.sort(
						([a], [b]) => attributeOrder.indexOf(a) - attributeOrder.indexOf(b)
					)
					.map(([name, val]) => (
						<Attribute key={name} name={name} value={val} />
					))}
			</Column>
		</Section>
	);
};
