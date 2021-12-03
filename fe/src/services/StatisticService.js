import { href, } from './cfg';

const statisticService = async ({
	all = false,
	page = NaN,
	limit = NaN,
	order = null,
	sensorIds = [],
	noSensorIds = [],
	unit = null,
	sensor = false,
}) => {
	try {
		const url = new URL(`/api/statistic`, href || window.location.href);
		all && url.searchParams.set(`all`, +all);
		Number.isInteger(page) && url.searchParams.set(`page`, page);
		Number.isInteger(limit) && url.searchParams.set(`limit`, limit);
		order && url.searchParams.set(`order`, JSON.stringify(order));
		if (Array.isArray(sensorIds) && sensorIds.length) {
			url.searchParams.set(`sensorIds`, JSON.stringify(sensorIds));
		} else if (+sensorIds > 0) {
			url.searchParams.set(`sensorIds`, JSON.stringify([+sensorIds]));
		}
		if (Array.isArray(noSensorIds) && noSensorIds.length) {
			url.searchParams.set(`noSensorIds`, JSON.stringify(noSensorIds));
		} else if (+noSensorIds > 0) {
			url.searchParams.set(`noSensorIds`, JSON.stringify([+noSensorIds]));
		}
		unit && url.searchParams.set(`unit`, unit);
		sensor && url.searchParams.set(`sensor`, +sensor);
		const response = await fetch(url);
		const json = await response.json();
		const { items, count } = json;
		return { items, count, error: null };
	} catch (error) {
		return { items: [], count: 0, error };
	}
};

export default statisticService;
