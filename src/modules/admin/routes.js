import { FeatureFlagsPage } from '@/modules/feature-flags/pages/list';
import { UsersPage } from '@/modules/users/pages/list';

export const adminRoutes = () => [
	{
		path: 'feature-flags',
		Component: FeatureFlagsPage,
	},
	{
		path: 'users',
		Component: UsersPage,
	},
];
