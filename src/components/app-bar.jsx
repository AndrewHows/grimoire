import { CONTENT_WIDTH } from '@/constants';
import { Card, Group, Text, useMantineTheme } from '@mantine/core';
import { ProfileMenu } from '@/components/profile-menu';
import { Link } from 'react-router-dom';
import { main } from '@/nav';
import { useContext } from 'react';
import { Auth } from '@/contexts';
import { useFeature } from '@/modules/feature-flags/hooks/feature';
import { BookOpenIcon } from 'lucide-react';

export const AppBar = () => {
	const theme = useMantineTheme();
	const { user } = useContext(Auth);
	const showMonsters = useFeature('monsters');
	const showEncounters = useFeature('encounters');
	const showGames = useFeature('games');

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
					<Group align="center">
						<Link to="/app" style={{ textDecoration: 'none' }}>
							<Group align="center">
								<Text c="gray.0" fw="semibold">
									Grimoire &nbsp;
									<BookOpenIcon style={{ verticalAlign: 'bottom' }} />
								</Text>
							</Group>
						</Link>
						{main({ user, showMonsters, showGames, showEncounters }).map(
							({ link, label }, idx, original) => (
								<Group key={link}>
									<Link to={link} style={{ textDecoration: 'none' }}>
										<Text c="gray.0" fw="semibold">
											{label}
										</Text>
									</Link>
									{idx < original.length - 1 && (
										<Text c="gray.0" fw="semibold">
											•
										</Text>
									)}
								</Group>
							)
						)}
					</Group>
					<Group>
						<ProfileMenu />
					</Group>
				</Group>
			</Card>
		</>
	);
};
