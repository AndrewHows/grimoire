import { LogOutIcon, UserIcon } from 'lucide-react';

export const main = ({ user, showEncounters, showMonsters, showGames }) =>
	[
		{
			label: 'Characters',
			link: '/app/characters',
		},
		showMonsters && {
			label: 'Monsters',
			link: '/app/monsters',
		},
		showEncounters && {
			label: 'Encounters',
			link: '/app/encounters',
		},
		showGames && {
			label: 'Games',
			link: '/app/games',
		},
		user?.profile?.secure?.admin && {
			label: 'Feature Flags',
			link: '/admin/feature-flags',
		},
		user?.profile?.secure?.admin && {
			label: 'Users',
			link: '/admin/users',
		},
	].filter(Boolean);

export const footer = () => {
	return [{ label: 'termsAndConditions', link: '/app/terms-and-conditions' }];
};

export const profile = () => [
	{ label: 'profile', link: '/app/profile', icon: UserIcon },
	{ label: 'logout', link: '/auth/logout', icon: LogOutIcon },
];
