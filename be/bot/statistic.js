import * as luxon from 'luxon';
import { models, } from '../db/sequelize';
const delay = 100;

const tic = async () => {
  const sensors = await models.sensor.findAll({
    where: { enabled: true, },
    raw: true,
  });
  const sensorsIds = sensors.map(s => s.sensorId).sort(() => Math.random()>.5);
  const items = [
		...sensorsIds.map(sensorId => {
			return {
				sensorId,
				created: luxon.DateTime.utc(),
				value: Math.random() * 100,
				unit: '%',
			};
		}),
	].map(item => models.statistic.bulkCreate([ item, ], {}));
	await Promise.all(items);
  setTimeout(tic, delay);
};

tic();
