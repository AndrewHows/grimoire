import { Firestore, Auth } from '@/contexts';
import { firebase, KeyedArray } from '@/lib/firebase';
import { useContext, useEffect, useState } from 'react';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getFirestore,
	setDoc,
	where,
} from 'firebase/firestore';
import { useMessages } from '@/hooks/messages';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { Button, Text } from '@mantine/core';
import { modals } from '@mantine/modals';

const firestore = getFirestore(firebase);

export const useUserDocuments = (col, key) => {
	const { registerQuery, data } = useContext(Firestore);
	const { user } = useContext(Auth);

	useEffect(() => {
		if (user?.uid) {
			registerQuery(key ?? col, [
				collection(firestore, 'user-data', user.uid, col),
			]);
		}
	}, [user?.uid]);

	return data[key ?? col] ?? new KeyedArray();
};

export const useUserDocument = (col, id) => {
	const { user } = useContext(Auth);
	const [documents, setDocuments] = useState([]);
	const key = `selected-${col}`;

	const { registerQuery, data } = useContext(Firestore);

	useEffect(() => {
		if (!id || !user.uid) return;
		registerQuery(key, [
			collection(firestore, 'user-data', user.uid, col),
			where('__name__', 'in', documents),
		]);
	}, [id, user.uid]);

	if (!id) return null;

	if (!documents.includes(id)) setDocuments([...documents, id]);

	return (data[key] ?? new KeyedArray()).get(id);
};

export const useSave = ({ collection: col, message, id }) => {
	const [saving, setSaving] = useState(false);

	const firestore = getFirestore(firebase);
	const messages = useMessages();
	const { user } = useContext(Auth);
	const navigate = useNavigate();

	const onSave = async (data) => {
		setSaving(true);
		try {
			if (id) {
				await setDoc(doc(firestore, 'user-data', user.uid, col, id), data);
				setSaving(false);
				notifications.show({
					title: messages.updateSucceeded(message),
					color: 'green',
				});
			} else {
				const newDoc = await addDoc(
					collection(firestore, 'user-data', user.uid, col),
					data
				);

				setSaving(false);
				notifications.show({
					title: messages.createSucceeded(message),
					color: 'green',
				});
				navigate(`./${newDoc.id}`);
			}
		} catch (e) {
			setSaving(false);
			notifications.show({
				title: messages.createFailed(message),
				message: e.message,
				color: 'red',
			});
		}
	};

	return ({ data, ...props }) => (
		<Button onClick={() => onSave(data)} disabled={saving} {...props}>
			{saving ? 'Saving...' : 'Save'}
		</Button>
	);
};

export const useDelete = ({ collection: col, id, message, to }) => {
	const [deleting, setDeleting] = useState(false);
	const { user } = useContext(Auth);
	const messages = useMessages();
	const navigate = useNavigate();

	const onDelete = async () => {
		try {
			const d = doc(firestore, 'user-data', user.uid, col, id);
			await deleteDoc(d);
			setDeleting(false);
			notifications.show({
				title: messages.deleteSucceeded(message),
			});
			navigate(to ?? '/app');
		} catch (e) {
			setDeleting(false);
			notifications.show({
				title: messages.deleteFailed(message),
				message: e.message,
				color: 'red',
			});
		}
	};

	return () => (
		<Button
			disabled={!id || deleting}
			onClick={() => {
				modals.openConfirmModal({
					title: messages.confirmDeletion(message),
					children: (
						<Text size="sm">{messages.confirmDeletionBody(message)}</Text>
					),
					labels: { confirm: 'Confirm', cancel: 'Cancel' },
					onConfirm: onDelete,
				});
			}}
		>
			{deleting ? 'Deleting...' : 'Delete'}
		</Button>
	);
};
