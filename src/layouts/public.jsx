import { LanguageMenu } from '@/components/language-menu';
import { Button, Group, Text } from '@mantine/core';
import { ArrowLeft } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export const PublicLayout = () => {
	const navigate = useNavigate();
	const location = useLocation();

	return (
		<Group justify="center" miw="100vw">
			{!['/auth', '/auth/onboarding'].includes(location.pathname) && (
				<Button
					pos="absolute"
					top="1rem"
					left="1rem"
					onClick={() => navigate('/')}
					variant="subtle"
					c="black"
				>
					<Group gap={4}>
						<ArrowLeft strokeWidth={1.5} size={14} />
						<Text fz="sm">Back to Login</Text>
					</Group>
				</Button>
			)}
			<Group pos="absolute" top="1rem" right="1rem">
				<LanguageMenu />
			</Group>
			<Outlet />
		</Group>
	);
};
