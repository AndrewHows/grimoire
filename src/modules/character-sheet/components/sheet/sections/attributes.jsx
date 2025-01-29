import { useContext } from 'react';
import { Character } from '../context';
import { Section } from '../components/section';
import { Column } from '../components/layout';
import { Attribute } from '../components/attribute';

export const Attributes = (props) => {
	const { character } = useContext(Character);
	return (
		<Section label="Attributes" {...props}>
			<Column style={{ gap: 0 }}>
				{Object.entries(character.attributes ?? {}).map(([name, val]) => (
					<Attribute key={name} name={name} value={val} />
				))}
			</Column>
		</Section>
	);
};
