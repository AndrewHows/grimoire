import { useContext } from 'react';
import { Character } from '../context';
import { Section } from '../components/section';
import { TextField } from '../components/text-field';
import { KeyValues } from '../components/key-values';
import { Column } from '@/modules/characters/components/sheet/components/layout';

export const Defences = (props) => {
	const { character } = useContext(Character);

	return (
		<Section label="Defences" {...props}>
			<Column style={{ gap: '0.5rem' }}>
				<div style={{ display: 'flex', gap: '0.5rem' }}>
					{Object.entries(character.defences ?? {}).map(([name, val]) => (
						<TextField
							key={name}
							value={val}
							label={name}
							style={{ flex: 1 }}
						/>
					))}
				</div>
				{Object.keys(character.resistances ?? {}).length > 0 ? (
					<KeyValues
						values={[
							{
								name: 'Resist',
								text: Object.entries(character.resistances ?? {})
									.map((e) => e.join(' '))
									.join(', '),
							},
						]}
					/>
				) : null}
				<KeyValues
					values={character.features.filter(
						({ group }) => group === 'defences'
					)}
				/>
			</Column>
		</Section>
	);
};
