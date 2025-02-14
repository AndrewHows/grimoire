import { CHARACTER_COLLECTION, PARTY_COLLECTION } from '@/constants';
import { Firestore, Auth } from '@/contexts';
import { firebase, KeyedArray } from '@/lib/firebase';
import { useContext, useEffect, useState } from 'react';
import { collection, getFirestore, where } from 'firebase/firestore';

const firestore = getFirestore(firebase);

const characterRef = ({ userId, characterId }) =>
	`party-character-${userId}-${characterId}`;

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

export const useParties = () => {
	const { registerQuery, data } = useContext(Firestore);
	const { user } = useContext(Auth);
	const [parties, setParties] = useState();

	useEffect(() => {
		if (user?.uid) {
			registerQuery('parties', [
				collection(firestore, 'user-data', user.uid, PARTY_COLLECTION),
			]);
		}
	}, [user?.uid]);

	const characters = data.parties?.map((p) => p.data().characters).flat();

	useEffect(() => {
		if (characters) {
			characters.forEach((c) => {
				const { userId, characterId } = c;
				registerQuery(characterRef(c), [
					collection(firestore, 'user-data', userId, CHARACTER_COLLECTION),
					where('__name__', '==', characterId),
				]);
			});
		}
	}, [JSON.stringify(characters)]);

	const loadedCharacters = Object.keys(data).filter((key) =>
		characters?.map(characterRef).includes(key)
	);

	useEffect(() => {
		setParties(
			new KeyedArray(
				'id',
				...(data.parties?.map((p) => {
					p.characters = [];
					p.data().characters.forEach((c) => {
						if (data[characterRef(c)]) {
							p.characters.push(data[characterRef(c)].get(c.characterId));
						}
					});
					return p;
				}) ?? [])
			)
		);
	}, [data.parties, JSON.stringify(loadedCharacters)]);

	return parties ?? new KeyedArray();
};
