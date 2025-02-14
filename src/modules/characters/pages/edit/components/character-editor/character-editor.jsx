import { Accordion } from '@mantine/core';
import { ElementAccordion } from '@/modules/characters/pages/edit/components/character-editor/components/element-accordion';
import { FeatureEditor } from '@/modules/characters/pages/edit/components/character-editor/components/feature-editor';
import { PowerEditor } from '@/modules/characters/pages/edit/components/character-editor/components/power-editor';
import { CharacterEditorContext } from '@/modules/characters/pages/edit/components/character-editor/context';
import { LayoutEditor } from '@/modules/characters/pages/edit/components/character-editor/components/layout-editor';

export const CharacterEditor = ({ data, onChange, onChangeBatch }) => {
	if (
		Object.keys(data).filter((p) => !['powers', 'features'].includes(p))
			.length === 0
	)
		return;

	return (
		<CharacterEditorContext.Provider
			value={{ character: data, onChange, onChangeBatch }}
		>
			<Accordion transitionDuration={0}>
				<Accordion.Item value="layout">
					<Accordion.Control>Layout</Accordion.Control>
					<Accordion.Panel>
						<LayoutEditor character={data} />
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
