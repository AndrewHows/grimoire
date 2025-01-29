import { useContext } from 'react';
import { Character } from '../context';
import { Section } from '../components/section';
import { Checkboxes } from '../components/checkboxes';
import { KeyValues } from '../components/key-values';
import { useMantineTheme } from '@mantine/core';
import { Column } from '@/modules/character-sheet/components/sheet/components/layout';

export const Saves = (props) => {
	const { character } = useContext(Character);
	const theme = useMantineTheme();

	return (
		<Section label="Saving Throws" {...props}>
			<Column style={{ gap: '0.25rem' }}>
				<Checkboxes
					qty={character.death_saves ?? 3}
					style={{ marginTop: '0.5rem' }}
				/>
				<label
					style={{
						textAlign: 'center',
						fontSize: '12px',
						color: theme.colors.gray[5],
					}}
				>
					Death Saves
				</label>
				<KeyValues
					values={character.features.filter(({ group }) => group === 'saves')}
				/>
			</Column>
		</Section>
	);
};
