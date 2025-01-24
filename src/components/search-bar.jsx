import { useMessages } from '@/hooks/messages';
import { Button, CloseButton, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { SearchIcon } from 'lucide-react';

export const SearchBar = ({ onSearch, placeholder }) => {
	const messages = useMessages();
	const form = useForm({
		mode: 'uncontrolled',
		initialValues: { filter: '' },
		validate: {
			filter: (v) =>
				v !== '' && v.length < 3 ? messages.filterMinimumLength() : null,
		},
	});

	return (
		<form onSubmit={form.onSubmit(({ filter }) => onSearch(filter))}>
			<Group gap="sm" align="start">
				<TextInput
					placeholder={placeholder ?? messages.filter()}
					style={{ flexGrow: 1 }}
					key={form.key('filter')}
					rightSection={
						<CloseButton
							onClick={() => {
								form.setValues({ filter: '' });
								onSearch('');
							}}
						/>
					}
					{...form.getInputProps('filter')}
				/>
				<Button px="6" variant="subtle" type="submit">
					<SearchIcon />
				</Button>
			</Group>
		</form>
	);
};
