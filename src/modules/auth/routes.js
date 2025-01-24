import { redirect } from 'react-router-dom';
import { Login } from './pages/login';
import { getAuth, signOut } from 'firebase/auth';
import { firebase } from '@/lib/firebase';
import { CreateAccount } from '@/modules/auth/pages/create-account';
import { ForgotPassword } from '@/modules/auth/pages/forgot-password';

const auth = getAuth(firebase);

export const authRoutes = ({ user }) => [
	{
		index: true,
		Component: Login,
		loader: ({ request }) => {
			const url = new URL(request.url);
			if (url.searchParams.get('to')) {
				localStorage.setItem('auth-redirect', url.searchParams.get('to'));
			} else if (user) return redirect('/');
			return null;
		},
	},
	{
		path: 'create-account',
		Component: CreateAccount,
		loader: () => {
			if (user) return redirect('/');
			return null;
		},
	},
	{
		path: 'logout',
		loader: async () => {
			await signOut(auth);
			return redirect('/');
		},
	},
	{
		path: 'forgot-password',
		Component: ForgotPassword,
	},
];
