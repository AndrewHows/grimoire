import { NavLink, Stack, useMantineTheme } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';

import classes from './nav.module.css';
import { useMessages } from '@/hooks/messages';
import { useContext } from 'react';
import { Auth } from '@/contexts';
import { footer, main } from '@/nav';
import { UserIcon } from 'lucide-react';
import { useUserDocuments } from '@/hooks/firestore';
import { CHARACTER_COLLECTION } from '@/constants';

export const Nav = ({ onNavigate }) => {
	const { user } = useContext(Auth);
	const theme = useMantineTheme();
	const characters = useUserDocuments(CHARACTER_COLLECTION);

	const footerNav = footer(user);

	return (
		<Stack
			h="100%"
			style={{
				alignSelf: 'stretch',
				justifyContent: 'space-between',
			}}
		>
			<Stack gap="0">
				{main(user).map((props) => (
					<NavItem key={props.label} {...props} onNavigate={onNavigate} />
				))}
				{characters
					.sort((a, b) => {
						const nameDiff = a.data().name.localeCompare(b.data().name);
						if (nameDiff !== 0) return nameDiff;
						return a.data().level - b.data().level;
					})
					.map((c) => {
						return (
							<NavItem
								key={c.id}
								icon={UserIcon}
								label={
									<span>
										{c.data().name}{' '}
										<span style={{ color: theme.colors.gray[5] }}>
											(Level {c.data().level})
										</span>
									</span>
								}
								link={`/app/character/edit/${c.id}`}
								onNavigate={onNavigate}
							/>
						);
					})}
			</Stack>
			{footerNav.length > 0 && (
				<Stack gap="8">
					<Stack gap="0">
						{footer(user).map((props) => (
							<NavItem key={props.label} {...props} onNavigate={onNavigate} />
						))}
					</Stack>
				</Stack>
			)}
		</Stack>
	);
};

export const NavItem = ({
	label,
	link,
	icon: Icon,
	children,
	onNavigate,
	...props
}) => {
	const navigate = useNavigate();
	const location = useLocation();
	const theme = useMantineTheme();
	const messages = useMessages();

	if (link)
		return (
			<NavLink
				classNames={classes}
				active={link === location.pathname}
				onClick={() => {
					onNavigate?.();
					navigate(link);
				}}
				label={typeof label === 'string' ? messages[label]() : label}
				leftSection={Icon && <Icon strokeWidth="1.5" size="16" />}
				{...props}
			/>
		);

	if (children)
		return (
			<NavLink
				classNames={classes}
				active={link === location.pathname}
				defaultOpened={children?.some((c) => c.link === location.pathname)}
				label={messages[label]()}
				leftSection={Icon && <Icon strokeWidth={1.5} size={16} />}
				styles={{
					children: { padding: 0, backgroundColor: theme.colors.gray[0] },
				}}
			>
				{children.map((child) => (
					<NavItem key={child.label} {...child} onNavigate={onNavigate} />
				))}
			</NavLink>
		);
};
