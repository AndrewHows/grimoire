export default {
	login: () => 'Login',
	logout: () => 'Logout',
	home: () => 'Home',
	pages: () => 'Pages',
	page1: () => 'Page 1',
	page2: () => 'Page 2',
	page3: () => 'Page 3',
	profile: () => 'Profile',
	termsAndConditions: () => 'Terms and Conditions',
	update: () => 'Update',
	givenName: () => 'Given name',
	surname: () => 'Surname',
	industry: () => 'Industry',
	emailAddress: () => 'Email Address',
	password: () => 'Password',
	repeatPassword: () => 'Repeat Password',
	resetPassword: () => 'Reset Password',
	passwordsNotMatch: () => 'Passwords do not match',
	createAccount: () => 'Create Account',
	createAccountSucceeded: () => 'Account created successfully',
	createAccountFailed: () => 'Account creation failed',
	forgotPassword: () => 'Forgot Password',
	forgotSucceeded: () => 'Forgot password email sent',
	forgotFailed: () => 'Forgot password failed',
	loginFailed: () => 'Login failed',
	signInWith: (name) => `Sign in with ${name}`,
	profileCompletion: () =>
		'Please complete your profile to finish setting up your account',
	fieldRequired: (field) => `"${field}" is required`,
	pageNotFound: () => 'Page Not Found',
	admin: () => 'Admin',
	audience: () => 'Audience',
	key: () => 'Key',
	description: () => 'Description',
	nobody: () => 'Nobody',
	everybody: () => 'Everybody',
	featureFlag: () => 'Feature flag',
	featureFlags: () => 'Feature flags',
	updateSucceeded: (name) => `Updating ${name} succeeded`,
	updateFailed: (name) => `Updating ${name} failed`,
	createSucceeded: (name) => `Creating ${name} succeeded`,
	createFailed: (name) => `Creating ${name} failed`,
	deleteSucceeded: (name) => `${name} deleted successfully`,
	deleteFailed: (name) => `Deleting ${name} failed`,
	delete: () => 'Delete',
	create: () => 'Create',
	new: (name) => `New ${name}`,
	noItems: (name) => `No ${name} available`,
	expiredFeatures: (qty) =>
		`${qty} obsolete feature flag${
			qty !== 1 ? 's' : ''
		} should be removed from the codebase and deleted`,
	confirmDeletion: (name) => `Are you sure you want to delete this ${name}?`,
	confirmDeletionBody: () => `This is permanent, and cannot be reversed`,
	email: () => 'Email',
	user: () => 'User',
	users: () => 'Users',
	more: () => 'More',
	filter: () => 'Filter',
	filterMinimumLength: () => 'Filter must be at least three characters',
	monster: () => 'monster',
	encounter: () => 'encounter',

	firebaseError: (code, fallback) =>
		({
			'auth/missing-email': 'You need to provide an email address',
			'auth/email-already-in-use': 'Email address already in use',
			'auth/user-not-found': 'Email or password is incorrect',
			'auth/wrong-password': 'Email or password is incorrect',
			'auth/missing-password': 'You need to provide a password',
			'auth/weak-password': 'Your password is not strong enough',
			'auth/invalid-email': 'Supplied email is invalid',
		}[code] ??
		fallback ??
		code),
};
