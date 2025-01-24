import { useContext } from 'react';
import { Character } from '../context';

export const Portrait = () => {
	const { character } = useContext(Character);

	return (
		<div
			style={{
				maskImage: 'url(/mask.png)',
				maskRepeat: 'no-repeat',
				height: '230px',
			}}
		>
			<img src={character.portrait} style={{ width: '230px', scale: 1 }} />
		</div>
	);
};
