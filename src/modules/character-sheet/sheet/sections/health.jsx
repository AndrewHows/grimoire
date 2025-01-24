import { useContext } from 'react';
import { Checkboxes } from '../components/checkboxes';
import { KeyValues } from '../components/key-values';
import { Column, Row } from '../components/layout';
import { Section } from '../components/section';
import { TextField } from '../components/text-field';
import { Character } from '../context';
import { useMantineTheme } from '@mantine/core';

export const Health = () => {
	const { character } = useContext(Character);
	const theme = useMantineTheme();

	return (
		<Section label="Health">
			<Row style={{ justifyContent: 'center' }}>
				<TextField label="Max HP" value={character.hp_max} />
				<TextField label="Bloodied" value={character.bloodied} />
				<TextField label="Surge" value={character.surge_value} />
			</Row>
			<div
				style={{
					border: '1px solid black',
					marginTop: '0.5rem',
					height: '60px',
					display: 'flex',
					textAlign: 'center',
					fontSize: '10px',
					color: theme.colors.gray[5],
				}}
			>
				<div
					style={{
						borderRight: '1px solid black',
						height: '60px',
						flex: 1,
						padding: '0.25rem',
					}}
				>
					Temp HP
				</div>
				<div style={{ flex: 1, padding: '0.25rem' }}>Current HP</div>
			</div>
			<Column>
				<Checkboxes qty={character.surges} style={{ marginTop: '0.5rem' }} />
				<KeyValues
					values={character.features.filter(({ group }) => group === 'health')}
				/>
			</Column>
		</Section>
	);
};
