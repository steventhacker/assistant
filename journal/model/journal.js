const Sequelize = require('sequelize');
const sequelize = require('../../db/connection');

const Journal = sequelize.define('journal', {
  id : {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  entry: {
    type: Sequelize.STRING(800)
  },
  timestamp: {
    type: Sequelize.INTEGER
  }
}, {
  createdAt: false,
  updatedAt: false
});

module.exports = Journal;