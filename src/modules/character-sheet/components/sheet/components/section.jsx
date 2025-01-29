import { Draggable } from '@hello-pangea/dnd';
import { Header } from './header';

export function Section({
	label,
	children,
	index,
	draggableId,
	style: styleProp,
}) {
	const style = {
		backgroundColor: 'white',
		fontSize: '12px',
		...styleProp,
	};
	if (index !== undefined) {
		return (
			<Draggable key={label} index={index} draggableId={draggableId}>
				{(provided, snapshot) => (
					<div
						ref={provided.innerRef}
						{...provided.draggableProps}
						style={{ ...provided.draggableProps.style, ...style }}
					>
						<Header {...provided.dragHandleProps}>{label}</Header>
						{children}
					</div>
				)}
			</Draggable>
		);
	}
	return (
		<div style={style}>
			<Header>{label}</Header>
			{children}
		</div>
	);
}
