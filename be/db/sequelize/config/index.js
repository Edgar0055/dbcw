// https://sequelize.readthedocs.io/en/latest/docs/migrations/

import { env, } from '../../../env';

export const config = {
	url: env.DATABASE_URL,
	dialect: 'postgres',
	freezeTableName: true,
	paranoid: false,
	timestamps: false,
	underscored: true,
	pool: {
		max: 1,
		min: 0,
		idle: 10000,
	},
};

export const development = config;
export const production = config;
export const stage = config;
export const test = config;
