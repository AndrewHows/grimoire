import { Link } from 'react-router-dom';
import { Group, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import { PlusCircleIcon, User2Icon } from 'lucide-react';
import { useFeature } from '@/modules/feature-flags/hooks/feature';
import { MONSTER_COLLECTION } from '@/constants';
import { useUserDocuments } from '@/hooks/firestore';
import { Token } from '@/modules/monsters/component/token';

export const ListMonsters = () => {
	const monsters = useUserDocuments(MONSTER_COLLECTION);
	const theme = useMantineTheme();
	const showMonsters = useFeature('monsters');

	if (!showMonsters) return;

	return (
		<Stack>
			<Title order={3}>Monsters</Title>
			<Group align="top">
				{monsters
					.sort((a, b) => {
						const levelDiff = a.data().level - b.data().level;
						if (levelDiff !== 0) return levelDiff;
						return a.data().name.localeCompare(b.data().name);
					})
					.map((m) => (
						<Link
							key={m.id}
							to={`edit/${m.id}`}
							style={{ textDecoration: 'none' }}
						>
							<Stack key={m.id} align="center" gap={5}>
								<Token monster={m.data()} size="lg" />
								<Stack gap={0}>
									<Text c="black" align="center">
										{m.data().name}
									</Text>
									<Text c="gray.5" fz="xs" align="center">
										(Level {m.data().level})
									</Text>
								</Stack>
							</Stack>
						</Link>
					))}
				<Link to="edit" style={{ textDecoration: 'none' }}>
					<PlusCircleIcon
						size={140}
						color={theme.colors.gray[6]}
						style={{ display: 'block' }}
					/>
				</Link>
			</Group>
		</Stack>
	);
};
