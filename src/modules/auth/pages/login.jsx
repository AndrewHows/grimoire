import {
	getAuth,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
} from 'firebase/auth';
import {
	Button,
	Card,
	Divider,
	Group,
	Image,
	PasswordInput,
	Stack,
	Text,
	TextInput,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { useMessages } from '@/hooks/messages';
import { firebase } from '@/lib/firebase';

const auth = getAuth(firebase);

export const Login = () => {
	const [loading, setLoading] = useState(false);
	const messages = useMessages();

	const onPasswordAuth = async ({ email, password }) => {
		try {
			setLoading(true);
			await signInWithEmailAndPassword(auth, email, password);
		} catch (e) {
			notifications.show({
				title: 'Error logging on',
				message: messages.firebaseError(e.code, e.message),
				color: 'red',
			});
			setLoading(false);
		}
	};

	const form = useForm({
		mode: 'uncontrolled',
		validate: {
			email: (value) =>
				!Boolean(value) ? messages.fieldRequired('Email') : null,
			password: (value) =>
				!Boolean(value) ? messages.fieldRequired('Password') : null,
		},
	});

	return (
		<form onSubmit={form.onSubmit(onPasswordAuth)}>
			<Card
				shadow="sm"
				padding="lg"
				radius="md"
				withBorder
				style={{
					minWidth: '300px',
				}}
			>
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
					<Button loading={loading} type="submit">
						{messages.login()}
					</Button>
					<Group justify="right" gap="xs">
						<Link to="forgot-password">
							<Text size="xs">{messages.forgotPassword()}</Text>
						</Link>
						<Link to="create-account">
							<Text size="xs">{messages.createAccount()}</Text>
						</Link>
					</Group>
					<Divider />
					<Stack>
						<GoogleAuthButton />
						<FacebookAuthButton />
					</Stack>
				</Stack>
			</Card>
		</form>
	);
};

const SocialAuthButton = ({ name, icon, ...props }) => {
	const messages = useMessages();

	return (
		<Button
			styles={{
				root: {
					boxShadow:
						'0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
				},
				inner: { justifyContent: 'left' },
			}}
			size="md"
			autoContrast
			leftSection={<Image src={icon} alt="Facebook" width={24} height={24} />}
			{...props}
		>
			<Text size="sm">{messages.signInWith(name)}</Text>
		</Button>
	);
};

const FacebookAuthButton = () => (
	<SocialAuthButton
		name="Facebook"
		icon="/auth-providers/facebook.svg"
		color="#3b5998"
		onClick={() => signInWithPopup(auth, new FacebookAuthProvider())}
	/>
);

const GoogleAuthButton = () => (
	<SocialAuthButton
		name="Google"
		icon="/auth-providers/google.svg"
		color="#ffffff"
		onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
	/>
);
