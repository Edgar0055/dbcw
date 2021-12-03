import { useState, useEffect, } from 'react';
import { Link, } from 'react-router-dom';
import Pages from '../Pages';
import Table from '../Table';
import sensorsService from '../../services/SensorsService';

const Sensors = () => {
	const [items, setItems] = useState([]);
	const [count, setCount] = useState(0);
	const [error, setError] = useState(null);
	const [order, setOrder] = useState([['sensorId','desc']]);
	const [page,  setPage ] = useState(0);
	const [limit, setLimit] = useState(10);

	useEffect(async () => {
			const result = await sensorsService({
				page,
				limit,
				order,
			});
			const { items, count, error } = result;
			setItems(items);
			setCount(count);
			setError(error);
	}, [
		page,
		limit,
		order,
	]);

	if (error) {
			return String(error);
	}

	const bar = [ {
		td: { className: 'index' },
		title: `#`,
		render: ({ rowIndex }) => rowIndex + 1 + page * limit,
	}, {
		field: `sensorId`,
		onClick: true,
		td: { className: 'id' },
		title: `SensorId`,
	}, {
		field: `name`,
		onClick: true,
		td: { className: 'name' },
		title: `Name`,
	}, {
		field: `latitude`,
		onClick: true,
		td: { className: 'latitude' },
		title: `Latitude`,
		render: ({ item }) => Number(item).toFixed(5),
	}, {
		field: `longitude`,
		onClick: true,
		td: { className: 'longitude' },
		title: `Longitude`,
		render: ({ item }) => Number(item).toFixed(5),
	}, {
		field: `enabled`,
		onClick: true,
		td: { className: 'enabled' },
		title: `Enabled`,
		render: ({ item }) => (
			<span data-enabled={ item }>
				{ item ? 'ON' : 'OFF' }
			</span>
		),
	}, {
		title: `Actions`,
		td: { className: 'actions' },
		render: ({ items }) => (
			<>
				<Link to={`/sensor/${ items.sensorId }/`}>
					sensor
				</Link>
				&nbsp;|&nbsp;
				<Link to={`/statistic/${ items.sensorId }/`}>
					statistic
				</Link>
			</>
		),
	}, ];

	return (<div className="sensors">
		<Pages
			page={page}
			setPage={setPage}
			limit={limit}
			setLimit={setLimit}
			count={count}
		/>
		<Table
			bar={bar}
			items={items}
			order={order}
			setOrder={setOrder}
		/>
		<Pages
			page={page}
			setPage={setPage}
			limit={limit}
			setLimit={setLimit}
			count={count}
		/>
	</div>);
};

export default Sensors;
