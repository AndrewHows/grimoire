import { LogOutIcon, PenLineIcon, UserIcon } from 'lucide-react';

export const main = () =>
	[
		{
			label: 'Create',
			link: '/app/character/edit',
			icon: PenLineIcon,
		},
	].filter(Boolean);

export const footer = () => {
	return [{ label: 'termsAndConditions', link: '/app/terms-and-conditions' }];
};

export const profile = () => [
	{ label: 'profile', link: '/app/profile', icon: UserIcon },
	{ label: 'logout', link: '/auth/logout', icon: LogOutIcon },
];
