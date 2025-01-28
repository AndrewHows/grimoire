import { Character } from './context';

import { Column, Row } from './components/layout';
import { useMediaQuery } from '@mantine/hooks';
import { Page } from '@/modules/character-sheet/components/sheet/components/page';
import * as sections from './sections';

export function Sheet({ id, character }) {
	const isPrint = useMediaQuery('print');

	const renderLayoutComponent = ({ page, columns, column, section }, idx) => {
		if (page)
			return (
				<Page key={`page-${idx}`}>
					<Column>{page.map(renderLayoutComponent)}</Column>
				</Page>
			);
		if (columns)
			return (
				<Row key={`row-${idx}`} style={{ gap: '2rem' }}>
					{columns.map(renderLayoutComponent)}
				</Row>
			);
		if (column)
			return (
				<Column key={`column-${idx}`}>
					{column.map((section, sectionIdx) => {
						const Section = sections[section];
						return Section ? (
							<Section key={`${section}-${sectionIdx}`} />
						) : null;
					})}
				</Column>
			);
		if (section) {
			const Section = sections[section];
			return Section ? <Section key={`${section}-${idx}`} /> : null;
		}
	};

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
					{character.layout?.map?.(renderLayoutComponent)}
				</Column>
			</div>
		</Character.Provider>
	);
}
