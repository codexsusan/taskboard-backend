"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      // define association here
      Comment.belongsTo(models.Task, {
        foreignKey: "taskId",
        onDelete: "CASCADE",
      });
      Comment.belongsTo(models.Org, {
        foreignKey: "orgId",
        onDelete: "CASCADE",
      });
      Comment.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  Comment.init(
    {
      comment: DataTypes.STRING,
      userType: DataTypes.STRING,
      orgId: DataTypes.STRING,
      userId: DataTypes.STRING,
      taskId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
