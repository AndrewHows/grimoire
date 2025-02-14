import { Select } from '@/components/select';
import { Checkbox, Group, NumberInput } from '@mantine/core';

export const GridSettings = ({ encounter, setEncounter }) => {
	return (
		<Group align="end">
			<Group align="end" style={{ flexWrap: 'nowrap' }}>
				<Select
					size="xs"
					label="Colour"
					value={encounter.gridColour ?? ''}
					onChange={(e) => setEncounter({ ...encounter, gridColour: e })}
					style={{ flex: 1 }}
					data={[
						{ value: 'black', label: 'Black' },
						{ value: 'white', label: 'White' },
					]}
				/>
				<NumberInput
					size="xs"
					label="Cell Size"
					value={encounter.gridCellSize ?? 0}
					onChange={(e) => {
						setEncounter({ ...encounter, gridCellSize: e });
					}}
					style={{ maxWidth: '6rem' }}
				/>
				<Checkbox
					size="xs"
					checked={encounter.showGrid ?? true}
					onChange={(e) => {
						setEncounter({
							...encounter,
							showGrid: e.target.checked,
						});
					}}
					style={{ marginBottom: '0.6rem' }}
					label="Show Grid"
				/>
			</Group>
			<Group>
				<NumberInput
					size="xs"
					label="Width"
					value={encounter.gridSize?.width ?? 0}
					style={{ flex: 1 }}
					onChange={(e) => {
						setEncounter({
							...encounter,
							gridSize: { ...encounter.gridSize, width: e },
						});
					}}
				/>
				<NumberInput
					size="xs"
					label="Height"
					value={encounter.gridSize?.height ?? 0}
					style={{ flex: 1 }}
					onChange={(e) => {
						setEncounter({
							...encounter,
							gridSize: { ...encounter.gridSize, height: e },
						});
					}}
				/>
			</Group>
			<Group>
				<NumberInput
					size="xs"
					label="Offset X"
					value={encounter.gridOffset?.x ?? 0}
					style={{ flex: 1 }}
					onChange={(e) => {
						setEncounter({
							...encounter,
							gridOffset: {
								...encounter.gridOffset,
								x: e,
							},
						});
					}}
				/>
				<NumberInput
					size="xs"
					label="Offset Y"
					value={encounter.gridOffset?.y ?? 0}
					style={{ flex: 1 }}
					onChange={(e) => {
						setEncounter({
							...encounter,
							gridOffset: {
								...encounter.gridOffset,
								y: e,
							},
						});
					}}
				/>
			</Group>
		</Group>
	);
};
