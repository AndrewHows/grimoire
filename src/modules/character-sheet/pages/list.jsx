import { Link } from 'react-router-dom';
import { useCharacters } from '@/modules/character-sheet/hooks/characters';
import { Group, Stack, Text, useMantineTheme } from '@mantine/core';
import { Portrait } from '@/modules/character-sheet/components/sheet/sections/portrait';
import { PlusCircleIcon, User2Icon } from 'lucide-react';

export const CharacterList = () => {
	const characters = useCharacters();
	const theme = useMantineTheme();

	return (
		<Group align="top">
			{characters
				.sort((a, b) => {
					const nameDiff = a.data().name.localeCompare(b.data().name);
					if (nameDiff !== 0) return nameDiff;
					return a.data().level - b.data().level;
				})
				.map((c) => (
					<Stack key={c.id}>
						<Link to={`edit/${c.id}`} style={{ textDecoration: 'none' }}>
							{c.data().portrait ? (
								<Portrait character={c.data()} />
							) : (
								<User2Icon
									size={230}
									color={theme.colors.gray[6]}
									style={{ display: 'block' }}
								/>
							)}
							<Text align="center" c="black">
								{c.data().name}
							</Text>
							<Text align="center" c="gray.5" fz="xs">
								(Level {c.data().level})
							</Text>
						</Link>
					</Stack>
				))}
			<Stack>
				<Link to="edit" style={{ textDecoration: 'none' }}>
					<PlusCircleIcon
						size={230}
						color={theme.colors.gray[6]}
						style={{ display: 'block' }}
					/>
					<Text c="black" td="none" align="center">
						Create New
					</Text>
				</Link>
			</Stack>
		</Group>
	);
};
