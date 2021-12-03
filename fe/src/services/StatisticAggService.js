import { href, } from './cfg';

const statisticAggService = async ({
	sensorId = 0,
	truncBy = null,
}) => {
	try {
		const url = new URL(`/api/statistic/${ sensorId }/${ truncBy }`, href || window.location.href);
		const response = await fetch(url);
		const json = await response.json();
		const { items, count } = json;
		return { items, count, error: null };
	} catch (error) {
		return { items: [], count: 0, error };
	}
};

export default statisticAggService;
