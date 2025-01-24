import { LANGUAGES, PROFILE_COLLECTION } from '@/constants';
import { Auth, Language } from '@/contexts';
import {
	Box,
	Button,
	Drawer,
	Group,
	Menu,
	NavLink,
	Stack,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useCallback, useContext } from 'react';

import classes from './nav.module.css';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { useIsMobile } from '@/hooks/mobile';
import { firebase } from '@/lib/firebase';

const firestore = getFirestore(firebase);

export const LanguageMenu = () => {
	const [isOpen, { open, close }] = useDisclosure(false);
	const { language, setLanguage } = useContext(Language);
	const { user } = useContext(Auth);
	const mobile = useIsMobile();

	const onSetLanguage = useCallback((lang) => {
		setLanguage(lang);
		if (user) {
			updateDoc(doc(firestore, PROFILE_COLLECTION, user.uid), {
				language: lang,
			});
		}
		close();
	}, []);

	const selectedLanguage =
		LANGUAGES.find(
			({ code }) => code === (user?.profile?.language ?? language)
		) ??
		LANGUAGES.find(
			({ code }) => code === (user?.profile?.language ?? language).split('-')[0]
		) ??
		LANGUAGES[0];

	return mobile ? (
		<>
			<Drawer
				opened={isOpen}
				onClose={close}
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
					{LANGUAGES.map((lang) => (
						<NavLink
							fz="lg"
							key={lang.code}
							classes={classes}
							active={lang.code === selectedLanguage.code}
							onClick={() => onSetLanguage(lang.code)}
							label={
								<Group gap="lg">
									<Box fz="lg">{lang.icon}</Box>
									<Box>{lang.name}</Box>
								</Group>
							}
						/>
					))}
				</Stack>
			</Drawer>
			<Button c="gray.0" p="6" fz="lg" variant="transparent" onClick={open}>
				{selectedLanguage.icon}
			</Button>
		</>
	) : (
		<Menu position="bottom-end">
			<Menu.Target>
				<Button c="gray.0" p="6" fz="lg" variant="transparent">
					{selectedLanguage.icon}
				</Button>
			</Menu.Target>
			<Menu.Dropdown>
				{LANGUAGES.map((lang) => (
					<Menu.Item
						fz="lg"
						key={lang.code}
						onClick={() => onSetLanguage(lang.code)}
					>
						<Group gap="lg">
							<Box fz="lg">{lang.icon}</Box>
							<Box fz="sm">{lang.name}</Box>
						</Group>
					</Menu.Item>
				))}
			</Menu.Dropdown>
		</Menu>
	);
};
