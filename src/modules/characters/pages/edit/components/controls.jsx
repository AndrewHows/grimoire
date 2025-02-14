import { Button, Group } from '@mantine/core';
import { useContext } from 'react';
import { useMessages } from '@/hooks/messages';
import { useLoaderData } from 'react-router-dom';
import { ImportDND4E } from '@/modules/characters/pages/edit/components/import-dnd4e';
import { CHARACTER_COLLECTION } from '@/constants';
import { Auth } from '@/contexts';
import { UploadImage } from '@/components/upload-image';
import { useDelete, useSave } from '@/hooks/firestore';

export const Controls = ({
	character,
	onCharacterChange,
	onCharacterPropChange,
	mode,
	onModeChange,
}) => {
	const { user } = useContext(Auth);
	const messages = useMessages();
	const loader = useLoaderData();
	const SaveButton = useSave({
		collection: CHARACTER_COLLECTION,
		message: messages.character(),
		id: loader?.id,
	});
	const DeleteButton = useDelete({
		collection: CHARACTER_COLLECTION,
		message: messages.character(),
		id: loader?.id,
		to: '/app/characters',
	});

	return (
		<Group justify="center">
			<ImportDND4E
				existingData={character}
				onImport={(data) => onCharacterChange(data)}
			/>
			<Button onClick={() => onModeChange(mode === 'code' ? 'ui' : 'code')}>
				{mode === 'ui' ? 'Edit Code' : 'Edit Sheet'}
			</Button>
			{Object.keys(character).length > 0 && (
				<UploadImage
					filename={character.name}
					onUpload={(url) => onCharacterPropChange([], 'portrait', url)}
				>
					Set Portrait
				</UploadImage>
			)}
			<SaveButton data={character} />
			<Button
				disabled={!loader?.id}
				onClick={() => window.open(`/sheet/${user.uid}/${loader.id}`)}
			>
				View
			</Button>
			<DeleteButton />
		</Group>
	);
};
