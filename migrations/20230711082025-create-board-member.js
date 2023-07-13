"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("BoardMembers", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      boardId: {
        type: Sequelize.STRING,
      },
      userId: {
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

    await queryInterface.addConstraint("BoardMembers", {
      fields: ["boardId"],
      type: "foreign key",
      references: {
        table: "Boards",
        field: "id",
      },
      onDelete: "cascade",
    });

    await queryInterface.addConstraint("BoardMembers", {
      fields: ["userId"],
      type: "foreign key",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "cascade",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("BoardMembers");
  },
};
