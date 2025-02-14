import { Character } from '@/modules/characters/components/sheet/context';
import { getProp, processText } from '@/modules/characters/utils';
import { useContext } from 'react';

export function KeyValues({ values, style }) {
	if (values.length === 0) return null;
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '0.25rem',
				...style,
			}}
		>
			{values?.map((v, idx) => (
				<KeyValue key={`${v.name}-${idx}`} value={v} />
			))}
		</div>
	);
}

export function KeyValue({ value }) {
	const { character } = useContext(Character);

	return (
		<div>
			<strong>{getProp(value, 'name')}:</strong>{' '}
			{processText(getProp(value, 'text'), character)}
		</div>
	);
}
