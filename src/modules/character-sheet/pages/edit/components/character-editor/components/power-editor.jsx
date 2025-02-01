import { CharacterEditorContext } from '@/modules/character-sheet/pages/edit/components/character-editor/context';
import {
	actionOrder,
	getProp,
	usageOrder,
} from '@/modules/character-sheet/utils';
import { Group, NumberInput, Select, Textarea } from '@mantine/core';
import { useContext } from 'react';

export const PowerEditor = ({ power }) => {
	const { onChange } = useContext(CharacterEditorContext);

	return (
		<>
			<Group>
				{power.weapons && (
					<Select
						size="xs"
						label="Weapon"
						value={power.weapon}
						data={[
							{ label: 'None', value: '' },
							...power.weapons.map((weapon) => ({
								label: weapon.name,
								value: weapon.name,
							})),
						]}
						onChange={(val) => {
							onChange(power.path, 'weapon', val);
						}}
					/>
				)}
				<Select
					label="Size"
					size="xs"
					value={power.size}
					data={[
						{ label: 'Small', value: 'small' },
						{ label: 'Normal', value: '' },
					]}
					onChange={(val) => {
						onChange(power.path, 'size', val);
					}}
					style={{ maxWidth: '6rem' }}
				/>
				<Select
					label="Action"
					size="xs"
					value={getProp(power, 'action')}
					data={actionOrder.map((a) => ({
						label: a,
						value: a.toLowerCase(),
					}))}
					onChange={(val) => {
						onChange(power.path, 'action-override', val);
					}}
					style={{ maxWidth: '7rem' }}
				/>
				<Select
					label="Usage"
					size="xs"
					value={getProp(power, 'usage')}
					data={usageOrder.map((a) => ({ label: a, value: a }))}
					onChange={(val) => {
						onChange(power.path, 'usage-override', val);
					}}
					style={{ maxWidth: '7rem' }}
				/>
				{power.usage !== 'At-Will' && (
					<NumberInput
						size="xs"
						label="Uses"
						min={1}
						value={power.uses ?? ''}
						onChange={(val) => onChange(power.path, 'uses', val)}
						style={{ maxWidth: '4rem' }}
					/>
				)}
			</Group>
			{power.text.map((line, idx) => (
				<Textarea
					key={`${line.name}-${idx}`}
					size="xs"
					label={line.name}
					value={getProp(line, 'text')}
					onChange={(e) =>
						onChange(
							[...power.path, 'text', idx],
							'text-override',
							e.target.value
						)
					}
				/>
			))}
		</>
	);
};
