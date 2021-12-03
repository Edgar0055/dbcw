import { useState, useEffect, } from 'react';
import { Link, useParams, } from 'react-router-dom';
import * as luxon from 'luxon';
import Pages from '../Pages';
import Table from '../Table';
import statisticService from '../../services/StatisticService';


const Statistic = () => {
	const { sensorId } = useParams();
	const [items, setItems] = useState([]);
	const [count, setCount] = useState(0);
	const [error, setError] = useState(null);
	const [order, setOrder] = useState([['statisticId','desc']]);
	const [page,  setPage ] = useState(0);
	const [limit, setLimit] = useState(50);

	useEffect(async () => {
			const result = await statisticService({
					page,
					limit,
					order,
					sensorIds: sensorId,
					sensor: true,
			});
			const { items, count, error } = result;
			setItems(items);
			setCount(count);
			setError(error);
	}, [
		order,
		page,
		limit,
		sensorId,
	]);

	if (error) {
			return String(error);
	}

	const bar = [ {
		td: { className: 'index' },
		title: `#`,
		render: ({ rowIndex }) => rowIndex + 1 + page * limit,
	}, {
		field: `statisticId`,
		onClick: true,
		td: { className: 'id' },
		title: `StatisticId`,
	}, {
		field: `sensorId`,
		onClick: true,
		td: { className: 'id' },
		title: `SensorId`,
	}, {
		field: `sensor.name`,
		onClick: true,
		td: { className: 'name' },
		title: `Name`,
		render: ({ item }) => item,
	}, {
		field: `created`,
		onClick: true,
		td: { className: 'created' },
		title: `Created`,
		render: ({ item }) => luxon.DateTime.fromISO(item).toHTTP(),
	}, {
		field: `value`,
		onClick: true,
		td: { className: 'value' },
		title: `Value`,
		render: ({ item, items }) => `${item }${ items.unit}`,
	}, {
		field: `sensor.latitude`,
		onClick: true,
		td: { className: 'latitude' },
		title: `Latitude`,
		render: ({ item }) => Number(item).toFixed(5),
	}, {
		field: `sensor.longitude`,
		onClick: true,
		td: { className: 'longitude' },
		title: `Longitude`,
		render: ({ item }) => Number(item).toFixed(5),
	}, {
		field: `sensor.enabled`,
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

	return (<div className="statistic">
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

export default Statistic;
