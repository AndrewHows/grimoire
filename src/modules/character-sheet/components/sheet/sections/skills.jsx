import { useContext } from 'react';
import { Character } from '../context';
import { Skill } from '../components/skill';
import { Section } from '../components/section';
import { KeyValues } from '@/modules/character-sheet/components/sheet/components/key-values';
import { Column } from '@/modules/character-sheet/components/sheet/components/layout';

export const Skills = (props) => {
	const { character } = useContext(Character);

	return (
		<Section label="Skills" {...props}>
			<Column>
				<div>
					{Object.entries(character.skills ?? {})
						.sort(([a], [b]) => a.localeCompare(b))
						.map(([skill, value]) => (
							<Skill
								key={skill}
								name={skill}
								value={value}
								trained={character.skills_trained.includes(skill)}
							/>
						))}
				</div>
				<KeyValues
					values={character.features.filter(({ group }) => group === 'skills')}
				/>
			</Column>
		</Section>
	);
};
