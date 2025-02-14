import { powerRanges, usages } from '@/constants';
import { actionOrder } from '@/modules/characters/utils';
import {
	CalculatedField,
	Field,
} from '@/modules/monsters/pages/edit/components/field';
import { diceToString, intToDice, signed } from '@/utils';
import {
	Button,
	Card,
	Checkbox,
	Group,
	InputLabel,
	InputWrapper,
	TextInput,
} from '@mantine/core';
import { XIcon } from 'lucide-react';

export const EditMonsterPower = ({ monster, power, onDelete, onUpdate }) => {
	return (
		<Card shadow="md" withBorder style={{ overflow: 'visible' }}>
			<Button
				style={{
					position: 'absolute',
					top: '-10px',
					left: '-10px',
					height: 'auto',
				}}
				size="xs"
				p="4"
				onClick={onDelete}
			>
				<XIcon size={14} />
			</Button>
			<Group>
				<Field
					name="Name"
					value={power.name ?? ''}
					onChange={(e) => onUpdate('name', e)}
				/>
				<Field
					type="select"
					name="Action"
					options={actionOrder}
					value={power.action ?? ''}
					onChange={(e) => onUpdate('action', e)}
				/>
				<Field
					type="text"
					name="Keywords"
					value={power.keywords ?? ''}
					onChange={(e) => onUpdate('keywords', e)}
				/>
			</Group>
			<Group wrap="none">
				<Group align="start" style={{ width: '50%' }}>
					<Field
						type="select"
						name="Range"
						options={powerRanges}
						value={power.range}
						onChange={(e) => onUpdate('range', e)}
					/>
					{powerRanges
						.find(({ name }) => name === power.range)
						?.options?.map((o) =>
							o === 'Basic' ? (
								<InputWrapper key={o} size="xs">
									<InputLabel>{o}</InputLabel>
									<Checkbox
										key={o}
										checked={power[`range-${o}`] ?? false}
										style={{ marginTop: '5px' }}
										onChange={(e) => onUpdate(`range-${o}`, e)}
									/>
								</InputWrapper>
							) : (
								<Field
									type="number"
									key={o}
									name={o}
									min={1}
									style={{ maxWidth: '3rem' }}
									value={power[`range-${o}`] ?? 1}
									onChange={(e) => onUpdate(`range-${o}`, e)}
								/>
							)
						)}
				</Group>
				<Group>
					<Field
						type="select"
						name="Usage"
						options={usages}
						value={power.usage}
						onChange={(e) => onUpdate('usage', e)}
						style={{ flexShrink: 1 }}
					/>
					{usages
						.find(({ name }) => name === power.usage)
						?.options?.map((o) => (
							<Field
								type="text"
								key={o}
								name={o}
								value={power[`usage-${o}`] ?? 1}
								onChange={(e) => onUpdate(`usage-${o}`, e)}
							/>
						))}
				</Group>
			</Group>
			<TextInput
				size="xs"
				label="Condition"
				value={power.condition ?? ''}
				onChange={(e) => onUpdate('condition', e)}
			/>
			<CalculatedField
				name="Text"
				type="textarea"
				state={{
					effect: { value: power.effect, set: (e) => onUpdate('effect', e) },
				}}
				field="effect"
				calc={(ruleset) =>
					`${signed(ruleset.accuracy(monster))} vs AC; ${diceToString(
						intToDice(ruleset.damage(monster, power))
					)} damage`
				}
				monster={monster}
			/>
		</Card>
	);
};
