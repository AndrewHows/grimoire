import { PROFILE_COLLECTION } from '@/constants';
import { Auth } from '@/contexts';
import { useMessages } from '@/hooks/messages';
import { firebase } from '@/lib/firebase';
import { CoreFields } from '@/modules/profile/components/fields';
import { Button, Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { useCallback, useContext, useState } from 'react';

const firestore = getFirestore(firebase);

export const Profile = () => {
	const { user } = useContext(Auth);
	const [saving, setSaving] = useState(false);
	const messages = useMessages();

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: user?.profile,
		validate: {
			givenName: (value) =>
				!Boolean(value) ? messages.fieldRequired('Given name') : null,
			industry: (value) =>
				!Boolean(value) ? messages.fieldRequired('Industry') : null,
		},
	});

	const onUpdate = useCallback(
		async ({ email, ...data }) => {
			setSaving(true);
			try {
				const userDoc = doc(firestore, PROFILE_COLLECTION, user.uid);
				await updateDoc(userDoc, data);
				setSaving(false);
				notifications.show({ title: messages.profileUpdateSucceeded() });
			} catch (e) {
				setSaving(false);
				notifications.show({
					title: messages.profileUpdateFailed(),
					message: e.message,
					color: 'red',
				});
			}
		},
		[messages]
	);

	return (
		<form onSubmit={form.onSubmit(onUpdate)}>
			<Stack maw="30rem" style={{ justifySelf: 'center' }}>
				<CoreFields email={user.email} form={form} />
				<Group style={{ justifyContent: 'end' }}>
					<Button loading={saving} type="submit">
						{messages.update()}
					</Button>
				</Group>
			</Stack>
		</form>
	);
};
