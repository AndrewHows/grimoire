import { useContext } from 'react';
import { Section } from '../components/section';
import { Character } from '../context';
import { Text } from '@mantine/core';

export const Languages = (props) => {
	const { character } = useContext(Character);

	return (
		<Section label="Languages" {...props}>
			<Text fz="xs" style={{ marginTop: '0.5rem' }}>
				{character.languages.join(', ')}
			</Text>
		</Section>
	);
};
