import { Table } from './table';

export function Attribute({ name, value }) {
	const mod = Math.floor((value - 10) / 2);
	return <Table name={name} values={[value, mod < 0 ? mod : `+${mod}`]} />;
}
