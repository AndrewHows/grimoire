import {
	Box,
	Button,
	ComboboxChevron,
	Drawer,
	Group,
	NavLink,
	Select as SelectBase,
	Stack,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import classes from './select.module.css';
import { useIsMobile } from '@/hooks/mobile';

export const Select = ({ data, value, placeholder, onChange, ...props }) => {
	const [isOpen, { open, close }] = useDisclosure(false);
	const mobile = useIsMobile();

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
					{data.map(({ label, value: v }) => {
						return (
							<NavLink
								fz="lg"
								key={v}
								classes={classes}
								active={v === value}
								onClick={() => {
									onChange(v);
									close();
								}}
								label={
									<Group gap="lg">
										<Box>{label}</Box>
									</Group>
								}
							/>
						);
					})}
				</Stack>
			</Drawer>
			<Button
				p="6"
				pl="12"
				variant="filled"
				bg="white"
				c="black"
				fw="normal"
				onClick={open}
			>
				<Group>
					<div>
						{data.find(({ value: v }) => v === value).label ?? placeholder}
					</div>
					<ComboboxChevron />
				</Group>
			</Button>
		</>
	) : (
		<SelectBase
			{...props}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			data={data}
		/>
	);
};
