"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * NOTE: 이 마이그레이션은 수동 핫픽스입니다.
     * 실제로는 packages/crawling/src/scripts/hotfix-pv-data.ts 스크립트를 사용하여
     * 데이터베이스에 누락되어 있던 PV 데이터를 추가했습니다.
     */
  },

  async down(queryInterface, Sequelize) {
    /**
     * NOTE: 이 마이그레이션은 수동 핫픽스입니다.
     * 수동으로 추가된 데이터를 되돌리는 작업은 포함하지 않습니다.
     */
  },
};
