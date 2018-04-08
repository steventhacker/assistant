const Sequelize = require('sequelize');
const sequelize = require('../../db/connection');

const Note = sequelize.define('note', {
  id : {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING(100)
  },
  body: {
    type: Sequelize.STRING(500)
  },
  keywords: {
    type: Sequelize.STRING(100)
  }
}, {
  createdAt: false,
  updatedAt: false
});

module.exports = Note;