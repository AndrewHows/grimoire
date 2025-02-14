import { useMessages } from '@/hooks/messages';
import { Text } from '@mantine/core';
import { modals } from '@mantine/modals';

export const useConfirmDelete = () => {
	const messages = useMessages();

	return ({ message, onDelete }) => {
		modals.openConfirmModal({
			title: messages.confirmDeletion(message),
			children: <Text size="sm">{messages.confirmDeletionBody(message)}</Text>,
			labels: {
				confirm: 'Confirm',
				cancel: 'Cancel',
			},
			onConfirm: onDelete,
		});
	};
};
