import { Table } from './table';

export function Skill({ name, value, trained }) {
	return (
		<Table
			name={trained ? <strong>{name}</strong> : name}
			values={[trained ? <strong key={name}>{value}</strong> : value]}
		/>
	);
}
