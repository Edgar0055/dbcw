import { href, } from './cfg';

const sensorsService = async ({
	all = false,
	page = NaN,
	limit = NaN,
	order = null,
	sensorIds = [],
	noSensorIds = [],
	enabled = null,
	latitude = NaN,
	longitude = NaN,
	radius = NaN,
}) => {
	try {
		const url = new URL(`/api/sensors`, href || window.location.href);
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
		enabled===!!enabled && url.searchParams.set(`enabled`, +enabled);
		if (Number.isFinite(latitude + longitude + radius)) {
			url.searchParams.set(`latitude`, latitude);
			url.searchParams.set(`longitude`, longitude);
			url.searchParams.set(`radius`, radius);
		}
		const response = await fetch(url);
		const json = await response.json();
		const { items, count } = json;
		return { items, count, error: null };
	} catch (error) {
		return { items: [], count: 0, error };
	}
};

export default sensorsService;
