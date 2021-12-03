import { Promise, } from 'bluebird';
import faker from 'faker';
import { models, } from '..';

export const up = async () => {
	await models.sensor.destroy({ truncate: { cascade: true }, });
	const items = [
		{
			sensorId: 1,
			name: 'My',
			latitude: faker.address.latitude(),
			longitude: faker.address.longitude(),
			enabled: true,
		},
		...Array.from(Array(10), (_, i) => {
			return {
				sensorId: 2 + i,
				name: faker.address.streetName(),
				latitude: faker.address.latitude(),
				longitude: faker.address.longitude(),
				enabled: Math.random() > 0.5,
			}
		}),
	];
	const size = 100;
	const amount = Math.ceil(items.length / 100);
	await Promise.map(
		Array.from(Array(amount), (_, i) => items.slice(i*size, (i+1)*size)),
		async (items) => models.sensor.bulkCreate(items, {})
	);
};

export const down = async () => {
	await models.sensor.destroy({ truncate: { cascade: true }, });
};
