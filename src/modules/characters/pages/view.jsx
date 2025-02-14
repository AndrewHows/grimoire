import { useLoaderData } from 'react-router-dom';
import { Sheet } from '../components/sheet/sheet';
import { useCharacter } from '@/modules/characters/hooks/characters';
import { processCharacter } from '@/modules/characters/character';

export const ViewCharacter = () => {
	const loader = useLoaderData();
	const character = useCharacter(loader?.uid, loader?.id);

	return <Sheet character={processCharacter(character?.data())} />;
};
