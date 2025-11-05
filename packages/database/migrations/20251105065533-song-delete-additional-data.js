"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Songs 테이블에서 불필요한 lyrics column 및 백업 테이블 제거
     */
    await queryInterface.sequelize.query("PRAGMA foreign_keys = OFF");
    await queryInterface.dropTable("Songs_backup");

    await queryInterface.removeColumn("Songs", "lyrics");
    await queryInterface.sequelize.query("PRAGMA foreign_keys = ON");
  },

  async down(queryInterface, Sequelize) {
    /**
     * Songs 테이블에서 lyrics column 복귀, 단 백업 테이블은 복귀 시키지 않고 migration으로 테이블 관리
     */
    await queryInterface.addColumn("Songs", "lyrics", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
