import { Token } from '@/modules/monsters/component/token';
import { Group, Text, Title } from '@mantine/core';

export const MonsterEntry = ({ entry, monster, count, index }) => {
	return (
		<>
			<Group py="xs" px={0}>
				<Token
					monster={monster.data()}
					size="sm"
					count={count}
					index={index}
					draggable
				/>
				<Group justify="space-between" style={{ flex: 1 }}>
					<Title order={6}>{monster.data().name}</Title>
					<Text fz="xs">
						Level {monster.data().level}{' '}
						{monster.data().variant !== 'Normal' ? monster.data().variant : ''}
					</Text>
				</Group>
			</Group>
		</>
	);
};
