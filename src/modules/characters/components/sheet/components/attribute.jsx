import { getAttributeMod } from '@/modules/characters/utils';
import { Table } from './table';

export function Attribute({ name, value, ...props }) {
	const mod = getAttributeMod(value);
	return (
		<Table name={name} values={[value, mod < 0 ? mod : `+${mod}`]} {...props} />
	);
}
