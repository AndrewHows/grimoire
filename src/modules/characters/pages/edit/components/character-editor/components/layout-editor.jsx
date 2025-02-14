import { sections } from '@/modules/characters/components/sheet/sections';
import { CharacterEditorContext } from '@/modules/characters/pages/edit/components/character-editor/context';
import { removeRecursive, searchRecursive } from '@/utils';
import {
	Button,
	Checkbox,
	Group,
	NumberInput,
	Stack,
	Text,
	TextInput,
	useMantineTheme,
} from '@mantine/core';
import { Trash2Icon } from 'lucide-react';
import { useContext, useState } from 'react';

export const LayoutEditor = ({ character }) => {
	const { onChange, onChangeBatch } = useContext(CharacterEditorContext);
	const [newSection, setNewSection] = useState('');
	const theme = useMantineTheme();
	const layout = character.layout;
	const pages = layout.filter((e) => e.page).length;

	return (
		<Stack gap="2">
			<Group align="end">
				<NumberInput
					label="Pages"
					size="xs"
					style={{ maxWidth: '4rem' }}
					min={1}
					value={layout.filter((e) => e.page).length}
					onChange={(val) => {
						if (val === pages) return;
						if (val < pages) {
							onChange([], 'layout', [
								...layout.slice(0, val),
								...layout.slice(-1),
							]);
						} else {
							onChange([], 'layout', [
								...layout.slice(0, -1),
								{
									page: [
										{
											columns: [{ column: [] }, { column: [] }, { column: [] }],
										},
									],
								},
								...layout.slice(-1),
							]);
						}
					}}
				/>
				<TextInput
					size="xs"
					value={newSection}
					label="Custom Section"
					onChange={(e) => setNewSection(e.target.value)}
				/>
				<Button
					size="xs"
					onClick={() => {
						onChangeBatch([
							[[], 'sections', [...(character.sections ?? []), newSection]],
							[
								['layout', 0, 'page', 1, 'columns', 0],
								'column',
								[newSection, ...layout[0].page[1].columns[0].column],
							],
						]);
						setNewSection('');
					}}
				>
					Add
				</Button>
			</Group>
			{[...Object.keys(sections), ...(character.sections ?? [])]
				.filter((s) => !['Powers', 'Traits'].includes(s))
				.map((s) => {
					const column = searchRecursive(layout, s);
					return (
						<Group
							key={s}
							justify="space-between"
							align="center"
							pb="2"
							style={{
								borderBottom: `1px solid ${theme.colors.gray[2]}`,
								minHeight: '33px',
							}}
						>
							<Group>
								<Checkbox
									size="xs"
									checked={column.length > 0}
									onChange={() => {
										if (column.length > 0) {
											removeRecursive(layout, s);
										} else {
											layout[0].page[1].columns[0].column.unshift(s);
										}
										onChange([], 'layout', layout);
									}}
								/>
								<Text fz="xs">{s}</Text>
							</Group>
							{character.sections?.includes(s) && (
								<Button
									size="xs"
									variant="subtle"
									onClick={() => {
										removeRecursive(layout, s);
										onChangeBatch([
											[
												[],
												'sections',
												character.sections.filter(
													(deleteSection) => deleteSection !== s
												),
											],
											[[], 'layout', layout],
											...character.features
												.filter((f) => f.group === s)
												.map((f) => [f.path, 'group', '']),
										]);
									}}
								>
									<Trash2Icon size="18" />
								</Button>
							)}
						</Group>
					);
				})}
		</Stack>
	);
};
