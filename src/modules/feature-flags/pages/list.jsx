import { FEATURE_FLAG_COLLECTION } from '@/constants';
import { useMessages } from '@/hooks/messages';
import { firebase } from '@/lib/firebase';
import { FeatureFlagForm } from '../components/form';
import { Button, Group, Stack, useMantineTheme } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
	deleteDoc,
	doc,
	getFirestore,
	setDoc,
	updateDoc,
} from 'firebase/firestore';
import { useCallback, useMemo, useState } from 'react';
import { InfoBox } from '@/components/info-box';
import { useFeatures } from '@/modules/feature-flags/hooks/feature';
import { DataList } from '@/components/data-list';
import { Modal } from '@/components/modal';

const firestore = getFirestore(firebase);

export const FeatureFlagsPage = () => {
	const featureFlags = useFeatures();
	const messages = useMessages();
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [creating, setCreating] = useState(false);
	const theme = useMantineTheme();

	const onCreate = useCallback(
		async ({ key, ...data }) => {
			setSaving(true);
			try {
				const flagDoc = doc(firestore, FEATURE_FLAG_COLLECTION, key);
				await setDoc(flagDoc, data);
				setSaving(false);
				notifications.show({
					title: messages.createSucceeded(messages.featureFlag()),
				});
				setCreating(false);
			} catch (e) {
				setSaving(false);
				notifications.show({
					title: messages.createFailed(messages.featureFlag()),
					message: e.message,
					color: 'red',
				});
			}
		},
		[messages]
	);

	const onUpdate = useCallback(
		async ({ key, ...data }, close) => {
			setSaving(true);
			try {
				const flagDoc = doc(firestore, FEATURE_FLAG_COLLECTION, key);
				await updateDoc(flagDoc, data);
				setSaving(false);
				notifications.show({
					title: messages.updateSucceeded(messages.featureFlag()),
				});
				close();
			} catch (e) {
				setSaving(false);
				notifications.show({
					title: messages.updateFailed(messages.featureFlag()),
					message: e.message,
					color: 'red',
				});
			}
		},
		[messages]
	);

	const onDelete = useCallback(
		async (key, close) => {
			try {
				const flagDoc = doc(firestore, FEATURE_FLAG_COLLECTION, key);
				await deleteDoc(flagDoc);
				setDeleting(false);
				notifications.show({
					title: messages.deleteSucceeded(messages.featureFlag()),
				});
				close();
			} catch (e) {
				setDeleting(false);
				notifications.show({
					title: messages.deleteFailed(messages.featureFlag()),
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
				accessor: 'id',
				title: messages.key(),
			},
			{
				accessor: 'description',
				title: messages.description(),
			},
			{
				accessor: 'audience',
				title: messages.audience(),
			},
		],
		[messages]
	);

	const flagList = useCallback(
		(results) => {
			return results.map((snap) => {
				const data = snap.data();
				return {
					id: snap.id,
					...data,
					audience: messages[data.audience](),
					expired: data.audience === 'everybody',
				};
			});
		},
		[messages]
	);

	const expired = flagList(featureFlags).filter(
		({ expired }) => expired
	).length;

	return (
		<Stack>
			{expired > 0 && (
				<InfoBox variant="alert" centered>
					{messages.expiredFeatures(expired)}
				</InfoBox>
			)}
			<Group style={{ justifyContent: 'end' }}>
				<Button onClick={() => setCreating(true)}>Create</Button>
			</Group>
			<DataList
				label={messages.featureFlag()}
				collection={FEATURE_FLAG_COLLECTION}
				columns={columns}
				transformResults={flagList}
				getUpdateModalContent={({ item, close }) => (
					<FeatureFlagForm
						flag={item}
						onSave={(data) => onUpdate(data, close)}
						onDelete={(id) => onDelete(id, close)}
						deleting={deleting}
						saving={saving}
					/>
				)}
				rowStyle={({ expired }) =>
					expired
						? {
								backgroundColor: theme.colors.red[5],
								color: theme.colors.gray[0],
						  }
						: undefined
				}
			/>
			<Modal
				opened={creating}
				onClose={() => setCreating(false)}
				title={messages.new(messages.featureFlag())}
				centered
			>
				<FeatureFlagForm onSave={onCreate} saving={saving} />
			</Modal>
		</Stack>
	);
};
