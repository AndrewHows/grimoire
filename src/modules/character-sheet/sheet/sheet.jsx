import { Character } from './context';

import { Column } from './components/layout';
import { useMediaQuery } from '@mantine/hooks';
import { DefaultLayout } from '@/modules/character-sheet/sheet/layouts/default';

export function Sheet({ id, character }) {
	const isPrint = useMediaQuery('print');

	return (
		<Character.Provider
			value={{
				id,
				character: {
					...character,
					features: character.features.filter(({ hide }) => !hide),
					powers: [
						{
							name: 'Action Point',
							usage: 'Encounter',
							action: 'free action',
							text: [
								{ name: 'Effect', text: 'Take an extra standard action' },
								...character.features.filter(
									({ group }) => group === 'action-point'
								),
							],
						},
						...character.powers.filter(({ hide }) => !hide),
					],
				},
			}}
		>
			<div
				style={{
					backgroundColor: '#f2f0e9',
					fontSize: '12px',
					padding: '2rem',
					...(isPrint
						? {
								padding: 0,
								backgroundColor: 'white',
						  }
						: null),
				}}
			>
				<Column style={{ alignItems: 'center', gap: isPrint ? 0 : '2rem' }}>
					<DefaultLayout />
				</Column>
			</div>
		</Character.Provider>
	);
}
