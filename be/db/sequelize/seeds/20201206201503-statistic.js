// http://bluebirdjs.com/docs/api-reference.html
import { Promise, } from 'bluebird';
import faker from 'faker';
import * as luxon from 'luxon';
import { models, } from '..';

export const up = async () => {
	await models.statistic.destroy({ truncate: true, });
	const now = luxon.DateTime.utc();
	const dateInterval = [now.minus({ days: 100 }), now].map(d => d.toJSDate());
	const items = [
		...Array.from(Array(1000), () => {
			return {
				sensorId: 1 + Math.round(Math.random()*10),
				created: faker.date.between(...dateInterval),
				value: Math.random() * 100,
				unit: '%',
			};
		}),
	];
	const size = 100;
	const amount = Math.ceil(items.length / 100);
	await Promise.map(
		Array.from(Array(amount), (_, i) => items.slice(i*size, (i+1)*size)),
		async (items) => models.statistic.bulkCreate(items, {})
	);
};

export const down = async () => {
	await models.statistic.destroy({ truncate: true, });
};
