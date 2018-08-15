var express = require('express')
var journalRouter = express.Router();

var Sequelize = require('sequelize');
var sequelize = require('../db/connection');
var Journal = require('./model/journal');

// Get the todos
journalRouter.get('/', function (req, res) {
  Journal.findAll({
      order: [['timestamp', 'DESC']]
  }).then(journals => {
    var entries = buildEntries(journals);    
    res.json(entries);
  })
});

journalRouter.post('/', function(req, res) {
  Journal.sync({force: false}).then(() => {
      var date = new Date();
      date.setDate(date.getDate());
    return Journal.create({
      entry: req.body.journal,
      timestamp: parseInt((date.getTime() / 1000).toFixed(0))
    }).then(function() {
      Journal.findAll({
            order: [['timestamp', 'DESC']]
        }).then(journals => {
            var entries = buildEntries(journals);
            res.json(entries);
      })
    });
  });
});

function buildEntries(e) {
    var entries = [];
    e.forEach(journal => {
        var timestamp = journal.dataValues.timestamp;
        var d = new Date(timestamp * 1000);

        // JS dates are 0 indexed, sigh
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var year = d.getFullYear();
        var date = month + '/' + day + '/' + year;

        if (entries.length < 1) {
            var newEntry = [];
            newEntry.push(journal.entry);
            entries.push({
                key: date,
                values: newEntry
            });
        } else {
            var match = false;
            var dupe = false;
            for (var i = 0; i < entries.length; i++) {
                // Don't let a dupe happen on same day
                if (entries[i].values.includes(journal.entry)) {
                    dupe = true;
                } else if (entries[i].key === date) {      
                    match = true;
                    break;
                }
            }        
            if (!dupe) {
                if (match) {
                    entries[i].values.push(journal.entry);
                } else {
                    var newEntry = [];
                        newEntry.push(journal.entry);
                        entries.push({
                            key: date,
                            values: newEntry
                        });
                }
            }            
        }
    });
    return entries;
}

module.exports = journalRouter