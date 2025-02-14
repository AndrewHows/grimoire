import { useMantineTheme } from '@mantine/core';
import { useDrag } from 'react-dnd';

export const NoteToken = ({ index, style }) => {
	const theme = useMantineTheme();
	const drag = useDrag(
		() => ({
			type: 'notes',
			item: { index, type: 'notes' },
			collect: (monitor) => ({
				isDragging: !!monitor.isDragging(),
			}),
		}),
		[index]
	)[1];

	return (
		<div
			ref={drag}
			style={{
				border: '2px solid black',
				width: '40px',
				height: '40px',
				textAlign: 'center',
				lineHeight: '40px',
				backgroundColor: theme.colors.gray[2],
				borderRadius: '50%',
				...style,
			}}
		>
			{index + 1}
		</div>
	);
};
