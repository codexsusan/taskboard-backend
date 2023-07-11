"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Board extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Board.belongsTo(models.Org, {
        foreignKey: "orgId",
      })
    }
  }
  Board.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      orgId: DataTypes.STRING,
      stageOrder: DataTypes.ARRAY(DataTypes.STRING),
      assignedMembers: DataTypes.ARRAY(DataTypes.STRING),
    },
    {
      sequelize,
      modelName: "Board",
    }
  );
  return Board;
};
