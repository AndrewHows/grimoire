import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import { useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebase, FirestoreRegistry } from '@/lib/firebase';
import {
	collection,
	doc,
	documentId,
	getDoc,
	getFirestore,
	onSnapshot,
	query,
	setDoc,
	where,
} from 'firebase/firestore';
import { Firestore as FirestoreContext, Auth, Language } from '@/contexts';
import { MantineProvider } from '@mantine/core';

import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import '@mantine/notifications/styles.css';
import './main.css';

import { Notifications } from '@mantine/notifications';
import { PROFILE_COLLECTION } from '@/constants';
import { ModalsProvider } from '@mantine/modals';
import { rootRoutes } from '@/routes';
import { Loading } from '@/components/loading';
import { theme } from '@/theme';

const auth = getAuth(firebase);
const firestore = getFirestore(firebase);

const App = () => {
	const [user, setUser] = useState();
	const [language, setLanguage] = useState(
		navigator.language ?? navigator.userLanguage
	);

	useEffect(() => {
		return onAuthStateChanged(auth, async (u) => {
			if (!user && u) {
				const userDoc = doc(firestore, PROFILE_COLLECTION, u.uid);
				const userSnap = await getDoc(userDoc);
				if (!userSnap.exists()) {
					const name = (u.displayName ?? '').split(' ');
					setDoc(userDoc, {
						email: u.email,
						givenName: name[0],
						surname: name.slice(1).join(' '),
					});
				}
				setUser({
					...(u ?? null),
					profile: userSnap.data(),
				});
			} else if (!u) {
				setUser(null);
			}
		});
	}, []);

	useEffect(() => {
		if (user?.profile?.language) setLanguage(user.profile.language);
	}, [user?.profile?.language]);

	useEffect(() => {
		if (user?.uid) {
			return onSnapshot(
				query(
					collection(firestore, PROFILE_COLLECTION),
					where(documentId(), '==', user.uid)
				),
				(qs) => {
					qs.docChanges().forEach((change) => {
						if (['added', 'modified'].includes(change.type)) {
							setUser({
								...user,
								profile: change.doc.data(),
							});
						}
					});
				}
			);
		}
	}, [user?.uid]);

	return (
		<div
			style={{
				minWidth: '100vw',
				minHeight: '100vh',
				display: 'grid',
			}}
		>
			<MantineProvider theme={theme}>
				<ModalsProvider>
					<Notifications />
					<Auth.Provider value={{ user, setUser }}>
						<Auth.Consumer>
							{({ user }) => {
								return (
									<FirestoreRegistry context={FirestoreContext}>
										{user === undefined ? (
											<Loading />
										) : (
											<Language.Provider value={{ language, setLanguage }}>
												<RouterProvider
													router={createBrowserRouter(
														rootRoutes({
															user,
														})
													)}
												/>
											</Language.Provider>
										)}
									</FirestoreRegistry>
								);
							}}
						</Auth.Consumer>
					</Auth.Provider>
				</ModalsProvider>
			</MantineProvider>
		</div>
	);
};

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<App />
	</StrictMode>
);
