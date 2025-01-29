import { useContext } from 'react';
import { Character } from '../context';

export const Portrait = (props) => {
	const { character } = useContext(Character);

	return (
		character.portrait && (
			<div
				{...props}
				style={{
					maskImage: 'url(/mask.png)',
					maskRepeat: 'no-repeat',
					height: '230px',
					...props.style,
				}}
			>
				<img src={character.portrait} style={{ width: '230px', scale: 1 }} />
			</div>
		)
	);
};
