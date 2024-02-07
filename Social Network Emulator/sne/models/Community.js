module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "Community",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageURL: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false,
      },
      membersCount: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        allowNull: false,
      },
      creatorId: {
        type: DataTypes.STRING,
        references: {
          model: "User",
          key: "pdsId",
        },
        unique: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn("now"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn("now"),
      },
    },
    {
      tableName: "Community",
    }
  );
};
