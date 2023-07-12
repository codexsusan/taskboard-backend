"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
      Task.belongsTo(models.Stage, {
        foreignKey: "stageId",
        onDelete: "CASCADE",
      });
    }
  }
  Task.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      priority: DataTypes.STRING,
      commentsOrder: DataTypes.ARRAY(DataTypes.STRING),
      assignedTo: DataTypes.ARRAY(DataTypes.STRING),
      stageId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Task",
    }
  );
  return Task;
};
