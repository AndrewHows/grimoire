import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getFirestore,
	setDoc,
} from 'firebase/firestore';

import { Button, Group, Text } from '@mantine/core';
import { UploadPortrait } from './upload-portrait';
import { firebase } from '@/lib/firebase';
import { useContext, useMemo, useState } from 'react';
import { useMessages } from '@/hooks/messages';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { ImportDND4E } from '@/modules/character-sheet/pages/edit/components/import-dnd4e';
import { notifications } from '@mantine/notifications';
import { CHARACTER_COLLECTION } from '@/constants';
import { Auth } from '@/contexts';
import { modals } from '@mantine/modals';

const firestore = getFirestore(firebase);

export const Controls = ({
	character,
	onCharacterChange,
	onCharacterPropChange,
	mode,
	onModeChange,
}) => {
	const { user } = useContext(Auth);
	const messages = useMessages();
	const loader = useLoaderData();
	const navigate = useNavigate();
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const onSave = async () => {
		setSaving(true);
		try {
			if (loader?.id) {
				await setDoc(
					doc(
						firestore,
						'user-data',
						user.uid,
						CHARACTER_COLLECTION,
						loader.id
					),
					character
				);
				setSaving(false);
				notifications.show({
					title: messages.updateSucceeded(messages.character()),
				});
			} else {
				const newDoc = await addDoc(
					collection(firestore, 'user-data', user.uid, CHARACTER_COLLECTION),
					character
				);

				setSaving(false);
				notifications.show({
					title: messages.createSucceeded(messages.character()),
				});
				navigate(`./${newDoc.id}`);
			}
		} catch (e) {
			setSaving(false);
			notifications.show({
				title: messages.createFailed(messages.character()),
				message: e.message,
				color: 'red',
			});
		}
	};

	const onDelete = useMemo(
		() => async (characterId) => {
			try {
				const characterDoc = doc(
					firestore,
					'user-data',
					user.uid,
					CHARACTER_COLLECTION,
					characterId
				);
				await deleteDoc(characterDoc);
				setDeleting(false);
				notifications.show({
					title: messages.deleteSucceeded(messages.character()),
				});
				navigate('/app');
			} catch (e) {
				setDeleting(false);
				notifications.show({
					title: messages.deleteFailed(messages.character()),
					message: e.message,
					color: 'red',
				});
			}
		},
		[messages]
	);

	return (
		<Group justify="center">
			<ImportDND4E
				existingData={character}
				onImport={(data) => onCharacterChange(data)}
			/>
			<Button onClick={() => onModeChange(mode === 'code' ? 'ui' : 'code')}>
				{mode === 'ui' ? 'Edit Code' : 'Edit Sheet'}
			</Button>
			{Object.keys(character).length > 0 && (
				<UploadPortrait
					filename={character.name}
					onUpload={(url) => onCharacterPropChange([], 'portrait', url)}
				/>
			)}
			<Button
				onClick={onSave}
				disabled={Object.keys(character).length === 0 || saving}
			>
				{saving ? 'Saving...' : 'Save'}
			</Button>
			<Button
				disabled={!loader?.id}
				onClick={() => window.open(`/sheet/${user.uid}/${loader.id}`)}
			>
				View
			</Button>
			<Button
				disabled={!loader?.id || deleting}
				onClick={() => {
					modals.openConfirmModal({
						title: messages.confirmDeletion(messages.character()),
						children: (
							<Text size="sm">
								{messages.confirmDeletionBody(messages.character())}
							</Text>
						),
						labels: { confirm: 'Confirm', cancel: 'Cancel' },
						onConfirm: () => onDelete(loader?.id),
					});
				}}
			>
				{deleting ? 'Deleting...' : 'Delete'}
			</Button>
		</Group>
	);
};
