export const MOBILE_BREAKPOINT = 'xs';
export const CONTENT_WIDTH = '1600px';
export const PROFILE_COLLECTION = 'people';
export const FEATURE_FLAG_COLLECTION = 'feature-flags';
export const CHARACTER_COLLECTION = 'characters';
export const LANGUAGES = [
	{ code: 'en', icon: '🇬🇧', name: 'English' },
	{ code: 'de', icon: '🇩🇪', name: 'Deutsch' },
];
export const AUDIENCES = {
	nobody: () => false,
	everybody: () => true,
	admin: (user) => Boolean(user.profile?.secure?.admin),
};

export const PAGE_SIZE = 25;
