import { Promise, } from 'bluebird';
import faker from 'faker';
import { models, } from '..';

export const up = async () => {
	await models.auth.destroy({ truncate: { cascade: true }, });
	const items = [
		{
			authId: 1,
			login: 'root',
			password: 'root',
			enabled: true,
		},
		{
			authId: 1000,
			login: 'user',
			password: 'user',
			enabled: true,
		}, 
		...Array.from(Array(10), (_, i) => {
			return {
				authId: 1001 + i,
				login: faker.internet.userName(),
				password: faker.internet.password(),
				enabled: Math.random() > 0.5,
			};
		}),
	];
	const size = 100;
	const amount = Math.ceil(items.length / 100);
	await Promise.map(
		Array.from(Array(amount), (_, i) => items.slice(i*size, (i+1)*size)),
		async (items) => models.auth.bulkCreate(items, {})
	);
};

export const down = async () => {
	await models.auth.destroy({ truncate: { cascade: true }, });
};
