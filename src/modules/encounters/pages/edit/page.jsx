import { UploadImage } from '@/components/upload-image';
import { ENCOUNTER_COLLECTION } from '@/constants';
import { Auth } from '@/contexts';
import { useConfirmDelete } from '@/hooks/crud';
import { useDelete, useSave } from '@/hooks/firestore';
import { useMessages } from '@/hooks/messages';
import { useEncounters } from '@/modules/encounters/hooks';
import { GridSettings } from '@/modules/encounters/pages/edit/components/grid-settings';
import { Map } from '@/modules/encounters/pages/edit/components/map';
import { MonsterEntry } from '@/modules/encounters/pages/edit/components/monster-entry';
import { NoteToken } from '@/modules/encounters/pages/edit/components/note-token';
import { mm3 } from '@/modules/monsters/pages/edit/utils';
import {
	Accordion,
	Button,
	Group,
	Modal,
	NumberInput,
	Stack,
	Text,
	Textarea,
	TextInput,
} from '@mantine/core';
import { CircleXIcon, SquareIcon, TriangleIcon, XIcon } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useLoaderData } from 'react-router-dom';

export const tokenTypes = ['monsters', 'notes'];

export const terrainTypes = {
	impassable: (_props) => {
		const { key, ...props } = _props ?? {};
		return (
			<XIcon
				key={key}
				color="white"
				strokeWidth="1"
				absoluteStrokeWidth
				{...(props ?? {})}
			/>
		);
	},
	difficult: (_props) => {
		const { key, ...props } = _props ?? {};
		return (
			<TriangleIcon
				key={key}
				color="black"
				fill="white"
				strokeWidth="1"
				absoluteStrokeWidth
				{...(props ?? {})}
			/>
		);
	},
	hazard: (_props) => {
		const { key, ...props } = _props ?? {};
		return (
			<SquareIcon
				key={key}
				color="black"
				strokeWidth="1"
				absoluteStrokeWidth
				fill="white"
				{...(props ?? {})}
			/>
		);
	},
};

export const EditEncounter = () => {
	const messages = useMessages();
	const loader = useLoaderData();
	const [addingMonster, setAddingMonster] = useState(false);
	const document = useEncounters().get(loader?.id);
	const [encounter, setEncounter] = useState({
		gridCellSize: 32,
		gridSize: { width: 50, height: 50 },
	});
	const [mode, setMode] = useState('removed');
	const SaveButton = useSave({
		collection: ENCOUNTER_COLLECTION,
		message: messages.encounter(),
		id: loader?.id,
	});
	const DeleteButton = useDelete({
		collection: ENCOUNTER_COLLECTION,
		message: messages.encounter(),
		id: loader?.id,
	});
	const { user } = useContext(Auth);

	useEffect(() => {
		if (document) {
			setEncounter(document.data());
		}
	}, [document]);

	const [url, setUrl] = useState('');
	const [segment, setSegment] = useState();
	const confirmDelete = useConfirmDelete();

	const monsterStats =
		encounter.monsters?.map(
			(e) => document.monsters.find((m) => m.id === e.monsterId)?.data() ?? {}
		) ?? [];

	const enemyHealth = monsterStats
		.map(({ hp }) => hp ?? 0)
		.reduce((acc, val) => acc + val, 0);

	const estimatedDpr = ((encounter.level ?? 1) + 5) * 4;

	const expectedDuration = Math.ceil(enemyHealth / estimatedDpr);

	const enemyDpr = monsterStats
		.map((m) => mm3.damage(m) * 0.75)
		.reduce((acc, val) => acc + val, 0);

	const estimatedHealth = 12 + (encounter.level ?? 1) * 6 * 4;

	const estimatedDamage = new Array(expectedDuration)
		.fill()
		.map((_, idx) => ((expectedDuration - idx) / expectedDuration) * enemyDpr)
		.reduce((acc, val) => acc + val, 0);

	const partyDamageTaken = Math.floor(
		(estimatedDamage / estimatedHealth) * 100
	);

	return (
		<>
			<Modal
				opened={addingMonster}
				onClose={() => setAddingMonster(false)}
				withCloseButton
				size="lg"
				radius="md"
			>
				<TextInput value={url} onChange={(e) => setUrl(e.target.value)} />
				<Button
					onClick={() => {
						setEncounter({
							...encounter,
							monsters: [
								...(encounter?.monsters ?? []),
								{ userId: user.uid, monsterId: url },
							],
						});
						setSegment('monsters');
					}}
				>
					Add
				</Button>
			</Modal>
			<DndProvider backend={HTML5Backend}>
				<Stack style={{ flex: 1 }}>
					<Group align="end">
						<Stack gap="0" bg="gray.2" p="sm">
							<Text style={{ textAlign: 'center' }} fz="xs">
								Terrain Tools
							</Text>
							<Group>
								{Object.entries(terrainTypes).map(([terrain, icon]) => (
									<Button
										key={terrain}
										onClick={() => setMode(terrain)}
										bg={mode === terrain ? 'olive-green.5' : 'brownish-red.6'}
										px="6"
									>
										{icon()}
									</Button>
								))}
							</Group>
						</Stack>
						<Group pb="sm">
							<UploadImage
								maxSize={1800}
								onUpload={(url) => {
									setEncounter({ ...encounter, map: url });
								}}
							>
								Upload Map
							</UploadImage>
							<Button onClick={() => setAddingMonster(true)}>
								Add Monster
							</Button>
							<Button
								onClick={() => {
									setEncounter({
										...encounter,
										notes: [...(encounter?.notes ?? []), { text: '' }],
									});
									setSegment('notes');
								}}
							>
								Add Note
							</Button>
							<SaveButton data={encounter} />
							<DeleteButton />
						</Group>
					</Group>
					<Group>
						<Stack
							style={{
								flex: 1,
								overflow: 'auto',
								height: '100%',
								maxHeight: 'calc(100vh - 11rem)',
							}}
						>
							<Group>
								<TextInput
									label="Name"
									value={encounter.name ?? ''}
									size="xs"
									style={{ flex: 1 }}
									onChange={(e) =>
										setEncounter({ ...encounter, name: e.target.value })
									}
								/>
								<NumberInput
									label="Level"
									value={encounter.level ?? 1}
									size="xs"
									style={{ maxWidth: '4rem' }}
									onChange={(e) => setEncounter({ ...encounter, level: e })}
								/>
							</Group>
							Total Enemy Health: {enemyHealth} Estimated Duration:{' '}
							{expectedDuration} rounds Damage Taken: {partyDamageTaken}% of
							total party HP
							<Accordion value={segment} onChange={setSegment}>
								<Accordion.Item value="grid">
									<Accordion.Control p={0}>
										<Text size="xs">Grid Settings</Text>
									</Accordion.Control>
									<Accordion.Panel>
										<GridSettings
											encounter={encounter}
											setEncounter={setEncounter}
										/>
									</Accordion.Panel>
								</Accordion.Item>
								<Accordion.Item value="monsters">
									<Accordion.Control p={0}>
										<Text fz="xs">Monsters</Text>
									</Accordion.Control>
									<Accordion.Panel p={0} styles={{ content: { padding: 0 } }}>
										<Stack gap="1">
											{encounter?.monsters?.map((m, idx) => {
												const count = encounter?.monsters.filter(
													(m2, idx2) =>
														m2.userId === m.userId &&
														m2.monsterId === m.monsterId &&
														idx2 < idx
												).length;
												const monster = document?.monsters.find(
													(m2) => m2.id === m.monsterId
												);
												if (monster) {
													return (
														<Group
															key={`${monster.id}-${idx}`}
															justify="space-between"
														>
															<MonsterEntry
																index={idx}
																monster={monster}
																entry={m}
																count={count}
															/>
															<Button
																variant="subtle"
																px={6}
																onClick={() =>
																	confirmDelete({
																		message: messages.monster(),
																		onDelete: () =>
																			setEncounter({
																				...encounter,
																				monsters: encounter.monsters.filter(
																					(_, monsterIdx) => monsterIdx !== idx
																				),
																			}),
																	})
																}
															>
																<CircleXIcon />
															</Button>
														</Group>
													);
												}
											})}
										</Stack>
									</Accordion.Panel>
								</Accordion.Item>
								<Accordion.Item value="notes">
									<Accordion.Control p={0}>
										<Text fz="xs">Notes</Text>
									</Accordion.Control>
									<Accordion.Panel styles={{ content: { padding: 0 } }}>
										<Stack>
											{encounter.notes?.map(({ text }, idx) => (
												<Group key={idx}>
													<NoteToken index={idx} />
													<Textarea
														autosize
														maxRows={10}
														value={text}
														style={{ flex: 1 }}
														onChange={(e) =>
															setEncounter({
																...encounter,
																notes: encounter.notes.map((o, i) =>
																	i === idx ? { ...o, text: e.target.value } : o
																),
															})
														}
													/>
													<Button
														variant="subtle"
														px={6}
														onClick={() =>
															confirmDelete({
																message: messages.notes(),
																onDelete: () =>
																	setEncounter({
																		...encounter,
																		notes: encounter.notes.filter(
																			(_, noteIdx) => noteIdx !== idx
																		),
																	}),
															})
														}
													>
														<CircleXIcon />
													</Button>
												</Group>
											))}
										</Stack>
									</Accordion.Panel>
								</Accordion.Item>
							</Accordion>
						</Stack>
						<Stack
							style={{ overflow: 'auto', maxHeight: 'calc(100vh - 11rem)' }}
						>
							{encounter.map && (
								<Map
									encounter={encounter}
									setEncounter={setEncounter}
									document={document}
									mode={mode}
								/>
							)}
						</Stack>
					</Group>
				</Stack>
			</DndProvider>
		</>
	);
};
