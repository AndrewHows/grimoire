import { ENCOUNTER_COLLECTION, MONSTER_COLLECTION } from '@/constants';
import { Auth, Firestore } from '@/contexts';
import { firebase, KeyedArray } from '@/lib/firebase';
import { collection, getFirestore, where } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
const monsterRef = ({ userId, monsterId }) =>
	`encounter-monster-${userId}-${monsterId}`;

export const useEncounters = () => {
	const { registerQuery, data } = useContext(Firestore);
	const { user } = useContext(Auth);
	const [encounters, setEncounters] = useState();
	const firestore = getFirestore(firebase);

	useEffect(() => {
		if (user?.uid) {
			registerQuery('encountersWithMonsters', [
				collection(firestore, 'user-data', user.uid, ENCOUNTER_COLLECTION),
			]);
		}
	}, [user?.uid]);

	const monsters = data.encountersWithMonsters
		?.map((p) => p.data().monsters)
		.flat();

	useEffect(() => {
		if (monsters) {
			monsters.filter(Boolean).forEach((c) => {
				const { userId, monsterId } = c;
				registerQuery(monsterRef(c), [
					collection(firestore, 'user-data', userId, MONSTER_COLLECTION),
					where('__name__', '==', monsterId),
				]);
			});
		}
	}, [JSON.stringify(monsters)]);

	const loadedMonsters = Object.keys(data).filter((key) => {
		return monsters?.filter(Boolean).map(monsterRef).includes(key);
	});

	useEffect(() => {
		setEncounters(
			new KeyedArray(
				'id',
				...(data.encountersWithMonsters?.map((e) => {
					e.monsters = [];
					e.data().monsters?.forEach((m) => {
						if (data[monsterRef(m)]) {
							e.monsters.push(data[monsterRef(m)].get(m.monsterId));
						}
					});
					return e;
				}) ?? [])
			)
		);
	}, [data.encountersWithMonsters, JSON.stringify(loadedMonsters)]);

	return encounters ?? new KeyedArray();
};
