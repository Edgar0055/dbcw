export const define = (sequelize, DataTypes) => {
  return sequelize.define('statistic', {
    statisticId: {
      allowNull: false,
      autoIncrement: true,
      field: `statistic_id`,
      primaryKey: true,
      type: DataTypes.BIGINT,
    },
    sensorId: {
      allowNull: false,
      field: `sensor_id`,
      type: DataTypes.BIGINT,
    },  
    created: {
      allowNull: false,
      field: `created_at`,
      type: DataTypes.DATE,
    },
    value: {
      allowNull: false,
      field: `value`,
      type: DataTypes.DECIMAL(10, 6),
    },
    unit: {
      allowNull: false,
      field: `unit`,
      type: DataTypes.STRING(32),
    },
  }, {
		freezeTableName: true,
		paranoid: false,
		timestamps: false,
		underscored: true,
  });
};
