const Sequelize = require('sequelize');
const sequelize = require('../../db/connection');

const Checklist = sequelize.define('checklist', {
  id : {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING(75)
  },
  configDone: {
    type: Sequelize.BOOLEAN
  },
  configVoid: {
    type: Sequelize.BOOLEAN
  },
  codeDone: {
    type: Sequelize.BOOLEAN
  },
  codeVoid: {
    type: Sequelize.BOOLEAN
  },
  styleDone: {
    type: Sequelize.BOOLEAN
  },
  styleVoid: {
    type: Sequelize.BOOLEAN
  },
  testsDone: {
    type: Sequelize.BOOLEAN
  },
  testsVoid: {
    type: Sequelize.BOOLEAN
  },
  docsDone: {
    type: Sequelize.BOOLEAN
  },
  docsVoid: {
    type: Sequelize.BOOLEAN
  }
}, {
  createdAt: false,
  updatedAt: false
});

module.exports = Checklist;