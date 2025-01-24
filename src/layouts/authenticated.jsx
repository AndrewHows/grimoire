import { AppBar } from '@/components/app-bar';
import { CONTENT_WIDTH } from '@/constants';
import { Group, Stack } from '@mantine/core';
import { Outlet } from 'react-router-dom';

export const AuthenticatedLayout = () => {
	return (
		<Stack mih="100vh" mah="100vh" gap="0" flex>
			<AppBar />
			<div
				style={{
					display: 'grid',
					maxHeight: '100%',
					overflow: 'hidden',
					flexGrow: 1,
				}}
			>
				<Group
					w="100%"
					mah="100%"
					maw={CONTENT_WIDTH}
					style={{
						justifySelf: 'center',
						flexGrow: 1,
						alignItems: 'start',
						overflow: 'hidden',
					}}
					gap="0"
					wrap="nowrap"
				>
					<div
						style={{
							overflow: 'auto',
							flexGrow: 1,
							display: 'flex',
							minHeight: '100%',
							maxHeight: '100%',
						}}
					>
						<div
							style={{
								padding: '1rem',
								display: 'flex',
								flexGrow: 1,
							}}
						>
							<Outlet />
						</div>
					</div>
				</Group>
			</div>
		</Stack>
	);
};
