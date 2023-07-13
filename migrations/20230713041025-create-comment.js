"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Comments", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      comment: {
        type: Sequelize.STRING,
      },
      userType: {
        type: Sequelize.STRING,
      },
      orgId: {
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.STRING,
      },
      taskId: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addConstraint("Comments", {
      fields: ["taskId"],
      type: "foreign key",
      references: {
        table: "Tasks",
        field: "id",
      },
      onDelete: "cascade",
    });

    await queryInterface.addConstraint("Comments", {
      fields: ["orgId"],
      type: "foreign key",
      references: {
        table: "Orgs",
        field: "id",
      },
      onDelete: "cascade",
      allowNull: true,
    });

    await queryInterface.addConstraint("Comments", {
      fields: ["userId"],
      type: "foreign key",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "cascade",
      allowNull: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Comments");
  },
};
