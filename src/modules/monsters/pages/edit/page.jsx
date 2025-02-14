import {
	alignments,
	defenceRatings,
	languages as allLanguages,
	MONSTER_COLLECTION,
	monsterRoles,
	monsterTypes,
	monsterVariants,
	nads,
	origins,
	sizes,
	skills as allSkills,
} from '@/constants';
import { useDelete, useSave, useUserDocument } from '@/hooks/firestore';
import { useMessages } from '@/hooks/messages';
import { attributeOrder } from '@/modules/characters/components/sheet/sections/attributes';
import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { StatBlock } from '@/modules/monsters/component/statblock';
import { UploadImage } from '@/components/upload-image';
import { EditMonsterPower } from '@/modules/monsters/pages/edit/components/monster-power';
import { setValue } from '@/modules/monsters/pages/edit/utils';
import {
	CalculatedField,
	Field,
} from '@/modules/monsters/pages/edit/components/field';
import { schema } from '@/modules/monsters/pages/edit/schema';

export const EditMonster = () => {
	const state = {};
	for (const [key, def] of schema) {
		const [value, set] = useState(def);
		state[key] = { value, set };
	}

	const messages = useMessages();
	const loader = useLoaderData();
	const SaveButton = useSave({
		collection: MONSTER_COLLECTION,
		message: messages.monster(),
		id: loader?.id,
	});
	const DeleteButton = useDelete({
		collection: MONSTER_COLLECTION,
		message: messages.monster(),
		id: loader?.id,
		to: '/app/monsters',
	});
	const document = useUserDocument(MONSTER_COLLECTION, loader?.id);

	useEffect(() => {
		if (document) {
			for (const [key, { set }] of Object.entries(state)) {
				set(document.data()[key]);
			}
		}
	}, [document]);

	const monster = Object.fromEntries(
		Object.entries(state).map(([key, { value }]) => [key, value])
	);

	return (
		<Group align="top">
			<Stack style={{ maxWidth: '40rem' }}>
				<Group>
					<UploadImage
						filename={`monsters/${state.name.value}`}
						onUpload={(url) => state.token.set(url)}
					>
						Set Token
					</UploadImage>
					<SaveButton
						data={Object.fromEntries(
							Object.entries(state).map(([key, { value }]) => [key, value])
						)}
					/>
					<DeleteButton />
				</Group>
				<Stack
					style={{ overflow: 'auto', maxHeight: 'calc(100vh - 8rem)' }}
					pr="1rem"
				>
					<Group>
						<Field {...state.name} type="text" name="Name" />
						<Field
							{...state.saves}
							type="number"
							name="Saving Throw Bonus"
							style={{ flex: 'default', width: '7rem' }}
							min={0}
						/>
						<Field
							{...state.actionPoints}
							type="number"
							name="Action Points"
							style={{ flex: 'default', width: '5rem' }}
							min={0}
						/>
					</Group>
					<Group>
						<Group>
							<Field {...state.level} type="number" name="Level" min={1} />
							<Field
								{...state.size}
								type="select"
								name="Size"
								options={sizes}
								style={{ width: '10rem' }}
							/>
						</Group>
						<Field
							{...state.variant}
							type="select"
							name="Variant"
							options={monsterVariants}
						/>
						<Field
							{...state.role}
							type="select"
							name="Role"
							options={monsterRoles}
						/>
					</Group>
					<Group>
						<Field
							{...state.origin}
							type="select"
							name="Origin"
							options={origins}
						/>
						<Field
							{...state.type}
							type="select"
							name="Type"
							options={monsterTypes}
						/>
						<Field {...state.keywords} type="text" name="Keywords" />
					</Group>
					<Group>
						{nads.map((def) => (
							<Field
								key={def}
								{...state[def.toLowerCase()]}
								type="select"
								name={def}
								options={defenceRatings}
							/>
						))}
					</Group>
					<Group>
						<Field {...state.speed} type="text" name="Speed" initial={6} />
						<Field {...state.senses} type="text" name="Senses" />
						<Field {...state.aura} type="text" name="Aura" />
					</Group>
					<Group>
						<Field {...state.immune} type="text" name="Immune" />
						<Field {...state.resist} type="text" name="Resist" />
						<Field {...state.vulnerable} type="text" name="Vulnerable" />
					</Group>
					<Group>
						<CalculatedField field="hp" state={state} type="number" name="HP" />
						<CalculatedField
							field="bloodied"
							state={state}
							type="number"
							name="Bloodied"
						/>
						<CalculatedField field="ac" state={state} type="number" name="AC" />
						<CalculatedField
							field="fort"
							state={state}
							type="number"
							name="Fortitude"
						/>
						<CalculatedField
							field="will"
							state={state}
							type="number"
							name="Will"
						/>
						<CalculatedField
							field="ref"
							state={state}
							type="number"
							name="Reflex"
						/>
					</Group>
					<Group style={{ flexWrap: 'nowrap' }}>
						{attributeOrder.map((attr) => (
							<Field
								key={attr}
								{...state[attr.toLowerCase()]}
								type="number"
								name={attr}
								initial={12}
								min={0}
							/>
						))}
					</Group>
					<Group>
						<Field
							{...state.skills}
							type="multiselect"
							name="Skills"
							options={allSkills}
						/>
						<Field
							{...state.languages}
							type="multiselect"
							name="Languages"
							options={allLanguages}
						/>
						<Field
							{...state.alignment}
							type="select"
							name="Alignment"
							options={alignments}
						/>
					</Group>
					<Group justify="space-between">
						<Title order={2}>Powers</Title>
						<Button
							size="xs"
							onClick={() => state.powers.set([...state.powers.value, {}])}
						>
							Add
						</Button>
					</Group>
					<Stack pl="10" gap="20">
						{state.powers.value.map((power, idx) => (
							<EditMonsterPower
								key={idx}
								monster={monster}
								power={power}
								onDelete={() =>
									setValue(
										state.powers,
										state.powers.value.filter((_, i) => i !== idx)
									)
								}
								onUpdate={(key, e) => setValue(state.powers, e, [idx, key])}
							/>
						))}
					</Stack>
				</Stack>
			</Stack>
			<Stack>
				<StatBlock monster={monster} />
			</Stack>
		</Group>
	);
};
