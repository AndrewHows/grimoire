import { NoteToken } from '@/modules/encounters/pages/edit/components/note-token';
import { terrainTypes, tokenTypes } from '@/modules/encounters/pages/edit/page';
import { Token } from '@/modules/monsters/component/token';
import { alpha, useMantineTheme } from '@mantine/core';
import { useDrop } from 'react-dnd';

export const Map = ({ document, encounter, setEncounter, mode }) => {
	return (
		<div
			style={{
				position: 'relative',
			}}
		>
			<img src={encounter.map} style={{ maxWidth: '1200px' }} />
			<div
				style={{
					position: 'absolute',
					display: 'grid',
					gridTemplateColumns: `repeat(${encounter.gridSize.width}, ${encounter.gridCellSize}px)`,
					top: encounter.gridOffset?.y ?? 0,
					left: encounter.gridOffset?.x ?? 0,
				}}
			>
				{new Array(encounter.gridSize.width * encounter.gridSize.height)
					.fill()
					.map((_, idx) => {
						const x = idx % encounter.gridSize.width;
						const y = Math.floor(idx / encounter.gridSize.width);
						return (
							<Square
								key={idx}
								document={document}
								encounter={encounter}
								x={x}
								y={y}
								onDrop={({ index, type }) => {
									setEncounter({
										...encounter,
										[type]: encounter[type]?.map((m, mIdx) =>
											mIdx === index
												? {
														...m,
														position: { x, y },
												  }
												: m
										),
									});
								}}
								onClick={() => {
									if (
										encounter[mode]?.some(
											({ x: x2, y: y2 }) => x === x2 && y === y2
										)
									) {
										setEncounter({
											...encounter,
											[mode]: encounter[mode].filter(
												({ x: x2, y: y2 }) => x !== x2 || y !== y2
											),
										});
									} else {
										setEncounter({
											...encounter,
											[mode]: [...(encounter?.[mode] ?? []), { x, y }],
										});
									}
								}}
							/>
						);
					})}
			</div>
		</div>
	);
};

const Square = ({ document, encounter, x, y, onDrop, onClick }) => {
	const theme = useMantineTheme();
	const [entry, entryIdx] =
		encounter?.monsters
			?.map((entry, idx) => [entry, idx])
			.find(([m]) => m?.position?.x === x && m?.position?.y === y) ?? [];

	const [note, noteIdx] =
		encounter?.notes
			?.map((note, idx) => [note, idx])
			.find(([m]) => m?.position?.x === x && m?.position?.y === y) ?? [];

	const monster =
		entry && document.monsters?.find((m) => m.id === entry.monsterId);

	const count =
		entryIdx &&
		encounter?.monsters.filter(
			(m2, idx2) =>
				m2.userId === entry.userId &&
				m2.monsterId === entry.monsterId &&
				idx2 < entryIdx
		).length;

	const [{ isOver, canDrop }, drop] = useDrop(
		() => ({
			accept: tokenTypes,
			drop: (item, target) => {
				onDrop?.(item, target, [x, y]);
			},
			collect: (monitor) => ({
				isOver: !!monitor.isOver(),
				canDrop: !!monitor.canDrop(),
			}),
		}),
		[encounter, entryIdx]
	);

	const terrain = Object.keys(terrainTypes).filter((terrain) =>
		encounter[terrain]?.some(({ x: x2, y: y2 }) => x2 === x && y2 === y)
	);

	return (
		<>
			<div
				ref={drop}
				style={{
					borderColor: encounter.showGrid
						? encounter.gridColour
						: 'transparent',
					borderStyle: 'solid',
					borderWidth: terrain.includes('impassable') ? 0 : 1,
					width: encounter.gridCellSize,
					height: encounter.gridCellSize,
					marginLeft: -x,
					marginTop: -1,
					backgroundColor:
						isOver && canDrop
							? alpha(theme.colors.green[7], 0.5)
							: 'transparent',
					caretColor: 'transparent',
					position: 'relative',
				}}
				onClick={onClick}
			>
				{terrain.map((t) =>
					terrainTypes[t]({
						key: t,
						size: 12,
						style: {
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							zIndex: 2,
						},
					})
				)}
			</div>
			{monster && (
				<Token
					monster={monster.data()}
					size={encounter.gridCellSize}
					count={count}
					index={entryIdx}
					style={{
						position: 'absolute',
						top: y * encounter.gridCellSize - y,
						left: x * encounter.gridCellSize - x,
						zIndex: 1,
					}}
					draggable
					scaleToBaseSize
				/>
			)}
			{note && (
				<NoteToken
					index={noteIdx}
					style={{
						position: 'absolute',
						top:
							y * encounter.gridCellSize -
							y +
							(encounter.gridCellSize - 40) / 2,
						left:
							x * encounter.gridCellSize -
							x +
							(encounter.gridCellSize - 40) / 2,
						zIndex: 1,
					}}
				/>
			)}
		</>
	);
};
