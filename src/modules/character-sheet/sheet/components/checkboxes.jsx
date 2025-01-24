export function Checkboxes({ qty, style }) {
	const {
		width = '16px',
		height = '16px',
		borderColor = 'black',
		borderWidth = '1px',
		...rest
	} = style ?? {};

	return (
		<div
			style={{
				alignContent: 'center',
				justifyContent: 'center',
				flexWrap: 'wrap',
				display: 'flex',
				gap: '0.25rem',
				...rest,
			}}
		>
			{new Array(qty ?? 1).fill('').map((_, idx) => (
				<div
					key={idx}
					style={{
						display: 'inline-block',
						width,
						height,
						borderColor,
						borderStyle: 'solid',
						borderWidth,
					}}
				>
					&nbsp;
				</div>
			))}
		</div>
	);
}
