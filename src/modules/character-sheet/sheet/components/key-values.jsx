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
	return (
		<div>
			<strong>{value['name-override'] ?? value.name}:</strong>{' '}
			{value['text-override'] ?? value.text}
		</div>
	);
}
