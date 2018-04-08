var express = require('express')
var checklistRouter = express.Router();

var util = require('util');

var Sequelize = require('sequelize');
var sequelize = require('../db/connection');
var Checklist = require('./model/checklist');

// Get the todos
checklistRouter.get('/', function (req, res) {
  Checklist.findAll().then(lists => {
    res.json(lists);
  })
});

checklistRouter.post('/update', function(req, res) {
    var a = "a";
    if (req !== undefined) {
        console.log(util.inspect(req.body));
    } else {
        console.log('no');
    }

    var col = req.body.column;

    if (col === 'configDone') {
      updateConfig(req.body.id);
    }
    
    Checklist.findAll().then(lists => {
    res.json(lists);
  })
});

var updateConfig = function(id) {
  var config = true;
  Checklist.findAll({
    where: {
      id: id
    }
  }).then(checklist => {
    config = !checklist[0].configDone;
    console.log('Setting to ' + config);
  })
  Checklist.update({
    configDone: config
  }, {
    where: {id: id}
  })
}

checklistRouter.post('/', function(req, res) {
  Checklist.sync({force: false}).then(() => {
    return Checklist.create({
      title: req.body.title
    }).then(function() {
      Checklist.findAll().then(lists => {
        res.json(lists);
      })
    });
  });
});

module.exports = checklistRouter