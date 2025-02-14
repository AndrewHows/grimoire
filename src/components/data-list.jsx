import { useMessages } from '@/hooks/messages';
import {
	collection as dbCollection,
	getFirestore,
	where,
} from 'firebase/firestore';
import { DataTable } from 'mantine-datatable';
import { useCallback, useContext, useEffect, useState } from 'react';
import { PAGE_SIZE } from '@/constants';
import { InfoBox } from '@/components/info-box';
import { Button, Group, Stack } from '@mantine/core';
import { Firestore } from '@/contexts';
import { SearchBar } from '@/components/search-bar';
import { trigram } from 'n-gram';
import { Modal } from '@/components/modal';
import { firebase } from '@/lib/firebase';

const firestore = getFirestore(firebase);

export const DataList = ({
	label,
	titleField,
	collection,
	columns,
	transformResults,
	getUpdateModalContent,
	...props
}) => {
	const messages = useMessages();
	const [openItem, setOpenItem] = useState();
	const { data, page, registerQuery, unregisterQuery, hasMore } =
		useContext(Firestore);
	const [filter, setFilter] = useState('');
	const [sortStatus, setSortStatus] = useState({});
	const [currentPage, setCurrentPage] = useState(0);

	const getResultSetKey = (f) => `${collection}${f ? `-${f}` : ''}`;
	const resultSetKey = getResultSetKey(filter);
	const resultSet = data[resultSetKey];

	useEffect(() => {
		const query = [dbCollection(firestore, collection)];
		if (filter) {
			trigram(filter).forEach((n) =>
				query.push(where(`searchIndex.${n}`, '==', true))
			);
		}
		registerQuery(resultSetKey, query, {
			limit: PAGE_SIZE,
		});
	}, [filter]);

	const onSearch = useCallback(
		(f) => {
			if (getResultSetKey(f) !== resultSetKey) {
				unregisterQuery(resultSetKey);
				setFilter(f);
			}
		},
		[resultSetKey]
	);

	const prevDisabled = currentPage === 0;
	const nextDisabled =
		(currentPage + 1) * PAGE_SIZE > (data[resultSetKey]?.length ?? 0) &&
		!hasMore[resultSetKey];

	return (
		<Stack>
			<SearchBar onSearch={onSearch} />
			{(resultSet?.length ?? 0) > 0 ? (
				<>
					<DataTable
						withTableBorder
						highlightOnHover
						striped
						records={
							transformResults
								? transformResults(
										resultSet.slice(
											currentPage * PAGE_SIZE,
											(currentPage + 1) * PAGE_SIZE
										)
								  )
								: data
						}
						columns={columns}
						sortStatus={sortStatus}
						onSortStatusChange={setSortStatus}
						onRowClick={(row) => setOpenItem(row.record.id)}
						{...props}
					/>
					<Modal
						opened={Boolean(openItem)}
						onClose={() => setOpenItem(null)}
						title={`${label}: ${
							titleField ? resultSet[openItem]?.data()[titleField] : openItem
						}`}
						centered
					>
						{openItem &&
							getUpdateModalContent({
								item: openItem,
								close: () => setOpenItem(null),
							})}
					</Modal>
				</>
			) : (
				<InfoBox centered>{messages.noItems(label)}</InfoBox>
			)}
			{!(prevDisabled && nextDisabled) && (
				<Group>
					<Button
						disabled={prevDisabled}
						onClick={() => {
							setCurrentPage(currentPage - 1);
						}}
					>
						{messages.previous()}
					</Button>
					<Button
						disabled={nextDisabled}
						onClick={() => {
							setCurrentPage(currentPage + 1);
							if (hasMore[resultSetKey]) page(resultSetKey);
						}}
					>
						{messages.next()}
					</Button>
				</Group>
			)}
		</Stack>
	);
};
