import { toPng, toSvg } from 'html-to-image';
import {
	monsterVariants,
	powerRanges,
	skillAttributeMapping,
	usages,
} from '@/constants';
import { getAttributeMod } from '@/modules/characters/utils';
import { Box, Button, Group, Stack, Text, Title } from '@mantine/core';
import global from '@/global.module.css';
import { Markdown } from '@/components/markdown';
import { signed } from '@/utils';
import { attributeOrder } from '@/modules/characters/components/sheet/sections/attributes';
import { Token } from '@/modules/monsters/component/token';
import { useRef } from 'react';

const getLevelMod = (statblock, attr) => {
	return Math.floor(statblock.level / 2) + getAttributeMod(statblock[attr]);
};

const getXp = (level, variant) => {
	const xpRewards = [
		0, 100, 125, 150, 175, 200, 250, 300, 350, 400, 500, 600, 700, 800, 1000,
		1200, 1400, 1600, 2000, 2400, 2800, 3200, 4150, 5100, 6050, 7000, 9000,
		11000, 13000, 15000, 19000, 23000, 27000, 31000, 39000, 47000, 55000, 63000,
		79000, 95000, 111000,
	];
	return (
		xpRewards[level] *
		(monsterVariants.find(({ name }) => name === variant)?.xpMultiplier ?? 1)
	);
};

const getSkill = (statblock, skill) => {
	const attr = Object.entries(skillAttributeMapping)
		.find(([_, skills]) => skills.includes(skill))[0]
		.toLowerCase();

	return (
		getLevelMod(statblock, attr) + (statblock.skills?.includes(skill) ? 5 : 0)
	);
};

export const StatBlock = ({ monster }) => {
	const ref = useRef();

	return (
		<Stack>
			<Stack style={{ width: '500px' }} gap={0} ref={ref}>
				<Group
					bg="olive-green.7"
					style={{
						color: '#FFFFFF',
						width: '100%',
					}}
					p={10}
					gap={15}
				>
					<Token monster={monster} size="md" />
					<Stack style={{ flex: 1 }} gap="0">
						<Group justify="space-between" align="end">
							<Title order={4}>{monster.name}</Title>
							<Title order={4}>
								Level {monster.level}{' '}
								{monster.variant !== 'Normal' ? monster.variant : ''}{' '}
								{monster.role}
							</Title>
						</Group>
						<Group justify="space-between" align="start">
							<Text>
								{monster.size} {monster.origin?.toLowerCase()}{' '}
								{monster.type?.toLowerCase()}{' '}
								{monster.keywords && `(${monster.keywords})`}
							</Text>
							<Text>
								XP {getXp(monster.level, monster.variant).toLocaleString()}
							</Text>
						</Group>
					</Stack>
				</Group>
				<Box px={10} bg="parchment.0" p="10" fz="sm">
					<Group>
						<Text fz="sm">
							<strong>Initiative</strong>{' '}
							{signed(getLevelMod(monster, 'dexterity'))}
						</Text>
						<Text fz="sm">
							<strong>Senses</strong> Perception{' '}
							{signed(getSkill(monster, 'Perception'))}
							{monster.senses && `; ${monster.senses}`}
						</Text>
					</Group>
					<Group>
						<Text fz="sm">
							<strong>HP</strong> {monster.hp};
						</Text>
						<Text fz="sm">
							<strong>Bloodied</strong> {monster.bloodied}
						</Text>
					</Group>
					<Group>
						<Text fz="sm">
							<strong>AC</strong> {monster.ac};
						</Text>
						<Text fz="sm">
							<strong>Fortitude</strong> {monster.fort};
						</Text>
						<Text fz="sm">
							<strong>Reflex</strong> {monster.ref};
						</Text>
						<Text fz="sm">
							<strong>Will</strong> {monster.will}
						</Text>
					</Group>
					<Group>
						{monster.immune && (
							<Text fz="sm">
								<strong>Immune</strong> {monster.immune}
							</Text>
						)}
						{monster.resist && (
							<Text fz="sm">
								<strong>Resist</strong> {monster.resist}
							</Text>
						)}
						{monster.vulnerable && (
							<Text fz="sm">
								<strong>Vulnerable</strong> {monster.vulnerable}
							</Text>
						)}
					</Group>
					{monster.saves > 0 && (
						<Text fz="sm">
							<strong>Saving Throws</strong> {signed(monster.saves)}
						</Text>
					)}
					<Text fz="sm">
						<strong>Speed</strong> {monster.speed}
					</Text>
					{monster.actionPoints > 0 && (
						<Text fz="sm">
							<strong>Action Points</strong> {monster.actionPoints}
						</Text>
					)}
				</Box>
				{monster?.powers?.map((power) => {
					const range = powerRanges.find(({ name }) => name === power.range);
					const usage = usages.find(({ name }) => name === power.usage);
					const statline = [];
					if (power.action && power.action !== 'No Action')
						statline.push(power.action?.replace(' Action', '').toLowerCase());
					if (power.condition) statline.push(power.condition);
					if (power.usage) statline.push(power.usage?.toLowerCase());

					return (
						<Stack key={power.name} gap="0">
							<Box bg="parchment.5" p="10">
								<Text size="sm">
									<strong>
										<span style={{ fontSize: '12px' }} className={global.icons}>
											{power['range-Basic']
												? range?.icon.toLowerCase()
												: range?.icon}
										</span>{' '}
										{power.name}
									</strong>
									{(statline.length > 0 || power.keywords?.length > 0) && (
										<>
											{' '}
											({statline.join('; ')}
											{usage?.options?.includes('Condition') && (
												<>
													{' '}
													{!isNaN(power['usage-Condition']) ? (
														<span
															style={{ fontSize: '12px' }}
															className={global.icons}
														>
															{'123456'
																.split('')
																.map((i) => parseInt(i))
																.filter(
																	(i) => i >= parseInt(power['usage-Condition'])
																)
																.join('')}
														</span>
													) : (
														power['usage-Condition']
													)}
												</>
											)}
											{power.keywords && (
												<strong>
													{statline.length > 0 && (
														<>
															{' '}
															<span className={global.icons}>•</span>{' '}
														</>
													)}
													{power.keywords}
												</strong>
											)}
											)
										</>
									)}
								</Text>
							</Box>
							<Box px={10} bg="parchment.0" p="10" fz="sm">
								<Markdown style={{ margin: 0, display: 'inline' }}>
									{`${
										power.range !== 'Melee' ||
										(Boolean(power['range-Distance']) &&
											power['range-Distance'] !== 1)
											? range?.render?.(
													Object.fromEntries(
														Object.entries(power)
															.filter(([k]) => k.startsWith('range-'))
															.map(([k, v]) => [k.slice(6), v])
													)
											  ) ?? ''
											: ''
									}${power.effect}`}
								</Markdown>
							</Box>
						</Stack>
					);
				})}
				<Stack bg="parchment.5" p="10" gap="5">
					<Group>
						<Text fz="sm">
							<strong>Alignment</strong> {monster.alignment}
						</Text>
						<Text fz="sm">
							<strong>Languages</strong> {monster.languages ?? '-'}
						</Text>
					</Group>
					{monster.skills.length > 0 && (
						<Group>
							<Text fz="sm">
								<strong>Skills</strong>{' '}
								{monster.skills
									.map((s) => `${s}: ${signed(getSkill(monster, s))}`)
									.join(', ')}
							</Text>
						</Group>
					)}
				</Stack>
				<Group bg="parchment.0" p="10" gap={5}>
					{attributeOrder.map((attr) => (
						<Text size="sm" key={attr} style={{ flex: 1, minWidth: '30%' }}>
							<strong>{attr.slice(0, 3)}</strong> {monster[attr.toLowerCase()]}{' '}
							({signed(getAttributeMod(monster[attr.toLowerCase()]))})
						</Text>
					))}
				</Group>
			</Stack>
			<Group>
				<Button
					onClick={() =>
						toPng(ref.current).then(function (dataUrl) {
							const link = document.createElement('a');
							link.download = `${monster.name}.png`;
							link.href = dataUrl;
							document.body.appendChild(link);
							link.click();
							document.body.removeChild(link);
						})
					}
				>
					As PNG
				</Button>
				<Button
					onClick={() =>
						toSvg(ref.current).then(function (dataUrl) {
							const link = document.createElement('a');
							link.download = `${monster.name}.svg`;
							link.href = dataUrl;
							document.body.appendChild(link);
							link.click();
							document.body.removeChild(link);
						})
					}
				>
					As SVG
				</Button>
			</Group>
		</Stack>
	);
};
