import { useLoaderData, useNavigate } from 'react-router-dom';
import { useParties } from '@/modules/characters/hooks/characters';
import {
	Button,
	Group,
	Stack,
	Text,
	TextInput,
	useMantineTheme,
} from '@mantine/core';
import { Portrait } from '@/modules/characters/components/sheet/sections/portrait';
import { User2Icon, XIcon } from 'lucide-react';
import { useFeature } from '@/modules/feature-flags/hooks/feature';
import { useContext, useEffect, useState } from 'react';
import { createDoc, updateDoc } from '@/lib/firebase';
import { Auth } from '@/contexts';
import { notifications } from '@mantine/notifications';

export const EditParty = () => {
	const { user } = useContext(Auth);
	const theme = useMantineTheme();
	const showParties = useFeature('parties');
	const [url, setUrl] = useState('');
	const navigate = useNavigate();
	const loader = useLoaderData();
	const parties = useParties();
	const party = parties.get(loader?.id) ?? null;
	const [name, setName] = useState();

	useEffect(() => {
		setName(party?.data().name ?? '');
	}, [party]);

	if (!showParties) return;

	const onSave = async () => {
		if (!loader?.id) {
			const party = await createDoc(['user-data', user.uid, 'parties'], {
				name,
				characters: [],
			});
			navigate(party.id);
			return;
		}
		updateDoc(['user-data', user.uid, 'parties', loader.id], {
			name,
		});
	};

	const onAdd = async () => {
		const [validate, userId, characterId] = url.split('/').slice(-3);
		if (validate !== 'sheet') {
			notifications.show({
				title: 'Adding character failed',
				message: 'Use the character sheet link',
				color: 'red',
			});
			return;
		}
		if (party.data().characters.some((c) => c.characterId === characterId)) {
			notifications.show({
				title: 'Adding character failed',
				message: 'Character already in the party',
				color: 'red',
			});
			return;
		}
		updateDoc(['user-data', user.uid, 'parties', loader.id], {
			characters: [...(party.data().characters ?? []), { userId, characterId }],
		});
		setUrl('');
		notifications.show({ title: 'Added character to party', color: 'green' });
	};

	const onDelete = (cRef) => {
		updateDoc(['user-data', user.uid, 'parties', loader.id], {
			characters: party
				.data()
				.characters.filter((c) => c.characterId !== cRef.characterId),
		});
		notifications.show({
			title: 'Removed character from party',
			color: 'green',
		});
	};

	const getByRef = (ref) => {
		return party.characters.find((c) => c.id === ref.characterId);
	};

	return (
		<Stack style={{ width: '100%' }}>
			<Group justify="space-between">
				<Group align="end">
					<TextInput
						size="xs"
						value={name}
						onChange={(e) => setName(e.target.value)}
						label="Party Name"
					/>
					<Button size="xs" onClick={onSave}>
						Save
					</Button>
				</Group>
				<Group align="end">
					<TextInput
						size="xs"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						label="Character Sheet URL"
						disabled={!loader?.id}
					/>
					<Button size="xs" onClick={onAdd} disabled={!loader?.id}>
						Add
					</Button>
				</Group>
			</Group>
			<Group align="top">
				{party
					?.data()
					.characters?.filter((c) => getByRef(c))
					.sort((aRef, bRef) => {
						const a = getByRef(aRef);
						const b = getByRef(bRef);
						const nameDiff = a.data().name.localeCompare(b.data().name);
						if (nameDiff !== 0) return nameDiff;
						return a.data().level - b.data().level;
					})
					.map((cRef) => {
						const c = getByRef(cRef);
						return (
							<div key={c.characterId} style={{ position: 'relative' }}>
								<Button
									style={{ position: 'absolute', zIndex: 1 }}
									size="xs"
									p="3"
									onClick={(e) => {
										onDelete(cRef);
										e.stopPropagation();
										return false;
									}}
								>
									<XIcon />
								</Button>
								<Button
									variant="subtle"
									style={{ height: 'fit-content' }}
									onClick={() =>
										window.open(`/sheet/${cRef.userId}/${cRef.characterId}`)
									}
								>
									<Stack gap={0}>
										{c.data().portrait ? (
											<Portrait character={c.data()} />
										) : (
											<User2Icon
												size={230}
												color={theme.colors.gray[6]}
												style={{ display: 'block' }}
											/>
										)}
										<Text align="center" c="black">
											{c.data().name}
										</Text>
										<Text align="center" c="gray.5" fz="xs">
											(Level {c.data().level})
										</Text>
									</Stack>
								</Button>
							</div>
						);
					})}
			</Group>
		</Stack>
	);
};
