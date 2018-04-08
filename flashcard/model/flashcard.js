const Sequelize = require('sequelize');
const sequelize = require('../../db/connection');

const Flashcard = sequelize.define('flashcard', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    question: {
      type: Sequelize.STRING(150)
    },
    answer: {
      type: Sequelize.STRING(800)
    },
    total: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    correct: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    topicId: {
      type: Sequelize.INTEGER
    }
  }, {
    createdAt: false,
    updatedAt: false
});

module.exports = Flashcard;