'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Perintah untuk menghapus kolom 'nama' dari tabel 'Presensis'
    await queryInterface.removeColumn('Presensis', 'nama');
  },

  async down(queryInterface, Sequelize) {
    // Perintah untuk mengembalikan kolom 'nama' jika migrasi dibatalkan (undo)
    await queryInterface.addColumn('Presensis', 'nama', {
      type: Sequelize.STRING,
      allowNull: true // Sesuaikan 'allowNull' dengan definisi Anda sebelumnya
    });
  }
};