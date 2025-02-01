import { sections } from '@/modules/character-sheet/components/sheet/sections';
import { CharacterEditorContext } from '@/modules/character-sheet/pages/edit/components/character-editor/context';
import { removeRecursive, searchRecursive } from '@/utils';
import { Checkbox, Group, Text, useMantineTheme } from '@mantine/core';
import { useContext } from 'react';

export const LayoutEditor = ({ layout }) => {
	const { onChange } = useContext(CharacterEditorContext);
	const theme = useMantineTheme();

	return Object.keys(sections)
		.filter((s) => !['Powers', 'Traits'].includes(s))
		.map((s) => {
			const column = searchRecursive(layout, s);
			return (
				<Group
					key={s}
					py={12}
					style={{ borderBottom: `1px solid ${theme.colors.gray[2]}` }}
				>
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
			);
		});
};
