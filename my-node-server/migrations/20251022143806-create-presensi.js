'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Presensis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // INI KOLOM YANG HILANG
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false 
      },
      // INI KOLOM YANG HILANG
      nama: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // INI KOLOM YANG HILANG
      checkIn: {
        allowNull: false,
        type: Sequelize.DATE
      },
      // INI KOLOM YANG HILANG
      checkOut: {
        allowNull: true, // checkOut bisa kosong
        type: Sequelize.DATE
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Presensis');
  }
};