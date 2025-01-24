import { AUDIENCES } from '@/constants';
import { Firestore } from '@/contexts';
import { useMessages } from '@/hooks/messages';
import { useFeatures } from '@/modules/feature-flags/hooks/feature';
import {
	Button,
	Group,
	Select,
	Stack,
	Text,
	Textarea,
	TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { useCallback } from 'react';

export const FeatureFlagForm = ({
	flag,
	saving,
	deleting,
	onSave,
	onDelete,
}) => {
	const messages = useMessages();
	const featureFlags = useFeatures();

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: { key: flag, ...featureFlags.get(flag)?.data() },
		validate: {
			key: (value) => (!Boolean(value) ? messages.fieldRequired('key') : null),
			audience: (value) =>
				!Boolean(value) ? messages.fieldRequired('Audience') : null,
		},
	});

	const onConfirm = useCallback(() => {
		modals.openConfirmModal({
			title: messages.confirmDeletion(messages.featureFlag()),
			children: (
				<Text size="sm">
					{messages.confirmDeletionBody(messages.featureFlag())}
				</Text>
			),
			labels: { confirm: 'Confirm', cancel: 'Cancel' },
			onConfirm: () => onDelete(flag),
		});
	});

	return (
		<form style={{ display: 'flex' }} onSubmit={form.onSubmit(onSave)}>
			<Stack style={{ justifySelf: 'center', flexGrow: 1 }}>
				{Boolean(flag) ? (
					<TextInput label={messages.key()} value={flag} disabled />
				) : (
					<TextInput
						data-autofocus
						label={messages.key()}
						key={form.key('key')}
						{...form.getInputProps('key')}
					/>
				)}

				<Textarea
					data-autofocus={Boolean(flag)}
					label={messages.description()}
					key={form.key('description')}
					{...form.getInputProps('description')}
				/>
				<Select
					label={messages.audience()}
					key={form.key('audience')}
					data={Object.keys(AUDIENCES).map((name) => ({
						value: name,
						label: messages[name](),
					}))}
					{...form.getInputProps('audience')}
				/>
				<Group style={{ justifyContent: 'space-between' }}>
					{onDelete && (
						<Button loading={deleting} bg="red" onClick={onConfirm}>
							{messages.delete()}
						</Button>
					)}
					<Button loading={saving} type="submit">
						{flag ? messages.update() : messages.create()}
					</Button>
				</Group>
			</Stack>
		</form>
	);
};
