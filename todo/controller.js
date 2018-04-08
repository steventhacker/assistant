var express = require('express')
var todoRouter = express.Router();

var Sequelize = require('sequelize');
var sequelize = require('../db/connection');
var Todo = require('./model/todo');
var Journal = require('../journal/model/journal');

// Get the todos
todoRouter.get('/', function (req, res) {
  Todo.findAll().then(todos => {
    res.json(todos);
  })
});

todoRouter.delete('/:todoId', function(req, res) {
  Todo.findAll({
    where: {
      id: req.params.todoId
    }
  }).then(todo => {
    Journal.sync({force: false}).then(() => {
      var date = new Date();
      date.setDate(date.getDate() - 1);
    return Journal.create({
      entry: todo[0].body,
      timestamp: parseInt((date.getTime() / 1000).toFixed(0))
    }).then(function() {
      Todo.destroy({
        where: {
          id: req.params.todoId
        }
      }).then(function() {
        Todo.findAll().then(todos => {
          res.json(todos);
        })
      });
    })
  });
  })

  // First add entry in journals, then delete
  
});

todoRouter.post('/', function(req, res) {
  Todo.sync({force: false}).then(() => {
    return Todo.create({
      body: req.body.todo
    }).then(function() {
      Todo.findAll().then(todos => {
        res.json(todos);
      })
    });
  });
});

module.exports = todoRouter