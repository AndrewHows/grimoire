import { useMessages } from '@/hooks/messages';
import { Group, Select, TextInput } from '@mantine/core';

export const CoreFields = ({ email, form }) => {
	const messages = useMessages();

	return (
		<>
			<TextInput label={messages.email()} value={email} disabled />
			<Group>
				<TextInput
					data-autofocus
					style={{ flexGrow: 1 }}
					miw="10rem"
					label={messages.givenName()}
					key={form.key('givenName')}
					{...form.getInputProps('givenName')}
				/>
				<TextInput
					style={{ flexGrow: 1 }}
					miw="10rem"
					label={messages.surname()}
					key={form.key('surname')}
					{...form.getInputProps('surname')}
				/>
			</Group>
		</>
	);
};
