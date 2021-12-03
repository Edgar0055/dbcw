import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import { config, } from './config';
import { associate, } from './associations';

let sequelize;
if (config.url) {
  sequelize = new Sequelize(config.url, config);
} else if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const root = path.resolve(__dirname, 'models');
const files = fs.readdirSync(root, { withFileTypes: true, })
	.filter(item => item.isFile())
	.map(item => item.name)
  .filter(file => /^[^\.\~].*?[\.]js$/.test(file))
  .map(file => path.resolve(root, file));

const models = {};
for (const file of files) {
  const { define, } = require(file);
  const model = define(sequelize, Sequelize.DataTypes);
  models[model.name] = model;
}

associate(models);

export {
	models,
	sequelize,
	Sequelize,
};
