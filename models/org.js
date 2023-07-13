"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Org extends Model {
    static associate(models) {
      Org.hasMany(models.User, {
        foreignKey: "orgId",
        onDelete: "CASCADE",
        // hooks: true,
      });
      Org.hasMany(models.Board, {
        foreignKey: "orgId",
        onDelete: "CASCADE",
        // hooks: true,
      });
      Org.hasMany(models.Comment, {
        foreignKey: "orgId",
        onDelete: "CASCADE",
      });
      
    }
    static createOrg = async (orgname, email, password) => {
      return this.create({
        id: uuidv4(),
        orgname,
        email,
        password,
      });
    };
  }

  Org.init(
    {
      orgname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Org",
    }
  );
  return Org;
};
