import { Select } from '@/components/select';
import {
	actionOrder,
	featureGroups,
	getProp,
	usageOrder,
} from '@/modules/character-sheet/utils';
import {
	Accordion,
	Checkbox,
	Group,
	NumberInput,
	Stack,
	Textarea,
	TextInput,
} from '@mantine/core';
import { useState } from 'react';

const ElementAccordion = ({ elements, panel, onChange }) => {
	const [selection, setSelection] = useState(null);

	return (
		<Accordion value={selection} onChange={(s) => setSelection(s)}>
			{elements.map((element, idx) => {
				const key = `${element.name}-${idx}`;
				return (
					<Accordion.Item key={key} value={key}>
						<Accordion.Control>
							<Group fz="xs">
								<Checkbox
									size="xs"
									checked={!element.hide}
									onChange={() => {
										onChange(element.path, 'hide', !element.hide);
									}}
									onClick={(e) => {
										e.stopPropagation();
									}}
								/>
								{element.name}
							</Group>
						</Accordion.Control>
						{selection === key && (
							<Accordion.Panel bg="gray.2">
								<Stack>{panel(element)}</Stack>
							</Accordion.Panel>
						)}
					</Accordion.Item>
				);
			})}
		</Accordion>
	);
};

export const CharacterEditor = ({ data, onChange }) => {
	return (
		<Accordion transitionDuration={0}>
			<Accordion.Item value="features">
				<Accordion.Control>Features</Accordion.Control>
				<Accordion.Panel>
					<ElementAccordion
						onChange={onChange}
						elements={data.features}
						panel={(element) => (
							<Stack>
								<Select
									size="xs"
									label="Section"
									value={element.group}
									data={featureGroups}
									onChange={(val) => {
										onChange(element.path, 'group', val);
									}}
								/>
								<TextInput
									size="xs"
									label="Text"
									value={getProp(element, 'text') ?? ''}
									onChange={(e) =>
										onChange(element.path, 'text-override', e.target.value)
									}
								/>
							</Stack>
						)}
					/>
				</Accordion.Panel>
			</Accordion.Item>
			<Accordion.Item value="powers">
				<Accordion.Control>Powers</Accordion.Control>
				<Accordion.Panel>
					<ElementAccordion
						onChange={onChange}
						elements={data.powers}
						panel={(power) => (
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
						)}
					/>
				</Accordion.Panel>
			</Accordion.Item>
		</Accordion>
	);
};
