import { Link } from 'react-router-dom';
import { useParties } from '@/modules/characters/hooks/characters';
import { Group, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import { Portrait } from '@/modules/characters/components/sheet/sections/portrait';
import { PlusCircleIcon, User2Icon } from 'lucide-react';
import { useFeature } from '@/modules/feature-flags/hooks/feature';
import { CHARACTER_COLLECTION } from '@/constants';
import { useUserDocuments } from '@/hooks/firestore';

export const CharacterList = () => {
	const characters = useUserDocuments(CHARACTER_COLLECTION);
	const theme = useMantineTheme();
	const showParties = useFeature('parties');
	const parties = useParties();

	return (
		<Stack>
			{showParties && (
				<>
					<Title order={3}>Parties</Title>
					<Group align="start">
						{parties?.map((party) => {
							const portraits = party.characters.filter(
								(c) => c.data().portrait
							);
							return (
								<Link
									key={party.id}
									to={`party/${party.id}`}
									style={{ textDecoration: 'none' }}
								>
									<Stack>
										<div
											style={{
												position: 'relative',
												height: '230px',
												width: 80 + portraits.length * 150,
											}}
										>
											{portraits.map((c, idx) => (
												<Portrait
													key={c.id}
													character={c.data()}
													style={{
														position: 'absolute',
														left: idx * 150,
													}}
												/>
											))}
										</div>
										<Text align="center" c="black">
											{party.data().name}
										</Text>
									</Stack>
								</Link>
							);
						})}
						<Link to="party" style={{ textDecoration: 'none' }}>
							<PlusCircleIcon
								size={230}
								color={theme.colors.gray[6]}
								style={{ display: 'block' }}
							/>
						</Link>
					</Group>
				</>
			)}
			<Title order={3}>Characters</Title>
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
				<Link to="edit" style={{ textDecoration: 'none' }}>
					<PlusCircleIcon
						size={230}
						color={theme.colors.gray[6]}
						style={{ display: 'block' }}
					/>
				</Link>
			</Group>
		</Stack>
	);
};
