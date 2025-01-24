import { useIsMobile } from '@/hooks/mobile';
import { Drawer, Modal as MantineModal } from '@mantine/core';

export const Modal = ({ centered, ...props }) => {
	const mobile = useIsMobile();

	return mobile ? (
		<Drawer {...props} position="bottom" />
	) : (
		<MantineModal
			{...props}
			centered={centered ?? false}
			styles={{
				title: { fontSize: '24px' },
			}}
		/>
	);
};
