import { forwardRef } from 'react';

export const Column = forwardRef(({ children, style }, ref) => {
	return (
		<div
			ref={ref}
			style={{
				display: 'flex',
				flex: 1,
				flexDirection: 'column',
				gap: '1rem',
				...style,
			}}
		>
			{children}
		</div>
	);
});

export function Row({ children, style }) {
	return (
		<div
			style={{
				display: 'flex',
				flex: 1,
				flexDirection: 'row',
				gap: '1rem',
				...style,
			}}
		>
			{children}
		</div>
	);
}
