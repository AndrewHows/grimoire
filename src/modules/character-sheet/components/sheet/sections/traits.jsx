import { useContext } from 'react';
import { Row } from '../components/layout';
import { TextField } from '../components/text-field';
import { Character } from '../context';

export const Traits = () => {
	const { character } = useContext(Character);
	return (
		<>
			<Row>
				<TextField label="Name" value={character.name} style={{ flex: 1 }} />
				<TextField label="Level" value={character.level} />
				<TextField label="Race" value={character.race} />
				<TextField label="Size" value={character.size} />
				<TextField label="Deity" value={character.deity} />
			</Row>
			<Row>
				<TextField
					label="Class"
					value={character.class_name}
					style={{ flex: 1 }}
				/>
				<TextField
					label="Paragon Path"
					value={character.paragon}
					style={{ flex: 1 }}
				/>
				<TextField
					label="Epic Destiny"
					value={character.epic}
					style={{ flex: 1 }}
				/>
			</Row>
		</>
	);
};
