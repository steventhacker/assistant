var express = require('express')
var flashcardController = express.Router();

var Sequelize = require('sequelize');
var sequelize = require('../db/connection');
var Flashcard = require('./model/flashcard');
var FlashcardTopic = require('./model/flashcardTopic');
var Op = Sequelize.Op;

flashcardController.get('/', function (req, res) {
  FlashcardTopic.findAll().then(topics => {
    res.json(topics);
  })
});

flashcardController.get('/:topic', function(req, res) {
  var topic = req.params.topic;

  getCardWithTopic(topic, res);
});

function getCard(res, topic) {
  Flashcard.findAll({
    where: {
      topicId: topic
    }
  }).then(function(cards) {
      getRandom(cards, res);
  })
}

function getCardWithTopic(topic, res) {
  Flashcard.findAll({
      where: {
      [Op.and]:
      [ {
          topicId: topic
        }, {
          archived: 0
      }
      ]
    }
  }).then(function(cards) {
      getRandom(cards, res);
  })
}

function getRandom(cards, res) {
      if (cards === undefined || cards.length < 1) {
          res.send('No cards');
      } else {
        var card = cards[Math.floor(Math.random()*cards.length)];
        res.json(card);
      }
}

flashcardController.get('/low/:topic', function(req, res) {
  var topic = req.params.topic;

  Flashcard.findAll({    
    where: {
      [Op.and]: 
      [ {
        topicId: topic
        }, {
          correct: {
            [Op.lt]: sequelize.col('incorrect')
          }
        }, {
          archived: 0
        }
      ]
    }
  }).then(function(cards) {
    getRandom(cards, res);
  })
})

flashcardController.post('/', function(req, res) {
  FlashcardTopic.sync({force: false}).then(() => {
    return FlashcardTopic.create({
      topic: req.body.subject,
    }).then(function() {
      FlashcardTopic.findAll().then(topics => {
        res.json(topics);
      })
    });
  });
});

flashcardController.post('/card/', function(req, res) {
  var payload = req.body;
  var topicId = payload.set;
  var question = payload.question;
  var answer = payload.answer;
  
  Flashcard.sync({force: false}).then(() => {
    return Flashcard.create({
      question: question,
      answer: answer,
      topicId: topicId
    }).then(function() {
      getCard(res, topicId);
    });
  });
});

flashcardController.post('/correct/:id/:topic', function(req, res) {  
  var id = req.params.id;
  var topic = req.params.topic;
  Flashcard.update({
    correct: Sequelize.literal('correct + 1'),
    total: Sequelize.literal('total + 1')
  }, {
    where: {
        id: id
  }}).then(function() {
    getCard(res, topic);
  })
});

flashcardController.post('/incorrect/:id/:topic', function(req, res) {
  var id = req.params.id;
  var topic = req.params.topic;
  Flashcard.update({
    incorrect: Sequelize.literal('incorrect + 1')
  }, {
    where: {
        id: id
  }}).then(function() {
    getCard(res, topic);
  })
});

flashcardController.post('/delete/:id/:topic', function(req, res) {
  var id = req.params.id;
  var topic = req.params.topic;
  Flashcard.update({
    archived: 1
  }, {
    where: {
        id: id
  }}).then(function() {
    getCard(res, topic);
  })
});

module.exports = flashcardController