import { Character } from './context';

import { Column, Row } from './components/layout';
import { useMediaQuery } from '@mantine/hooks';
import { Page } from '@/modules/character-sheet/components/sheet/components/page';
import * as sections from './sections';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

export function Sheet({ id, character, onChange }) {
	const isPrint = useMediaQuery('print');

	const onDragEnd = (result) => {
		const { source, destination } = result;
		const layout = [...character.layout];
		const srcIndex = parseInt(source.droppableId.split('-')[1]);
		const destIndex = parseInt(destination.droppableId.split('-')[1]);
		const [section] = layout[0].page[1].columns[srcIndex].column.splice(
			source.index,
			1
		);
		layout[0].page[1].columns[destIndex].column.splice(
			destination.index,
			0,
			section
		);
		onChange?.([], 'layout', layout);
	};

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
				<Droppable
					droppableId={`column-${idx}`}
					key={`column-${idx}`}
					renderClone={(provided, snapshot, rubric) => {
						console.log(sections, rubric.draggableId);
						const Section = sections[rubric.draggableId];
						return (
							<div
								{...provided.draggableProps}
								{...provided.dragHandleProps}
								ref={provided.innerRef}
							>
								<Section />
							</div>
						);
					}}
				>
					{(provided) => (
						<Column ref={provided.innerRef} {...provided.droppableProps}>
							{column.map((section, sectionIdx) => {
								const Section = sections[section];
								return Section ? (
									<Section
										key={`${section}-${sectionIdx}`}
										draggableId={section}
										index={sectionIdx}
									/>
								) : null;
							})}
						</Column>
					)}
				</Droppable>
			);
		if (section) {
			const Section = sections[section];
			return Section ? <Section index={idx} /> : null;
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
				<Column
					style={{
						alignItems: 'center',
						gap: isPrint ? 0 : '2rem',
					}}
				>
					<DragDropContext
						onDragEnd={onDragEnd}
						enableDefaultSensors={Boolean(onChange)}
					>
						{character.layout?.map?.(renderLayoutComponent)}
					</DragDropContext>
				</Column>
			</div>
		</Character.Provider>
	);
}
