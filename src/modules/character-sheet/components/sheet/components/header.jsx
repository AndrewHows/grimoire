import global from '@/global.module.css';

export function Header({ children, style, ...props }) {
	return (
		<div
			{...props}
			style={{
				maskImage: 'url(/header-mask.png)',
				maskRepeat: 'no-repeat',
				width: '230px',
				margin: '0 auto',
				...props.style,
			}}
		>
			<label
				className={global.bobbi}
				style={{
					height: '35px',
					display: 'block',
					fontSize: '14px',
					textAlign: 'center',
					backgroundColor: 'black',
					color: 'white',
					lineHeight: '32px',
					...style,
				}}
			>
				{children}
			</label>
		</div>
	);
}
