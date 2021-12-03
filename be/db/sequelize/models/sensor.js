export const define = (sequelize, DataTypes) => {
	return sequelize.define('sensor', {
		sensorId: {
			allowNull: false,
			autoIncrement: true,
			field: `sensor_id`,
			primaryKey: true,
			type: DataTypes.BIGINT,
		},
		name: {
			allowNull: false,
			field: `name`,
			type: DataTypes.STRING(128),
		},
		latitude: {
			allowNull: true,
			field: `latitude`,
			type: DataTypes.DECIMAL(20, 16),
		},
		longitude: {
			allowNull: true,
			field: `longitude`,
			type: DataTypes.DECIMAL(20, 16),
		},
		enabled: {
			allowNull: false,
			defaultValue: false,
			field: `enabled`,
			type: DataTypes.BOOLEAN,
		},
	}, {
		freezeTableName: true,
		paranoid: false,
		timestamps: false,
		underscored: true,
	});
};