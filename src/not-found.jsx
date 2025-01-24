import { useMessages } from '@/hooks/messages';
import { Stack, Text } from '@mantine/core';

export const NotFound = () => {
	const messages = useMessages();

	return (
		<Stack>
			<Text>{messages.pageNotFound()}</Text>
		</Stack>
	);
};
