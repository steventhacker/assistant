const Sequelize = require('sequelize');
const sequelize = require('../../db/connection');

const Todo = sequelize.define('todo', {
    id : {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    body: {
      type: Sequelize.STRING(500)
    }
  }, {
    createdAt: false,
    updatedAt: false
  });

  module.exports = Todo;