import { AUDIENCES, FEATURE_FLAG_COLLECTION } from '@/constants';
import { Firestore, Auth } from '@/contexts';
import { firebase, KeyedArray } from '@/lib/firebase';
import { useContext, useEffect } from 'react';
import { collection, getFirestore } from 'firebase/firestore';

const firestore = getFirestore(firebase);

export const useFeature = (feature) => {
	const { user } = useContext(Auth);
	const featureFlags = useFeatures();

	if (!featureFlags?.get(feature)) return false;
	return AUDIENCES[featureFlags.get(feature).data().audience]?.(user) ?? false;
};

export const useFeatures = () => {
	const {
		registerQuery,
		data: { featureFlags },
	} = useContext(Firestore);

	useEffect(() => {
		registerQuery('featureFlags', [
			collection(firestore, FEATURE_FLAG_COLLECTION),
		]);
	}, []);
	return featureFlags ?? new KeyedArray();
};
