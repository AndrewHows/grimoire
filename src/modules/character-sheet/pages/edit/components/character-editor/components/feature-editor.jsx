import { CharacterEditorContext } from '@/modules/character-sheet/pages/edit/components/character-editor/context';
import { featureGroups, getProp } from '@/modules/character-sheet/utils';
import { Select, Stack, TextInput } from '@mantine/core';
import { useContext } from 'react';

export const FeatureEditor = ({ feature }) => {
	const { onChange } = useContext(CharacterEditorContext);

	return (
		<Stack>
			<Select
				size="xs"
				label="Section"
				value={feature.group}
				data={featureGroups}
				onChange={(val) => {
					onChange(feature.path, 'group', val);
				}}
			/>
			<TextInput
				size="xs"
				label="Text"
				value={getProp(feature, 'text') ?? ''}
				onChange={(e) =>
					onChange(feature.path, 'text-override', e.target.value)
				}
			/>
		</Stack>
	);
};
