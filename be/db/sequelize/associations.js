export const associate = (models) => {
	// https://sequelize.org/v3/docs/associations/

	models.sensor.hasMany(models.statistic, {
		foreignKey: 'sensorId',
		constraints: true,
		as: 'statistic',
	});

	models.statistic.belongsTo(models.sensor, {
		foreignKey: 'sensorId',
		constraints: true,
		as: 'sensor',
	});

};