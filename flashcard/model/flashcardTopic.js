const Sequelize = require('sequelize');
const sequelize = require('../../db/connection');

const FlashcardTopic = sequelize.define('flashcardtopic', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    topic: {
      type: Sequelize.STRING(100)
    }
    }, {
    createdAt: false,
    updatedAt: false
});

module.exports = FlashcardTopic;