import { useDrag } from 'react-dnd';
import { sizes as baseSizes } from '@/constants';
import { useMantineTheme } from '@mantine/core';
export const Token = ({
	monster,
	size,
	count,
	index,
	style,
	draggable,
	scaleToBaseSize,
}) => {
	const theme = useMantineTheme();
	const sizes = {
		sm: 50,
		md: 60,
		lg: 140,
	};

	size = sizes[size] ?? size;
	const { space: baseSize } = baseSizes.find(
		({ name }) => name === monster.size
	);
	const scaledSize = size * (scaleToBaseSize ? baseSize : 1) - 4;

	let drag;
	if (draggable) {
		drag = useDrag(
			() => ({
				type: 'monsters',
				item: { index, type: 'monsters' },
				collect: (monitor) => ({
					isDragging: !!monitor.isDragging(),
				}),
			}),
			[index]
		)[1];
	}

	if (draggable && index === undefined)
		console.log("'index' is required when draggable is true");

	const tokenStyle = {
		borderRadius: '50%',
		borderColor: 'black',
		borderStyle: 'solid',
		borderWidth: '1px',
		backgroundColor: theme.colors.gray[3],
		pointerEvents: 'none',
		width: scaledSize,
		height: scaledSize,
		marginTop: '2px',
		marginLeft: '2px',
	};

	const markerOffset =
		Math.sqrt((scaledSize / 2) * (scaledSize / 2) * 2) - scaledSize / 2 - 12;

	return (
		<div
			ref={draggable ? drag : undefined}
			style={{
				position: 'relative',
				width: 'fit-content',
				transform: 'translate(0, 0)',
				...style,
			}}
		>
			{monster.token ? (
				<img src={monster.token} style={tokenStyle} />
			) : (
				<div
					style={{
						...tokenStyle,
						fontSize: `${Math.floor(scaledSize / 3)}px`,
						color: theme.colors.gray[7],
						textAlign: 'center',
						lineHeight: `${scaledSize}px`,
					}}
				>
					{(monster.name ?? '')
						.split(' ')
						.map((w) => w[0])
						.join('')
						.toUpperCase()}
				</div>
			)}
			{count !== undefined && (
				<div
					style={{
						fontSize: '10px',
						textAlign: 'center',
						color: 'black',
						backgroundColor: 'white',
						width: '1.25rem',
						height: '1.25rem',
						lineHeight: '1.25rem',
						position: 'absolute',
						bottom: `${markerOffset}px`,
						right: `${markerOffset}px`,
						borderRadius: '50%',
						border: '1px solid black',
					}}
				>
					{String.fromCharCode(65 + count)}
				</div>
			)}
		</div>
	);
};
