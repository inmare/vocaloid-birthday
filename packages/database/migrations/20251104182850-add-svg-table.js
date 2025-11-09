"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * 새로운 Calendar 테이블을 만드는 함수
     */

    // title과 같이 Songs와 같이 중복되는 값도 수정될 수 있기에 저장함
    queryInterface.createTable("Calendar", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      composer: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      titleKor: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      composerKor: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      publishDate: {
        type: Sequelize.DATE,
      },
      calendarDate: {
        type: Sequelize.DATE,
      },
      lyrics: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      svgConfig: {
        type: Sequelize.JSON,
      },
      svgFileName: {
        type: Sequelize.STRING,
      },
      songId: {
        type: Sequelize.INTEGER,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Calendar table을 없애는 함수
     */
    queryInterface.dropTable("Calendar");
  },
};
