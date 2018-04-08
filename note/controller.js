var express = require('express');
var router = express.Router();

var Sequelize = require('sequelize');
var sequelize = require('../db/connection');
var Op = Sequelize.Op;
var Note = require('./model/note');

// define the home page route
router.get('/', function (req, res) {
  Note.findAll().then(notes => {
    var results = allKeywordSearch(notes);

    var response = {
      'notes': notes,
      'keywords': results
    }
    res.json(response);
  })
});

var allKeywordSearch = function(notes) {
  var keywords = [];
  for (var i = 0; i < notes.length; i++) {
    if (notes[i].keywords === null) {
      continue;
    }
    var splitKeywords = notes[i].keywords.split(', ');
    for (var j = 0; j < splitKeywords.length; j++) {
      keywords.push(splitKeywords[j]);
    } 
  }

  var response = keywords.reduce(function(acc, curr) {
    acc[curr] ? acc[curr]++ : acc[curr] = 1;

    return acc;
  }, {});

  return response;
}

router.get('/note/:noteId', function(req, res) {
  var noteId = req.params.noteId;

  Note.findAll({
    where: {
      id: noteId
    }
  }).then(note => {
    res.json(note[0]);
  })
});

router.get('/search/keyword/:searchVal', function(req, res) {
  var searchTerm = req.params.searchVal;
  Note.findAll({
    where: {
      keywords: {
        $like: '%' + searchTerm + '%'
      }
    }
  }).then(notes => {
    res.json(notes);
});
});

router.get('/search/:searchVal', function(req, res) {
  var val = req.params.searchVal;
  Note.findAll({
      where: {
        [Op.or]: 
        [{
            body: {
              $like: '%' + val + '%'
            }
          },
          {
            keywords: {
              $like: '%' + val + '%'
            }
          }
        ]
      }
    }).then(notes => {
      res.json(notes);
  });
});

router.post('/', function(req, res) {
  Note.sync({force: false}).then(() => {
    return Note.create({
      title: req.body.title,
      body: req.body.body,
      keywords: req.body.keywords
    }).then(function() {
      Note.findAll().then(notes => {
        res.json(notes);
      })
    });
  });
});

router.post('/note', function(req, res) {
  console.log('Body: ' + req.body.body);
  Note.update({
    title: req.body.title,
    body: req.body.body,
    keywords: req.body.keywords
  }, {
    where: {
      id: req.body.id
  }}).then(function() {
    Note.findAll().then(notes => {
      res.json(notes);
    })
  })
});

router.delete('/:noteId', function(req, res) {
  console.log('deleting: ' + req.params.noteId);
  Note.destroy({
    where: {
      id: req.params.noteId
    }
  }).then(function() {
    Note.findAll().then(notes => {
      res.json(notes);
    })
  });
});

module.exports = router