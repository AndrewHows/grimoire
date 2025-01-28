import { Header } from './header';

export function Section({ label, children, style }) {
	return (
		<div style={{ ...style }}>
			<Header>{label}</Header>
			{children}
		</div>
	);
}
