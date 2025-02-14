import { useMessages } from '@/hooks/messages';
import { firebase } from '@/lib/firebase';
import { notifications } from '@mantine/notifications';
import { deleteDoc, doc, getFirestore, updateDoc } from 'firebase/firestore';
import { useCallback, useMemo, useState } from 'react';
import { PROFILE_COLLECTION } from '@/constants';
import { CheckIcon, XIcon } from 'lucide-react';
import { UserForm } from '@/modules/users/components/form';
import { DataList } from '@/components/data-list';
import { useMantineTheme } from '@mantine/core';

const firestore = getFirestore(firebase);

export const UsersPage = () => {
	const messages = useMessages();
	const theme = useMantineTheme();
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const onUpdate = useCallback(
		async ({ userId, admin, ...userData }, close) => {
			setSaving(true);
			try {
				const userDoc = doc(firestore, PROFILE_COLLECTION, userId);
				await updateDoc(userDoc, { ...userData, secure: { admin } });
				setSaving(false);
				notifications.show({
					title: messages.updateSucceeded(messages.user()),
				});
				close();
			} catch (e) {
				setSaving(false);
				notifications.show({
					title: messages.updateFailed(messages.user()),
					message: e.message,
					color: 'red',
				});
			}
		},
		[messages]
	);

	const onDelete = useCallback(
		async (userId, close) => {
			try {
				const userDoc = doc(firestore, PROFILE_COLLECTION, userId);
				await deleteDoc(userDoc);
				setDeleting(false);
				notifications.show({
					title: messages.deleteSucceeded(messages.user()),
				});
				close();
			} catch (e) {
				setDeleting(false);
				notifications.show({
					title: messages.deleteFailed(messages.user()),
					message: e.message,
					color: 'red',
				});
			}
		},
		[messages]
	);

	const columns = useMemo(
		() => [
			{
				accessor: 'email',
				title: messages.email(),
				sortable: true,
			},
			{
				accessor: 'givenName',
				title: messages.givenName(),
				sortable: true,
			},
			{
				accessor: 'surname',
				title: messages.surname(),
				sortable: true,
			},
			{
				accessor: 'admin',
				title: messages.admin(),
				sortable: true,
				render: ({ admin }) =>
					admin ? (
						<CheckIcon color={theme.colors.green[8]} />
					) : (
						<XIcon color={theme.colors.red[8]} />
					),
				width: '0%',
				titleStyle: { textAlign: 'center' },
				cellsStyle: () => ({ textAlign: 'center' }),
			},
		],
		[messages]
	);

	const userList = useCallback((results) => {
		return results.map((snap) => {
			const { secure, ...userData } = snap.data();
			return {
				id: snap.id,
				...userData,
				admin: Boolean(secure?.admin),
			};
		});
	});

	return (
		<DataList
			label={messages.users()}
			titleField="email"
			collection={PROFILE_COLLECTION}
			columns={columns}
			transformResults={userList}
			getUpdateModalContent={({ item, close }) => (
				<UserForm
					userId={item}
					onSave={(data) => onUpdate(data, close)}
					onDelete={(id) => onDelete(id, close)}
					deleting={deleting}
					saving={saving}
				/>
			)}
		/>
	);
};
