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
    incorrect: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    correct: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    topicId: {
      type: Sequelize.INTEGER
    },
    archived: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0
    }
  }, {
    createdAt: false,
    updatedAt: false
});

module.exports = Flashcard;