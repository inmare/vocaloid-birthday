"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * PV 테이블에 publishDate 컬럼을 추가합니다.
     */

    await queryInterface.addColumn("PVs", "publishDate", {
      type: Sequelize.DATE,
      defaultValue: new Date(0).toISOString().split(".")[0],
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * PV 테이블에서 publishDate 컬럼을 제거합니다.
     */
    await queryInterface.removeColumn("PVs", "publishDate");
  },
};
