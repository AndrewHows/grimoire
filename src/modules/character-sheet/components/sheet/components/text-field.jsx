import global from '@/global.module.css';
import { useMantineTheme } from '@mantine/core';

export function TextField({ value, label, style }) {
	const theme = useMantineTheme();

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				...style,
			}}
		>
			<div
				className={global.caveat}
				style={{
					fontSize: '18px',
					textAlign: 'center',
					borderBottom: '1px solid black',
					padding: '0 8px',
				}}
			>
				{value ?? <>&nbsp;</>}
			</div>
			<label
				style={{
					textAlign: 'center',
					fontSize: '12px',
					color: theme.colors.gray[5],
				}}
			>
				{label}
			</label>
		</div>
	);
}
