import {
	onSnapshot,
	query as queryDb,
	limit as limitDb,
	orderBy,
} from 'firebase/firestore';
import { useCallback, useState } from 'react';

export class KeyedArray extends Array {
	constructor(field, ...items) {
		super(...items);
		this.keyField = field;
	}

	get(key) {
		return this.find((i) => i[this.keyField] === key);
	}

	getIndex(key) {
		return this.findIndex((i) => i[this.keyField] === key);
	}

	slice(start, end) {
		return new KeyedArray(this.keyField, ...super.slice(start, end));
	}

	withSet(key, data) {
		return new KeyedArray(
			this.keyField,
			...(this.get(key) === undefined
				? new KeyedArray(this.keyField, ...this, data)
				: this.map((i) => (i[this.keyField] === key ? data : i)))
		);
	}

	withRemoved(key) {
		return new KeyedArray(
			this.keyField,
			...this.filter((i) => {
				return i[this.keyField] !== key;
			})
		);
	}
}

export const FirestoreRegistry = ({ context, children }) => {
	const [queries, setQueries] = useState({});
	const [data, setData] = useState({});
	const [listeners, setListeners] = useState({});

	const createListener = (key, query, limit, page) => {
		return onSnapshot(
			queryDb(
				...[
					...query,
					orderBy('__name__'),
					limit && page && data[[key]] ? data[key].slice(-1)[0].id : null,
					limit ? limitDb(limit) : null,
				].filter(Boolean)
			),
			(qs) => {
				qs.docChanges().forEach((change) => {
					if (change.type === 'removed') {
						setData((d) => {
							const data = {
								...d,
								[key]: d[key].withRemoved(change.doc.id),
							};
							return data;
						});
					} else if (['added', 'modified'].includes(change.type)) {
						setData((d) => {
							const newData = {
								...d,
								[key]: d[key]
									? d[key].withSet(change.doc.id, change.doc)
									: new KeyedArray('id', change.doc),
							};
							return newData;
						});
					}
				});
			}
		);
	};

	const registerQuery = useCallback((key, query, config) => {
		const { limit, page } = config ?? {};
		if (
			!queries[key] ||
			JSON.stringify(queries[key].query) !== JSON.stringify(query) ||
			queries[key].limit !== limit ||
			queries[key].page !== page
		) {
			setQueries({ ...queries, [key]: { query, limit, page } });
			if (!query) return null;
			setListeners({
				...listeners,
				[key]: createListener(key, query, limit, page),
			});
			if (data[key]) {
				setData(
					Object.fromEntries(
						Object.entries(data).filter(([qKey]) => qKey !== key)
					)
				);
			}
		}
	});

	const unregisterQuery = useCallback((key) => {
		if (queries[key])
			setQueries({
				...Object.fromEntries(
					Object.entries(queries).filter(([qKey]) => qKey !== key)
				),
			});
		if (listeners[key]) {
			listeners[key]();
			setListeners(
				Object.fromEntries(
					Object.entries(listeners).filter(([qKey]) => qKey !== key)
				)
			);
		}
		if (data[key]) {
			setData(
				Object.fromEntries(
					Object.entries(data).filter(([qKey]) => qKey !== key)
				)
			);
		}
	});

	const page = useCallback((key) => {
		const page = (queries[key]?.page ?? 0) + 1;
		const { query, limit } = queries[key];
		setQueries({
			...queries,
			[key]: { query, limit, page },
		});
		listeners[key]?.();
		listeners[key] = createListener(key, query, limit, page);
	});

	const hasMore = Object.fromEntries(
		Object.entries(queries).map(([key, q]) => [
			key,
			q.limit
				? (data[key]?.length ?? 0) >= ((q.page ?? 0) + 1) * (q.limit ?? 0)
				: false,
		])
	);

	const Context = context;

	return (
		<Context.Provider
			value={{
				registerQuery,
				unregisterQuery,
				page,
				data,
				queries,
				hasMore,
			}}
		>
			{children}
		</Context.Provider>
	);
};

