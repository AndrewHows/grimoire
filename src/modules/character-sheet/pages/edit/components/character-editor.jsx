import { Select } from '@/components/select';
import { Checkbox } from '@mantine/core';

export const CharacterEditor = ({ data, onChange }) => {
	return (
		<>
			<h3>Features</h3>
			<table style={{ fontSize: '12px' }}>
				<thead>
					<tr>
						<th
							style={{
								width: '100%',
							}}
						/>
						<th
							style={{
								minWidth: '10rem',
								fontWeight: 'normal',
								color: '#999999',
							}}
						>
							Group
						</th>
						<th
							style={{
								fontWeight: 'normal',
								color: '#999999',
							}}
						>
							Hide
						</th>
					</tr>
				</thead>
				<tbody>
					{data.features.map((f, idx) => (
						<tr key={`${f.name}-${idx}`}>
							<td>{f.name}</td>
							<td>
								<Select
									value={f.group}
									data={[
										{ label: 'Action Points', value: 'action-point' },
										{ label: 'Health', value: 'health' },
										{ label: 'Defences', value: 'defences' },
										{ label: 'Movement', value: 'movement' },
										{ label: 'Senses', value: 'senses' },
										{ label: 'Saves', value: 'saves' },
										{ label: 'None', value: '' },
									]}
									onChange={(val) => {
										onChange(f.path, 'group', val);
									}}
								/>
							</td>
							<td>
								<Checkbox
									checked={f.hide}
									onChange={() => {
										onChange(f.path, 'hide', !f.hide);
									}}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<h3>Powers</h3>
			<table style={{ fontSize: '12px' }}>
				<thead>
					<tr>
						<th
							style={{
								width: '100%',
							}}
						/>
						<th
							style={{
								minWidth: '10rem',
								fontWeight: 'normal',
								color: '#999999',
							}}
						>
							Weapon
						</th>
						<th
							style={{
								minWidth: '10rem',
								fontWeight: 'normal',
								color: '#999999',
							}}
						>
							Size
						</th>
						<th
							style={{
								fontWeight: 'normal',
								color: '#999999',
							}}
						>
							Hide
						</th>
					</tr>
				</thead>
				<tbody>
					{data.powers.map((p, idx) => (
						<tr key={`${p.name}-${idx}`}>
							<td>{p.name}</td>
							<td>
								{p.weapons && (
									<Select
										value={p.weapon}
										data={[
											{ label: 'None', value: '' },
											...p.weapons.map((weapon) => ({
												label: weapon.name,
												value: weapon.name,
											})),
										]}
										onChange={(val) => {
											onChange(p.path, 'weapon', val);
										}}
									/>
								)}
							</td>
							<td>
								<Select
									value={p.size}
									data={[
										{ label: 'Small', value: 'small' },
										{ label: 'Normal', value: '' },
									]}
									onChange={(val) => {
										onChange(p.path, 'size', val);
									}}
								/>
							</td>
							<td>
								<Checkbox
									checked={p.hide}
									onChange={() => {
										onChange(p.path, 'hide', !p.hide);
									}}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
};
