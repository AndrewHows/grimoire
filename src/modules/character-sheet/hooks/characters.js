import { CHARACTER_COLLECTION } from '@/constants';
import { Firestore, Auth } from '@/contexts';
import { firebase, KeyedArray } from '@/lib/firebase';
import { useContext, useEffect, useState } from 'react';
import { collection, getFirestore, where } from 'firebase/firestore';

const firestore = getFirestore(firebase);

export const useCharacters = () => {
	const {
		registerQuery,
		data: { characters },
	} = useContext(Firestore);
	const { user } = useContext(Auth);

	useEffect(() => {
		if (user?.uid) {
			registerQuery('characters', [
				collection(firestore, 'user-data', user.uid, CHARACTER_COLLECTION),
			]);
		}
	}, [user?.uid]);

	return characters ?? new KeyedArray();
};

export const useCharacter = (uid, id) => {
	const [characters, setCharacters] = useState([]);

	const {
		registerQuery,
		data: { selectedCharacters },
	} = useContext(Firestore);

	if (!id) return null;

	if (!characters.includes(id)) setCharacters([...characters, id]);

	useEffect(() => {
		registerQuery('selectedCharacters', [
			collection(firestore, 'user-data', uid, CHARACTER_COLLECTION),
			where('__name__', 'in', characters),
		]);
	}, [id, uid]);
	return (selectedCharacters ?? new KeyedArray()).get(id);
};
