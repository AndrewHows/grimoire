import { useMediaQuery } from '@mantine/hooks';

export function Page({ children }) {
	const isPrint = useMediaQuery('print');

	return (
		<section
			style={{
				width: '210mm',
				height: '297mm',
				position: 'relative',
				scale: '1',
				backgroundColor: '#ffffff',
				border: '1px solid #000000',
				padding: !isPrint ? '5mm' : 0,
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
