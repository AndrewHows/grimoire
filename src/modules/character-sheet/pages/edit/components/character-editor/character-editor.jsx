import { Accordion } from '@mantine/core';
import { ElementAccordion } from '@/modules/character-sheet/pages/edit/components/character-editor/components/element-accordion';
import { FeatureEditor } from '@/modules/character-sheet/pages/edit/components/character-editor/components/feature-editor';
import { PowerEditor } from '@/modules/character-sheet/pages/edit/components/character-editor/components/power-editor';
import { CharacterEditorContext } from '@/modules/character-sheet/pages/edit/components/character-editor/context';
import { LayoutEditor } from '@/modules/character-sheet/pages/edit/components/character-editor/components/layout-editor';

export const CharacterEditor = ({ data, onChange }) => {
	if (
		Object.keys(data).filter((p) => !['powers', 'features'].includes(p))
			.length === 0
	)
		return;

	return (
		<CharacterEditorContext.Provider value={{ onChange }}>
			<Accordion transitionDuration={0}>
				<Accordion.Item value="layout">
					<Accordion.Control>Layout</Accordion.Control>
					<Accordion.Panel>
						<LayoutEditor layout={data.layout} />
					</Accordion.Panel>
				</Accordion.Item>
				<Accordion.Item value="features">
					<Accordion.Control>Features</Accordion.Control>
					<Accordion.Panel>
						<ElementAccordion
							elements={data.features}
							panel={(feature) => <FeatureEditor feature={feature} />}
						/>
					</Accordion.Panel>
				</Accordion.Item>
				<Accordion.Item value="powers">
					<Accordion.Control>Powers</Accordion.Control>
					<Accordion.Panel>
						<ElementAccordion
							elements={data.powers}
							panel={(power) => <PowerEditor power={power} />}
						/>
					</Accordion.Panel>
				</Accordion.Item>
			</Accordion>
		</CharacterEditorContext.Provider>
	);
};
