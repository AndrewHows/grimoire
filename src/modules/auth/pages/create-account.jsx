import { useMessages } from '@/hooks/messages';
import { firebase } from '@/lib/firebase/wrappers';
import { Button, Card, PasswordInput, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const auth = getAuth(firebase);

export const CreateAccount = () => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const messages = useMessages();

	const form = useForm({
		mode: 'uncontrolled',
		validate: {
			email: (value) => (!value ? messages.fieldRequired('Email') : null),
			password: (value) => (!value ? messages.fieldRequired('Password') : null),
			passwordCheck: (value) =>
				!value ? messages.fieldRequired('Repeat Password') : null,
		},
	});

	const onCreateAccount = async ({ email, password, passwordCheck }) => {
		try {
			if (password !== passwordCheck) {
				notifications.show({
					title: messages.createAccountFailed(),
					message: messages.passwordsNotMatch(),
					color: 'red',
				});
				return;
			}

			setLoading(true);
			await createUserWithEmailAndPassword(auth, email, password);
			notifications.show({
				title: messages.createAccountSucceeded(),
			});
			navigate('/');
		} catch (e) {
			notifications.show({
				title: messages.createAccountFailed(),
				message: messages.firebaseError(e.code, e.message),
				color: 'red',
			});
			setLoading(false);
		}
	};

	return (
		<form onSubmit={form.onSubmit(onCreateAccount)}>
			<Card shadow="sm" padding="lg" radius="md" miw="350px" withBorder>
				<Stack>
					<TextInput
						label={messages.emailAddress()}
						key={form.key('email')}
						{...form.getInputProps('email')}
					/>
					<PasswordInput
						label={messages.password()}
						key={form.key('password')}
						{...form.getInputProps('password')}
					/>
					<PasswordInput
						label={messages.repeatPassword()}
						key={form.key('passwordCheck')}
						{...form.getInputProps('passwordCheck')}
					/>
					<Button loading={loading} type="submit">
						{messages.createAccount()}
					</Button>
				</Stack>
			</Card>
		</form>
	);
};
