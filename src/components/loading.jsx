import { Group, Loader } from '@mantine/core';

export const Loading = (props) => {
	return (
		<Group justify="center" miw="100%" {...props}>
			<Loader />
		</Group>
	);
};
