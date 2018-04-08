const express = require('express');

const commander = require('commander');

const morgan = require('morgan');
const bodyParser = require('body-parser');

commander
  .version('0.1.0')
  .option('-n, --notes', 'Notes')
  .option('-c, --checklist', 'Checklist')
  .option('-j, --journal', 'Journal')
  .option('-f, --flashcards', 'Flashcards')
  .parse(process.argv);

global.commander = commander;

var configController = require('./admin/controller');
var notesController = require('./note/controller');
var todoController  = require('./todo/controller');
var listsController = require('./checklist/controller');
var flashcardController = require('./flashcard/controller');
var journalController = require('./journal/controller');

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());

app.use('/api/config', configController);
app.use('/api/notes', notesController);
app.use('/api/todos', todoController);
app.use('/api/lists', listsController);
app.use('/api/flashcard', flashcardController);
app.use('/api/journal', journalController);

app.listen(3000, () => console.log('Listening on port 3000'));