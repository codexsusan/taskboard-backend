'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Stages', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING
      },
      boardId: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addConstraint('Stages', {
      fields: ['boardId'],
      type: 'foreign key',
      references: {
        table: 'Boards',
        field: 'id'
      },
      onDelete: 'cascade',
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Stages');
  }
};