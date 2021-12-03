import { href, } from './cfg';

const sensorService = async ({
	sensorId = 0,
	statistic = false,
}) => {
	try {
		const url = new URL(`/api/sensor/${ sensorId }`, href || window.location.href);
		statistic && url.searchParams.set('statistic', +statistic);
		const response = await fetch(url);
		const json = await response.json();
		const { item } = json;
		return { item, error: null };
	} catch (error) {
		return { item: {}, error };
	}
};

export default sensorService;
