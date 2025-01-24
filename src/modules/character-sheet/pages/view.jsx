import { useLoaderData } from 'react-router-dom';
import { Sheet } from '../sheet/sheet';
import { useCharacter } from '@/modules/character-sheet/hooks/characters';
import { processCharacter } from '@/modules/character-sheet/character';

export const ViewCharacter = () => {
	const loader = useLoaderData();
	const character = useCharacter(loader?.uid, loader?.id);

	return <Sheet character={processCharacter(character?.data())} />;
};
