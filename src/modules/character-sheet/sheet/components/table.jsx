import { Row } from './layout';
import global from '@/global.module.css';

export function Table({ name, values }) {
	return (
		<Row style={{ alignItems: 'center' }}>
			<div style={{ flex: 1 }}>{name}</div>
			{values.map((v, idx) => (
				<div
					key={idx}
					className={global.caveat}
					style={{ fontSize: '18px', width: '20px', textAlign: 'center' }}
				>
					{v}
				</div>
			))}
		</Row>
	);
}
