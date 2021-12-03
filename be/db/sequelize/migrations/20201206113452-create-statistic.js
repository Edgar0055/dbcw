export const up = async (queryInterface, DataTypes) => {
  await queryInterface.createTable(`statistic`, {
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
      references: {
        model: `sensor`,
        key: `sensor_id`,
      },
      type: DataTypes.BIGINT,
      onUpdate: `CASCADE`,
      onDelete: `CASCADE`,
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
    schema: `public`,
    timestamps: false,
    underscored: true,
  });
};

export const down = async (queryInterface) => {
  await queryInterface.dropTable(`statistic`);
};
