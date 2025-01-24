import { NavItem } from '@/components/nav';
import { Auth } from '@/contexts';
import { useMessages } from '@/hooks/messages';
import { useIsMobile } from '@/hooks/mobile';
import { profile } from '@/nav';
import { Button, Drawer, Menu, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { User } from 'lucide-react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const ProfileMenu = () => {
	const [profileIsOpen, { open: openProfile, close: closeProfile }] =
		useDisclosure(false);
	const navigate = useNavigate();
	const mobile = useIsMobile();
	const messages = useMessages();
	const { user } = useContext(Auth);

	return mobile ? (
		<>
			<Drawer
				opened={profileIsOpen}
				onClose={closeProfile}
				position="bottom"
				size="lg"
				styles={{
					content: {
						display: 'flex',
						flexDirection: 'column',
					},
					body: { flexGrow: 1 },
				}}
			>
				<Stack gap="0">
					{profile(user).map(({ label, ...props }) => (
						<NavItem key={label} {...props} label={label} />
					))}
				</Stack>
			</Drawer>
			<Button c="gray.0" p="6" variant="transparent" onClick={openProfile}>
				<User />
			</Button>
		</>
	) : (
		<Menu position="bottom-end">
			<Menu.Target>
				<Button c="gray.0" p="6" variant="transparent">
					<User />
				</Button>
			</Menu.Target>
			<Menu.Dropdown>
				{profile(user).map(({ icon: Icon, label, link }) => (
					<Menu.Item
						key={label}
						miw="160"
						leftSection={<Icon strokeWidth={1.5} size={16} />}
						onClick={() => navigate(link)}
					>
						{messages[label]()}
					</Menu.Item>
				))}
			</Menu.Dropdown>
		</Menu>
	);
};
