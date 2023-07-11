"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Stage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Stage.belongsTo(models.Board, {
        foreignKey: "boardId",
        onDelete: "CASCADE",
      });
    }
  }
  Stage.init(
    {
      title: DataTypes.STRING,
      boardId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Stage",
    }
  );
  return Stage;
};
