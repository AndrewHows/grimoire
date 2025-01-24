import { Checkboxes } from './checkboxes';
import { Header } from './header';
import { Column, Row } from './layout';

function getWeapon(power, attribute) {
	return (
		(power.weapon
			? power.weapons.find(({ name }) => name === power.weapon)
			: power.weapons?.[0])?.[attribute] ?? ''
	);
}

export function Power({ power }) {
	const background = {
		'At-Will': '#006700',
		Encounter: '#800200',
		Daily: '#7c7c7c',
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
	};

	const size = {
		small: '10px',
		undefined: '12px',
	};

	return (
		<div
			style={{
				width: '238px',
				height: '334px',
				border: '1px solid black',
				borderRadius: '5px',
				marginTop: '14px',
			}}
		>
			<Header
				style={{ backgroundColor: background[power.usage], marginTop: '-14px' }}
			>
				<Row style={{ justifyContent: 'space-between', gap: 0 }}>
					<div style={{ fontSize: '12px', paddingLeft: '15px' }}>
						<div
							style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}
						>
							{power.usage !== 'At-Will' && (
								<Checkboxes
									qty={power.uses}
									style={{
										width: '12px',
										height: '12px',
										borderColor: 'white',
										borderWidth: '2px',
									}}
								/>
							)}
							{power.name}
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
							fontSize: '12px',
							fontWeight: 'bold',
							lineHeight: '18px',
							border: '2px solid white',
							borderRadius: '100%',
						}}
					>
						{action[power.action]}
					</div>
				</Row>
			</Header>
			<Column
				style={{
					padding: '0 1rem',
					gap: '0.25rem',
					fontSize: size[power.size],
				}}
			>
				{power.keywords && (
					<div style={{ fontStyle: 'italic' }}>
						{power['keywords-override'] ?? power.keywords}
					</div>
				)}
				{power.weapons?.length > 0 && power.weapon !== '' && (
					<div>
						<strong>Weapon:</strong> {getWeapon(power, 'name')}
					</div>
				)}
				{(power['text-override'] ?? power.text).map((line, idx) => (
					<div key={`${line.name}-${idx}`}>
						<strong>{line['name-override'] ?? line.name}:</strong>{' '}
						{(line['text-override'] ?? line.text ?? '')
							.replaceAll('<attack>', `+${getWeapon(power, 'attack')}`)
							.replaceAll('<damage>', getWeapon(power, 'damage'))}
					</div>
				))}
			</Column>
		</div>
	);
}
