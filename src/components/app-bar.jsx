import { CONTENT_WIDTH } from '@/constants';
import { Card, Group, Text, useMantineTheme } from '@mantine/core';
import { ProfileMenu } from '@/components/profile-menu';
import { Link } from 'react-router-dom';

export const AppBar = () => {
	const theme = useMantineTheme();

	return (
		<>
			<Card
				radius={0}
				padding={8}
				bg={`${theme.primaryColor}.9`}
				w="100vw"
				style={{
					overflow: 'visible',
					alignItems: 'center',
				}}
			>
				<Group
					maw={CONTENT_WIDTH}
					w="100%"
					style={{
						justifyContent: 'space-between',
					}}
				>
					<Group>
						<Link to="/app" style={{ textDecoration: 'none' }}>
							<Text c="gray.0" fw="semibold">
								Grimoire
							</Text>
						</Link>
					</Group>
					<Group>
						<ProfileMenu />
					</Group>
				</Group>
			</Card>
		</>
	);
};
