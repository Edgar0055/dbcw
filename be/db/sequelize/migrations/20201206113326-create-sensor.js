export const up = async (queryInterface, DataTypes) => {
  await queryInterface.createTable(`sensor`, {
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
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: `enabled`,
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
  await queryInterface.dropTable(`sensor`);
};
