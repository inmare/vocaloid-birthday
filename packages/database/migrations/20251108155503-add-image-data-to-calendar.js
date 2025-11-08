"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Calendar 테이블에 imageFileName 컬럼 추가
     */
    await queryInterface.addColumn("Calendar", "imageFileName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Calendar 테이블에 imageFileName 컬럼 제거
     */
    await queryInterface.removeColumn("Calendar", "imageFileName");
  },
};
