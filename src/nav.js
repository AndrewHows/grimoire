import { LogOutIcon, PenLineIcon, UserIcon } from 'lucide-react';

export const main = (user) =>
	[
		{
			label: 'Create',
			link: '/app/character/edit',
			icon: PenLineIcon,
		},
	].filter(Boolean);

export const footer = (user) => {
	return [{ label: 'termsAndConditions', link: '/app/terms-and-conditions' }];
};

export const profile = (user) => [
	{ label: 'profile', link: '/app/profile', icon: UserIcon },
	{ label: 'logout', link: '/auth/logout', icon: LogOutIcon },
];
