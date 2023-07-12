"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Tasks", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      priority: {
        type: Sequelize.STRING,
      },
      commentsOrder: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      assignedTo: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      stageId: {
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
    await queryInterface.addConstraint("Tasks", {
      fields: ["stageId"],
      type: "foreign key",
      references: {
        table: "Stages",
        field: "id",
      },
      onDelete: "cascade",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Tasks");
  },
};
