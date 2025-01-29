import { CONTENT_WIDTH } from '@/constants';
import { Nav } from './nav';
import {
	Button,
	Card,
	Drawer,
	Group,
	Text,
	useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { AlignJustify } from 'lucide-react';
import { ProfileMenu } from '@/components/profile-menu';
import { LanguageMenu } from '@/components/language-menu';

export const AppBar = () => {
	const [navIsOpen, { open: openNav, close: closeNav }] = useDisclosure(false);
	const theme = useMantineTheme();

	return (
		<>
			<Drawer
				opened={navIsOpen}
				onClose={closeNav}
				position="left"
				size="xs"
				styles={{
					content: {
						display: 'flex',
						flexDirection: 'column',
					},
					body: { flexGrow: 1 },
				}}
			>
				<Nav onNavigate={closeNav} />
			</Drawer>
			<Card
				radius={0}
				padding={8}
				bg={`${theme.primaryColor}.9`}
				w="100vw"
				style={{
					overflow: 'visible',
					alignItems: 'center',
				}}
			>
				<Group
					maw={CONTENT_WIDTH}
					w="100%"
					style={{
						justifyContent: 'space-between',
					}}
				>
					<Group>
						<Button p="6" c="gray.0" variant="transparent" onClick={openNav}>
							<AlignJustify />
						</Button>
						<Text c="gray.0" fw="semibold">
							Grimoire
						</Text>
					</Group>
					<Group>
						<ProfileMenu />
					</Group>
				</Group>
			</Card>
		</>
	);
};
