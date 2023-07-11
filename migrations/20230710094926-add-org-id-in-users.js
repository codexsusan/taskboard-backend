"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("Users", "orgId", {
      type: Sequelize.STRING,
    });

    await queryInterface.addConstraint("Users", {
      fields: ["orgId"],
      type: "foreign key",
      references: {
        table: "Orgs",
        field: "id",
      },
      onDelete: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // await queryInterface.removeConstraint("Users", "orgId");
    await queryInterface.removeColumn("Users", "orgId");
  },
};
