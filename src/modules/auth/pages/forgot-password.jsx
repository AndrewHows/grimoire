import { useMessages } from '@/hooks/messages';
import { firebase } from '@/lib/firebase/wrappers';
import { Button, Card, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const auth = getAuth(firebase);

export const ForgotPassword = () => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const messages = useMessages();

	const forgotSuccessful = () => {
		notifications.show({
			title: messages.forgotSucceeded(),
		});
		navigate('/');
	};

	const form = useForm({
		mode: 'uncontrolled',
		validate: {
			email: (value) =>
				!Boolean(value) ? messages.fieldRequired('Email') : null,
		},
	});

	const onForgotPassword = async ({ email }) => {
		try {
			setLoading(true);
			await sendPasswordResetEmail(auth, email);
			forgotSuccessful();
		} catch (e) {
			setLoading(false);
			notifications.show({
				title: 'Error resetting password',
				message: messages.firebaseError(e.code, e.message),
				color: 'red',
			});
		}
	};

	return (
		<form onSubmit={form.onSubmit(onForgotPassword)}>
			<Card shadow="sm" padding="lg" radius="md" miw="350px" withBorder>
				<Stack>
					<TextInput
						label={messages.emailAddress()}
						key={form.key('email')}
						{...form.getInputProps('email')}
					/>
					<Button loading={loading} type="submit">
						{messages.resetPassword()}
					</Button>
				</Stack>
			</Card>
		</form>
	);
};
