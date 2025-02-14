import { Link } from 'react-router-dom';
import { Group, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import { PlusCircleIcon, User2Icon } from 'lucide-react';
import { useFeature } from '@/modules/feature-flags/hooks/feature';
import { ENCOUNTER_COLLECTION } from '@/constants';
import { useUserDocuments } from '@/hooks/firestore';

export const ListEncounters = () => {
	const encounters = useUserDocuments(ENCOUNTER_COLLECTION);
	const theme = useMantineTheme();
	const showEncounters = useFeature('encounters');

	if (!showEncounters) return;

	return (
		<Stack>
			<Title order={3}>Encounters</Title>
			<Group align="top">
				{encounters
					.sort((a, b) => {
						const levelDiff = a.data().level - b.data().level;
						if (levelDiff !== 0) return levelDiff;
						return a.data().name.localeCompare(b.data().name);
					})
					.map((e) => (
						<Link
							key={e.id}
							to={`edit/${e.id}`}
							style={{ textDecoration: 'none' }}
						>
							<Stack key={e.id} align="center" gap={5}>
								<User2Icon
									size={140}
									color={theme.colors.gray[6]}
									style={{ display: 'block' }}
								/>
								<Stack gap={0}>
									<Text c="black" align="center">
										{e.data().name}
									</Text>
									<Text c="gray.5" fz="xs" align="center">
										(Level {e.data().level})
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
