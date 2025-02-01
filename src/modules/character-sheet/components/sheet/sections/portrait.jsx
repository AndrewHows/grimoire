import { useContext } from 'react';
import { Character } from '../context';
import { Draggable } from '@hello-pangea/dnd';

export const Portrait = ({
	index,
	draggableId,
	character: characterProp,
	...props
}) => {
	const context = useContext(Character);
	const character = characterProp ?? context.character;

	if (character.portrait) {
		if (index !== undefined) {
			return (
				<Draggable key="portrait" index={index} draggableId={draggableId}>
					{(provided) => (
						<div
							ref={provided.innerRef}
							{...props}
							{...provided.draggableProps}
							style={{
								maskImage: 'url(/mask.png)',
								maskRepeat: 'no-repeat',
								height: '230px',
								...props.style,
								...provided.draggableProps.style,
							}}
						>
							<img
								src={character.portrait}
								{...provided.dragHandleProps}
								style={{
									width: '230px',
									scale: 1,
									...provided.dragHandleProps.style,
								}}
							/>
							{provided.placeholder}
						</div>
					)}
				</Draggable>
			);
		} else {
			return (
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
			);
		}
	}
};
