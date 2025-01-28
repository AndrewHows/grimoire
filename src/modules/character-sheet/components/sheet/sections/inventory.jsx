import { useContext } from 'react';
import { Character } from '../context';
import { Skill } from '../components/skill';
import { Section } from '../components/section';
import { KeyValues } from '@/modules/character-sheet/components/sheet/components/key-values';
import {
	Column,
	Row,
} from '@/modules/character-sheet/components/sheet/components/layout';
import { getProp } from '@/modules/character-sheet/utils';
import { useMantineTheme } from '@mantine/core';

export const Inventory = () => {
	const { character } = useContext(Character);
	const theme = useMantineTheme();

	const slots = [
		'Weapon',
		'Off-hand',
		'Head',
		'Neck',
		'Armor',
		'Arms',
		'Hands',
		'Ring',
		'Ring',
		'Waist',
		'Feet',
	];

	const miscItems = character.items.filter(
		({ slot }) => slots.indexOf(slot) < 0
	);

	return (
		<Section label="Inventory">
			<Column style={{ marginTop: '0.5rem' }}>
				<Column style={{ gap: '0.25rem' }}>
					{slots.map((slot) =>
						character.items
							.filter((i) => slot === getProp(i, 'slot'))
							.map((item, idx) => (
								<Row
									key={`${slot}-${idx}`}
									style={{ justifyContent: 'space-between' }}
								>
									<span>{getProp(item, 'name')}</span>
									<span style={{ color: theme.colors.gray[5] }}>{slot}</span>
								</Row>
							))
					)}
				</Column>

				{miscItems.length > 0 && (
					<div>
						<strong>Other:</strong>{' '}
						{miscItems.map(({ name }) => name).join(', ')}
					</div>
				)}
			</Column>
		</Section>
	);
};
