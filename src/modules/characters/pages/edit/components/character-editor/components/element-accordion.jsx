import { CharacterEditorContext } from '@/modules/characters/pages/edit/components/character-editor/context';
import { Accordion, Checkbox, Group, Stack } from '@mantine/core';
import { useContext, useState } from 'react';

export const ElementAccordion = ({ elements, panel }) => {
	const { onChange } = useContext(CharacterEditorContext);
	const [selection, setSelection] = useState(null);

	return (
		<Accordion value={selection} onChange={(s) => setSelection(s)}>
			{elements.map((element, idx) => {
				const key = `${element.name}-${idx}`;
				return (
					<Accordion.Item key={key} value={key}>
						<Accordion.Control>
							<Group fz="xs">
								<Checkbox
									size="xs"
									checked={!element.hide}
									onChange={() => {
										onChange(element.path, 'hide', !element.hide);
									}}
									onClick={(e) => {
										e.stopPropagation();
									}}
								/>
								{element.name}
							</Group>
						</Accordion.Control>
						{selection === key && (
							<Accordion.Panel bg="gray.2">
								<Stack>{panel(element)}</Stack>
							</Accordion.Panel>
						)}
					</Accordion.Item>
				);
			})}
		</Accordion>
	);
};
