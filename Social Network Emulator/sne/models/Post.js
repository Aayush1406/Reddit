module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "Post",
    {
      pdsId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      creatorId: {
        type: DataTypes.STRING,
        references: {
          model: "User",
          key: "pdsId",
        },
        unique: false,
      },
      likesCount: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        allowNull: false,
      },
      communityId: {
        type: DataTypes.UUID,
        references: {
          model: "Community",
          key: "id",
        },
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
      tableName: "Post",
    }
  );
};
