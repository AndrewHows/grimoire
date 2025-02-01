import {
	getProp,
	getWeaponTrait,
	processText,
} from '@/modules/character-sheet/utils';
import { Checkboxes } from './checkboxes';
import { Header } from './header';
import { Column, Row } from './layout';
import { useContext } from 'react';
import { Character } from '@/modules/character-sheet/components/sheet/context';
import { useMediaQuery } from '@mantine/hooks';
import { useMantineTheme } from '@mantine/core';

export function Power({ power }) {
	const { character } = useContext(Character);
	const theme = useMantineTheme();
	const isPrint = useMediaQuery('print');

	const background = {
		'At-Will': '#006700',
		Encounter: '#800200',
		Daily: '#7c7c7c',
		ritual: '#6F2DA8',
		Consumable: '#00308F',
	};

	const action = {
		'standard action': 'S',
		move: 'M',
		'minor action': 'm',
		'free action': 'F',
		'no action': '-',
		'opportunity action': 'O',
		'immediate interrupt': 'II',
		'immediate reaction': 'IR',
		ritual: 'R',
	};

	const size = {
		small: '10px',
		undefined: '12px',
	};

	let descriptor = 'Universal';
	if (power.usage === 'ritual') descriptor = 'Ritual';
	else if (power.class)
		descriptor = `${power.level ? `Level ${power.level}` : ''} ${
			power.class ?? ''
		} ${power.type ?? ''}`;

	return (
		<div
			style={{
				width: '253px',
				height: isPrint ? '380px' : '360px',
				border: '1px solid black',
				borderRadius: '5px',
				marginTop: '14px',
			}}
		>
			<Header
				style={{
					backgroundColor: background[getProp(power, 'usage')],
					marginTop: '-14px',
				}}
			>
				<Row style={{ justifyContent: 'space-between', gap: 0 }}>
					<div style={{ fontSize: '12px', paddingLeft: '15px' }}>
						<div
							style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}
						>
							{getProp(power, 'usage') !== 'At-Will' && (
								<Checkboxes
									qty={power.uses ?? 1}
									style={{
										width: '12px',
										height: '12px',
										borderColor: 'white',
										borderWidth: '2px',
									}}
								/>
							)}
							<div
								style={{
									maxWidth: '150px',
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									lineHeight: '31px',
								}}
							>
								{getProp(power, 'name')}
							</div>
						</div>
					</div>
					<div
						style={{
							marginRight: '15px',
							width: '20px',
							height: '20px',
							marginTop: '2px',
							fontFamily:
								'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
							fontSize: '10px',
							fontWeight: 'bold',
							lineHeight: '18px',
							border: '2px solid white',
							borderRadius: '100%',
							letterSpacing: 0,
						}}
					>
						{action[getProp(power, 'action')]}
					</div>
				</Row>
			</Header>
			<Column
				style={{
					alignContent: 'space-between',
					gap: 0,
					height: 'calc(100% - 21px)',
				}}
			>
				<Column
					style={{
						padding: '0 1rem',
						gap: '0.25rem',
						fontSize: size[power.size],
						overflow: 'hidden',
					}}
				>
					{getProp(power, 'keywords') && (
						<div style={{ fontStyle: 'italic' }}>
							{getProp(power, 'keywords')}
						</div>
					)}
					{getProp(power, 'weapons')?.length > 0 && power.weapon !== '' && (
						<div>
							<strong>Weapon:</strong> {getWeaponTrait(power, 'name')}
						</div>
					)}
					{getProp(power, 'text')
						.filter(({ hide }) => !hide)
						.filter((line) => getProp(line, 'text') !== '')
						.map((line, idx) => (
							<div key={`${line.name}-${idx}`}>
								<strong>{getProp(line, 'name')}:</strong>{' '}
								{processText(getProp(line, 'text') ?? '', character, power)}
							</div>
						))}
				</Column>
				<div
					style={{
						backgroundColor: theme.colors.gray[3],
						borderTop: `1px solid ${theme.colors.gray[5]}`,
						color: theme.colors.gray[7],
						borderRadius: '0  0  5px 5px',
						padding: '0.25rem 0.5rem 0.125rem 0.5rem',
						fontSize: '9px',
						textTransform: 'uppercase',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
					}}
				>
					{descriptor}
				</div>
			</Column>
		</div>
	);
}
