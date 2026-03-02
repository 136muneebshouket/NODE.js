'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await queryInterface.bulkInsert('users', [
      {
        email: 'admin@example.com',
        password: hashedPassword,
        first_name: 'Admin',
        last_name: 'User',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'user@example.com',
        password: hashedPassword,
        first_name: 'Regular',
        last_name: 'User',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};