"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    
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
    
    await queryInterface.removeColumn("Users", "orgId");
  },
};
