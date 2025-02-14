import { useMessages } from '@/hooks/messages';
import { CoreFields } from '@/modules/profile/components/fields';
import { Button, Group, Stack, Switch, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { useCallback, useEffect, useState } from 'react';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { PROFILE_COLLECTION } from '@/constants';
import { firebase } from '@/lib/firebase';

const firestore = getFirestore(firebase);

export const UserForm = ({ userId, saving, deleting, onSave, onDelete }) => {
	const messages = useMessages();
	const [email, setEmail] = useState('');

	const form = useForm({
		mode: 'uncontrolled',
	});

	useEffect(() => {
		(async () => {
			const snap = await getDoc(doc(firestore, PROFILE_COLLECTION, userId));
			const data = snap.data();
			form.setValues({ userId, admin: Boolean(data.secure?.admin), ...data });
			setEmail(data.email);
		})();
	}, [userId]);

	const onConfirm = useCallback(() => {
		modals.openConfirmModal({
			title: messages.confirmDeletion(messages.user()),
			children: (
				<Text size="sm">{messages.confirmDeletionBody(messages.user())}</Text>
			),
			labels: { confirm: 'Confirm', cancel: 'Cancel' },
			onConfirm: () => onDelete(userId),
		});
	});

	return (
		<form style={{ display: 'flex' }} onSubmit={form.onSubmit(onSave)}>
			<Stack style={{ justifySelf: 'center', flexGrow: 1 }}>
				<CoreFields email={email} form={form} />
				<Switch
					label="Admin"
					key={form.key('admin')}
					{...form.getInputProps('admin', { type: 'checkbox' })}
				/>
				<Group style={{ justifyContent: 'space-between' }}>
					{onDelete && (
						<Button loading={deleting} bg="red" onClick={onConfirm}>
							{messages.delete()}
						</Button>
					)}
					<Button loading={saving} type="submit">
						{messages.update()}
					</Button>
				</Group>
			</Stack>
		</form>
	);
};
