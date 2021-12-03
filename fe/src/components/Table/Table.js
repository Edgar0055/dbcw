const Table = ({
	bar = [],
	items = [],
	order,
	setOrder,
}) => {
	const match = (field) => ([f, ]) => f === field;
	const nomatch = (field) => ([f, ]) => f !== field;

	const orderIndex = (field, order) => {
		const index = order?.findIndex?.(match(field)) ?? [];
		return index < 0 ? '' : index + 1;
	};

	const ordered = (field, order) => {
		// eslint-disable-next-line no-unused-vars 
		const [f, t] = order?.find?.(match(field)) ?? [];
		return t;
	};

	const reorder = (field, order, setOrder) => () => {
		const T = {
			asc: 'desc',
			desc: undefined,
			undefined: 'asc',
		};
		const [f, t] = order?.find?.(match(field)) ?? [];
		const orderNew = [
			...T[t] ? [[field, T[t]]] : [],
			...f ? order?.filter?.(nomatch(field)) : order
		];
		setOrder(orderNew);
	};

	const TH = ({ field, title, td={}, onClick=false, }, index) => (
		<th
			key={ index }
			data-order-index={ orderIndex(field, order) }
			data-ordered={ ordered(field, order) }
			onClick={ onClick ? reorder(field, order, setOrder) : null }
			{ ...td }
		>
			{ title ?? field }
		</th>
	);

	const TD = (items, rowIndex) => ({ field, render, title, td, }, index) => (
		<td
			key={ index }
			data-title={ title ?? field }
			{ ...td }
		>
			{ render?.({ rowIndex, index, item: items[field], items, }) ?? items[field] }
		</td>
	);

	const TR = (item, key) => (
		<tr key={ key }>
			{ bar.map(TD(item, key)) }
		</tr>
	);

	return (
		<table className="table">
			<thead><tr>{ bar.map(TH) }</tr></thead>
			<tbody>{ items.map(TR) }</tbody>
		</table>
	);
};

export default Table;
