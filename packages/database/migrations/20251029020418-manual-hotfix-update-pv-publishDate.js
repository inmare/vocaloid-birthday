"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * NOTE: 이 마이그레이션은 수동 핫픽스입니다.
     * 실제로는 packages/crawling/src/scripts/hotfix-pv-time.ts 스크립트를 사용하여
     * 데이터베이스에서 오류가 난 시간 데이터를 수정했습니다.
     */
  },

  async down(queryInterface, Sequelize) {
    /**
     * NOTE: 이 마이그레이션은 수동 핫픽스입니다.
     * 수동으로 추가된 데이터를 되돌리는 작업은 포함하지 않습니다.
     */
  },
};
