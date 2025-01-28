import { useContext } from 'react';
import { Character } from '../context';
import { Skill } from '../components/skill';
import { Section } from '../components/section';

export const Skills = () => {
	const { character } = useContext(Character);

	return (
		<Section label="Skills">
			{Object.entries(character.skills ?? {}).map(([skill, value]) => (
				<Skill
					key={skill}
					name={skill}
					value={value}
					trained={character.skills_trained.includes(skill)}
				/>
			))}
		</Section>
	);
};
