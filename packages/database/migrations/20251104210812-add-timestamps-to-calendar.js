"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Calendar 테이블에 createdAt, updatedAt 컬럼 추가
     */
    await queryInterface.addColumn("Calendar", "createdAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });

    await queryInterface.addColumn("Calendar", "updatedAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Calendar 테이블에서 createdAt, updatedAt 컬럼 제거
     */

    await queryInterface.removeColumn("Calendar", "createdAt");
    await queryInterface.removeColumn("Calendar", "updatedAt");
  },
};
