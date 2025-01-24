import { redirect } from 'react-router-dom';
import { authRoutes } from '@/modules/auth/routes';
import { AuthenticatedLayout } from '@/layouts/authenticated';
import { NotFound } from '@/not-found';
import { PublicLayout } from '@/layouts/public';
import { profileRoutes } from '@/modules/profile/routes';
import {
	bareCharacterRoutes,
	characterRoutes,
} from '@/modules/character-sheet/routes';

const rootLoader =
	(user) =>
	({ request }) => {
		const redirectUrl = localStorage.getItem('auth-redirect');
		if (!user && !redirectUrl) {
			const url = new URL(request.url);
			localStorage.setItem('auth-redirect', `${url.pathname}${url.search}`);
			return redirect('/auth');
		} else if (user && redirectUrl) {
			localStorage.removeItem('auth-redirect');
			return redirect(redirectUrl);
		}

		return null;
	};

export const rootRoutes = ({ user }) => [
	...bareCharacterRoutes(),
	{
		path: '/',
		loader: rootLoader(user),
		children: [
			{
				index: true,
				loader: () => redirect('/app'),
			},
			{
				path: 'app',
				Component: AuthenticatedLayout,
				loader: ({ request }) => {
					const url = new URL(request.url);
					if (!user) return redirect(`/auth?to=${url.pathname}`);
					return null;
				},
				children: [
					{
						index: true,
						loader: () => redirect('/app/character/edit'),
					},
					...characterRoutes({ user }),
					...profileRoutes({ user }),
					{
						path: '*',
						Component: NotFound,
					},
				],
			},
			{
				path: 'auth',
				Component: PublicLayout,
				children: authRoutes({ user }),
			},
			{
				path: '*',
				Component: NotFound,
			},
		],
	},
];
