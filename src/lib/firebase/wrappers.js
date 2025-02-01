import { initializeApp } from 'firebase/app';
import {
	getFirestore,
	persistentLocalCache,
	persistentMultipleTabManager,
	collection,
	doc,
	addDoc,
	connectFirestoreEmulator,
	updateDoc as updateDocCore,
} from 'firebase/firestore';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { connectStorageEmulator, getStorage } from 'firebase/storage';

export const firebase = initializeApp(
	{
		apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
		authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
		databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
		projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
		storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
		messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
		appId: import.meta.env.VITE_FIREBASE_APP_ID,
		measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
	},
	{
		localCache: persistentLocalCache({
			tabManager: persistentMultipleTabManager(),
		}),
	}
);

const auth = getAuth(firebase);
const firestore = getFirestore(firebase);
const functions = getFunctions(firebase);
const storage = getStorage(firebase);

export const createDoc = (col, data) => {
	return addDoc(collection(firestore, ...col), data);
};

export const updateDoc = (col, { id: _id, ...data }) => {
	updateDocCore(doc(firestore, ...col), data);
};

if (import.meta.env.VITE_FIREBASE_EMULATE) {
	connectFunctionsEmulator(functions, 'localhost', 5001);
	connectFirestoreEmulator(firestore, 'localhost', 8080);
	connectAuthEmulator(auth, 'http://localhost:9099');
	connectStorageEmulator(storage, 'localhost', 7000);
}
