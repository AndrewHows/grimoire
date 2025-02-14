import { useMediaQuery } from '@mantine/hooks';

export function Page({ children }) {
	const isPrint = useMediaQuery('print');

	return (
		<section
			style={{
				width: '210mm',
				height: '308mm',
				position: 'relative',
				scale: '1',
				backgroundColor: '#ffffff',
				border: '1px solid #000000',
				padding: '5mm',
				boxSizing: 'content-box',
				pageBreakBefore: 'always',
				...(isPrint
					? {
							border: 'none',
					  }
					: null),
			}}
		>
			{children}
		</section>
	);
}
