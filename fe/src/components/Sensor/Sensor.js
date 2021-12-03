import { useState, useEffect, useMemo, } from 'react';
import { Link, useParams, } from 'react-router-dom';
import * as luxon from 'luxon';
import * as d3 from 'd3';
import Pages from '../Pages';
import Table from '../Table';
import sensorService from '../../services/SensorService';
import sensorsService from '../../services/SensorsService';
import statisticService from '../../services/StatisticService';
import statisticAggService from '../../services/StatisticAggService';

const Sensor = () => {
	const { sensorId } = useParams();
	const [item, setItem] = useState(null);
	const [radius, setRadius] = useState(50);
	const [itemsInRadius, setItemsInRadius] = useState([]);
	const [countInRadius, setCountInRadius] = useState(0);
	const [orderInRadius, setOrderInRadius] = useState([]);
	const [pageInRadius,  setPageInRadius ] = useState(0);
	const [limitInRadius, setLimitInRadius] = useState(10);
	const [itemsStatistic, setItemsStatistic] = useState([]);
	const [countStatistic, setCountStatistic] = useState(0);
	const [orderStatistic, setOrderStatistic] = useState([]);
	const [pageStatistic,  setPageStatistic ] = useState(0);
	const [limitStatistic, setLimitStatistic] = useState(50);
	const [truncStatisticAgg, setTruncStatisticAgg] = useState('month');
	const [itemsStatisticAgg, setItemsStatisticAgg] = useState([]);
	const [error, setError] = useState(null);
	const [myD3, setMyD3] = useState(null);
	const [innerWidth, setInnerWidth] = useState();

	window.addEventListener('resize', () => setInnerWidth(window.innerWidth));

	useEffect(async () => {
		const result = await sensorService({
			sensorId,
			statistic: 1,
		});
		const { item, error } = result;
		setItem(item);
		setError(error);
		if (myD3 && item) {
			const { statistic } = item;
			const margin = {
				top: 12,
				right: 12,
				bottom: 80,
				left: 32,
			};
			const width = (myD3.parentNode.offsetWidth ?? 800) - margin.left - margin.right;
			const height = 200 - margin.top - margin.bottom;
			const data = statistic.map(({ created: x, value: y, }) => {
				return { x: luxon.DateTime.fromISO(x).toJSDate(), y: +y, };
			});

			// set the ranges
			const x = d3.scaleTime().range([0, width]);
			const y = d3.scaleLinear().range([height, 0]);

			// define the line
			const valueline = d3.line()
				.x((d) => x(d.x))
				.y((d) => y(d.y));

			d3.select(myD3).selectAll('*').remove();

			// append the svg obgect to the body of the page
			// appends a 'group' element to 'svg'
			// moves the 'group' element to the top left margin
			const svg = d3.select(myD3)
				// .attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.attr('width', '100%')
				.append('g')
					.attr('transform', `translate(${ margin.left }, ${ margin.top })`);

			// Scale the range of the data
			x.domain(d3.extent(data, (d) => d.x));
			y.domain([0, d3.max(data, (d) => d.y)]);

			// Add the valueline path.
			svg.append('path')
				.data([data])
				.attr('class', 'line')
				.attr('d', valueline);

			// Add the X Axis
			svg.append('g')
				.attr('class', 'axis')
				.attr('transform', `translate(0, ${ height })`)
				.call(d3.axisBottom(x).tickFormat(d3.timeFormat('%Y-%m-%d')))
				.selectAll('text')	
					.style('text-anchor', 'end')
					.attr('dx', '-.8em')
					.attr('dy', '.15em')
					.attr('transform', 'rotate(-65)');

			// Add the Y Axis
			svg.append('g')
				.attr('class', 'axis')
				.call(d3.axisLeft(y));
		}
	}, [
		sensorId,
		myD3,
		innerWidth,
	]);

	useEffect(async () => {
		if (!sensorId || !item || !(radius>0)) return;
		let { latitude, longitude } = item;
		latitude = +latitude;
		longitude = +longitude;
		if (!Number.isFinite(latitude + longitude + radius)) return;
		const result = await sensorsService({
			page: pageInRadius,
			limit: limitInRadius,
			order: orderInRadius,
			noSensorIds: sensorId,
			latitude,
			longitude,
			radius,
		});
		const { items, count, error } = result;
		setItemsInRadius(items);
		setCountInRadius(count);
		setError(error);
	}, [
		item,
		radius,
		pageInRadius,
		limitInRadius,
		orderInRadius,
	]);

	useEffect(async () => {
		const sensorIds = itemsInRadius.map(item => item.sensorId);
		const result = await statisticService({
			page: pageStatistic,
			limit: limitStatistic,
			order: orderStatistic,
			sensorIds: [sensorId, ...sensorIds],
			sensor: true,
		});
		const { items, count, error } = result;
		setItemsStatistic(items);
		setCountStatistic(count);
		setError(error);
	}, [
		itemsInRadius,
		countInRadius,
		pageStatistic,
		limitStatistic,
		orderStatistic,
	]);

	useEffect(async () => {
		const sensorIds = itemsInRadius.map(item => item.sensorId);
		const promise = [sensorId, ...sensorIds].map(async (sensorId) => {
			const result = await statisticAggService({
				sensorId,
				truncBy: truncStatisticAgg,
			});
			return { ...result, sensorId };
		});
		const result = await Promise.all(promise);
		const error = result.find(({ error }) => error) ?? null;
		const items = result.map(({ error, ...r }) => r);
		// console.log({ result, items, error });
		setItemsStatisticAgg(error ? [] : items);
		setError(error);
	}, [
		itemsInRadius,
		countInRadius,
		pageStatistic,
		limitStatistic,
		orderStatistic,
	]);

	if (error) {
		return String(error);
	}

	const barInRadius = [ {
			td: { className: 'index' },
			title: `#`,
			render: ({ rowIndex }) => rowIndex + 1 + pageInRadius * limitInRadius,
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
			field: `distance`,
			onClick: true,
			td: { className: 'distance' },
			title: `Distance`,
			render: ({ item }) => Number(item).toFixed(5),
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

	const barStatistic = [ {
		td: { className: 'index' },
		title: `#`,
		render: ({ rowIndex }) => rowIndex + 1 + pageStatistic * limitStatistic,
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

	if (!item) {
		return 'loading...';
	}

	const viewDetail = () => (<dl className="view">
		<dt>SensorId:</dt>
		<dd>{ item.sensorId }</dd>
		<dt>Name:</dt>
		<dd>{ item.name }</dd>
		<dt>Latitude:</dt>
		<dd>{ +item.latitude }</dd>
		<dt>Longitude:</dt>
		<dd>{ +item.longitude }</dd>
		<dt>Enabled:</dt>
		<dd>{ item.enabled ? 'ON' : 'OFF' }</dd>
	</dl>);

	const viewMyD3 = () => (<div className="myd3">
		<svg ref={node => setMyD3(node)} />
	</div>);

	const viewNeighbors = () => (<div className="neighbors">
		<div className="radius">
			Radis:
			&nbsp;
			<input
				type="number"
				value={+radius}
				min="0"
				step="0.0001"
				placeholder="1.0"
				onChange={e => setRadius(+e.target.value)}
			/>
		</div>
		<Pages
			page={pageInRadius}
			setPage={setPageInRadius}
			limit={limitInRadius}
			setLimit={setLimitInRadius}
			count={countInRadius}
		/>
		<Table
			bar={barInRadius}
			items={itemsInRadius}
			order={orderInRadius}
			setOrder={setOrderInRadius}
		/>
		<Pages
			page={pageInRadius}
			setPage={setPageInRadius}
			limit={limitInRadius}
			setLimit={setLimitInRadius}
			count={countInRadius}
		/>
	</div>);

	const viewStatistic = () => (<div className="statistic">
		<Pages
			page={pageStatistic}
			setPage={setPageStatistic}
			limit={limitStatistic}
			setLimit={setLimitStatistic}
			count={countStatistic}
		/>
		<Table
			bar={barStatistic}
			items={itemsStatistic}
			order={orderStatistic}
			setOrder={setOrderStatistic}
		/>
		<Pages
			page={pageStatistic}
			setPage={setPageStatistic}
			limit={limitStatistic}
			setLimit={setLimitStatistic}
			count={countStatistic}
		/>
	</div>);

	return (<div className="sensor">
		{ viewDetail() }
		{ viewMyD3() }
		{ viewNeighbors() }
		{ viewStatistic() }
	</div>);
};

export default Sensor;
