var express = require('express')
var flashcardController = express.Router();

var Sequelize = require('sequelize');
var sequelize = require('../db/connection');
var Flashcard = require('./model/flashcard');
var FlashcardTopic = require('./model/flashcardTopic');

// Get the todos
flashcardController.get('/', function (req, res) {
  FlashcardTopic.findAll().then(topics => {
    res.json(topics);
  })
});

flashcardController.get('/:topic', function(req, res) {
  var topic = req.params.topic;

  Flashcard.findAll({
      where: {
          topicId: topic
      }
  }).then(function(cards) {
      if (cards === undefined || cards.length < 1) {
          res.send('No cards');
      } else {
        var card = cards[Math.floor(Math.random()*cards.length)];
        res.json(card);
      }
  })

});

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
      Flashcard.findAll().then(cards => {
        var card = cards[Math.floor(Math.random()*cards.length)];
        res.json(card);
      })
    });
  });
});

flashcardController.post('/correct/:id', function(req, res) {  
  var topicId = req.params.id;
  Flashcard.update({
    correct: Sequelize.literal('correct + 1'),
    total: Sequelize.literal('total + 1')
  }, {
    where: {
        id: topicId
  }}).then(function() {
    Flashcard.findAll().then(function(cards) {
        var card = cards[Math.floor(Math.random()*cards.length)];
        console.log('Card: ' + JSON.stringify(card));
        res.json(card);
    })
  })
});

flashcardController.post('/incorrect/:id', function(req, res) {
  var topicId = req.params.id;
  Flashcard.update({
    total: Sequelize.literal('total + 1')
  }, {
    where: {
        id: topicId
  }}).then(function() {
    Flashcard.findAll().then(function(cards) {
        var card = cards[Math.floor(Math.random()*cards.length)];
        console.log('Card: ' + JSON.stringify(card));
        res.json(card);
    })
  })
});

module.exports = flashcardController