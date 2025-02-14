import { mm3, setValue } from '@/modules/monsters/pages/edit/utils';
import {
	Button,
	MultiSelect,
	NumberInput,
	Select,
	Stack,
	Textarea,
	TextInput,
} from '@mantine/core';
import { useMemo } from 'react';

export const Field = ({ value, set, type, name, options, style, ...props }) => {
	return useMemo(() => {
		props = {
			label: name,
			size: 'xs',
			onChange: (e) => setValue({ value, set }, e),
			value,
			...props,
		};
		style = {
			flex: 1,
			...style,
		};
		if (type === 'number') {
			return (
				<NumberInput
					min={1}
					value={value ?? 0}
					style={{ width: '5rem', ...style }}
					{...props}
				/>
			);
		} else if (type === 'select') {
			return (
				<Select
					data={options.map((o) => {
						const val = typeof o === 'string' ? o : o.name;
						return { label: val, value: val };
					})}
					style={style}
					{...props}
				/>
			);
		} else if (type === 'multiselect') {
			return (
				<MultiSelect
					data={options.map((o) => {
						const val = typeof o === 'string' ? o : o.name;
						return { label: val, value: val };
					})}
					value={value ?? []}
					style={style}
					{...props}
				/>
			);
		} else if (type === 'textarea') {
			return <Textarea value={value ?? ''} style={style} {...props} />;
		}

		return <TextInput value={value ?? ''} style={style} {...props} />;
	}, [value]);
};

export const CalculatedField = ({
	state,
	calc,
	field,
	ruleset,
	style,
	...props
}) => {
	if (!ruleset) ruleset = mm3;

	const monster = Object.fromEntries(
		Object.entries(state).map(([key, { value }]) => [key, value])
	);
	const value = calc ? calc(ruleset) : ruleset[field](monster);

	return (
		<Stack style={{ flex: 1 }} gap={5}>
			<Field {...state[field]} style={{ width: 'auto', ...style }} {...props} />
			<Button
				size="xs"
				style={{ height: 'auto' }}
				p="4"
				onClick={() => state[field].set(value)}
			>
				MM3: {value}
			</Button>
		</Stack>
	);
};
