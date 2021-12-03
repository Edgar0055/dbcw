export const define = (sequelize, DataTypes) => {
	return sequelize.define(`auth`, {
		authId: {
			allowNull: false,
			autoIncrement: true,
			field: `auth_id`,
			primaryKey: true,
			type: DataTypes.BIGINT,
		},
		login: {
			allowNull: false,
			field: `login`,
			type: DataTypes.STRING(128),
		},
		password: {
			allowNull: false,
			field: `password`,
			type: DataTypes.STRING(128),
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
