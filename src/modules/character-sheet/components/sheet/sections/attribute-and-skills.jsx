import { useContext } from 'react';
import { Character } from '../context';
import { Skill } from '../components/skill';
import { Section } from '../components/section';
import { KeyValues } from '@/modules/character-sheet/components/sheet/components/key-values';
import {
	Column,
	Row,
} from '@/modules/character-sheet/components/sheet/components/layout';
import { attributeOrder } from '@/modules/character-sheet/components/sheet/sections/attributes';
import { useMantineTheme } from '@mantine/core';
import { getAttributeMod } from '@/modules/character-sheet/utils';
import { Table } from '@/modules/character-sheet/components/sheet/components/table';
import global from '@/global.module.css';

const skillAttributeMapping = {
	Strength: ['Athletics'],
	Constitution: ['Endurance'],
	Dexterity: ['Acrobatics', 'Stealth', 'Thievery'],
	Intelligence: ['Arcana', 'History', 'Religion'],
	Wisdom: ['Dungeoneering', 'Heal', 'Insight', 'Nature', 'Perception'],
	Charisma: ['Bluff', 'Diplomacy', 'Intimidate', 'Streetwise'],
};

export const AttributeAndSkills = (props) => {
	const { character } = useContext(Character);
	const theme = useMantineTheme();

	return (
		<Section label="Attributes and Skills" {...props}>
			<Column style={{ gap: 0 }}>
				{Object.entries(character.attributes ?? {})
					.sort(
						([a], [b]) => attributeOrder.indexOf(a) - attributeOrder.indexOf(b)
					)
					.map(([name, val]) => {
						const mod = getAttributeMod(val);
						return (
							<Column key={name} style={{ gap: 0, marginTop: '0.25rem' }}>
								<Table
									key={name}
									name={
										<Row
											style={{
												alignItems: 'center',
												padding: '0.25rem 0',
											}}
										>
											<div
												className={global.caveat}
												style={{
													fontSize: '16px',
													textAlign: 'center',
													border: '1px solid black',
													borderRadius: '50%',
													height: '30px',
													width: '30px',
													position: 'absolute',
													backgroundColor: 'white',
													paddingRight: '3px',
												}}
											>
												{val}
											</div>
											<div style={{ marginLeft: 'calc(25px + 0.75rem)' }}>
												{name}
											</div>
										</Row>
									}
									values={[mod < 0 ? mod : `+${mod}`]}
									style={{
										paddingRight: '0.5rem',
										backgroundColor: theme.colors.gray[1],
									}}
								/>
								<Column
									style={{
										marginLeft: '1rem',
										padding: '0.25rem 0.5rem',
									}}
								>
									<div>
										{Object.entries(character.skills ?? {})
											.filter(([skill]) =>
												skillAttributeMapping[name].includes(skill)
											)
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
										values={character.features.filter(
											({ group }) => group === 'skills'
										)}
									/>
								</Column>
							</Column>
						);
					})}
			</Column>
		</Section>
	);
};
