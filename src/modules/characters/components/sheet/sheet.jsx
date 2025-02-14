import { Character } from './context';

import { Column, Row } from './components/layout';
import { useMediaQuery } from '@mantine/hooks';
import { Page } from '@/modules/characters/components/sheet/components/page';
import { sections } from './sections';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Section } from '@/modules/characters/components/sheet/components/section';
import { KeyValues } from '@/modules/characters/components/sheet/components/key-values';
import { defaultLayout } from '@/modules/characters/character';

export function Sheet({ id, character, onChange, editable }) {
	const isPrint = useMediaQuery('print');
	let colIdx = 0;

	const onDragEnd = (result) => {
		const { source, destination } = result;
		const layout = [...(character.layout ?? defaultLayout)];
		const srcPage = Math.floor(parseInt(source.droppableId.split('-')[1]) / 3);
		const srcIndex = parseInt(source.droppableId.split('-')[1]) % 3;
		const destPage = Math.floor(
			parseInt(destination.droppableId.split('-')[1]) / 3
		);
		const destIndex = parseInt(destination.droppableId.split('-')[1]) % 3;
		const [section] = layout[srcPage].page
			.find((o) => o.columns)
			.columns[srcIndex].column.splice(source.index, 1);
		layout[destPage].page
			.find((o) => o.columns)
			.columns[destIndex].column.splice(destination.index, 0, section);
		onChange?.([], 'layout', layout);
	};

	const renderSection = (section, sectionIdx) => {
		const SectionComponent = sections[section];
		if (!SectionComponent)
			return (
				<Section
					label={section}
					key={`${section}-${sectionIdx}`}
					draggableId={section}
					index={sectionIdx}
				>
					<KeyValues
						values={character.features.filter((f) => f.group === section)}
					/>
				</Section>
			);
		return (
			<SectionComponent
				key={`${section}-${sectionIdx}`}
				draggableId={section}
				index={sectionIdx}
			/>
		);
	};

	const renderLayoutComponent = ({ page, columns, column, section }, idx) => {
		if (page)
			return (
				<Page key={`page-${idx}`}>
					<Column style={{ height: '100%' }}>
						{page.map(renderLayoutComponent)}
					</Column>
				</Page>
			);
		if (columns)
			return (
				<Row key={`row-${idx}`} style={{ gap: '2rem' }}>
					{columns.map(renderLayoutComponent)}
				</Row>
			);
		if (column) {
			colIdx++;
			return (
				<Droppable
					droppableId={`column-${colIdx - 1}`}
					key={`column-${idx}`}
					renderClone={(provided, snapshot, rubric) => {
						return (
							<div
								{...provided.draggableProps}
								ref={provided.innerRef}
								style={{
									borderRadius: '5px',
									backgroundColor: 'white',
									...provided.draggableProps.style,
								}}
							>
								{renderSection(rubric.draggableId)}
							</div>
						);
					}}
				>
					{(provided) => (
						<Column ref={provided.innerRef} {...provided.droppableProps}>
							{column.map((section, sectionIdx) =>
								renderSection(section, sectionIdx)
							)}
							{provided.placeholder}
						</Column>
					)}
				</Droppable>
			);
		}
		if (section) {
			return renderSection(section);
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
							level: 0,
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
				<Column
					style={{
						alignItems: 'center',
						gap: isPrint ? 0 : '2rem',
					}}
				>
					<DragDropContext
						onDragEnd={onDragEnd}
						enableDefaultSensors={editable}
					>
						{(character.layout ?? defaultLayout)?.map?.(renderLayoutComponent)}
					</DragDropContext>
				</Column>
			</div>
		</Character.Provider>
	);
}
