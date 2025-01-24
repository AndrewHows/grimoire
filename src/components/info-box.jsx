import { Text, useMantineTheme } from '@mantine/core';

export const InfoBox = ({ children, variant, centered, ...props }) => {
	const theme = useMantineTheme();
	const variants = {
		alert: { c: 'gray.0', bg: 'red.5' },
	};

	return (
		<Text
			p="lg"
			bg={theme.colors[theme.primaryColor][0]}
			{...variants[variant]}
			{...(centered && { style: { textAlign: 'center' } })}
			{...props}
		>
			{children}
		</Text>
	);
};
