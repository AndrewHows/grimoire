import { CharacterEditorContext } from '@/modules/characters/pages/edit/components/character-editor/context';
import { featureGroups, getProp } from '@/modules/characters/utils';
import { Select, Stack, TextInput } from '@mantine/core';
import { useContext } from 'react';

export const FeatureEditor = ({ feature }) => {
	const { character, onChange } = useContext(CharacterEditorContext);

	return (
		<Stack>
			<Select
				size="xs"
				label="Section"
				value={feature.group}
				data={[
					...featureGroups,
					...(character?.sections ?? []).map((s) => ({ label: s, value: s })),
				].sort((a, b) => a.label.localeCompare(b.label))}
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
