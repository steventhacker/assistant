var express = require('express')
var configRouter = express.Router();

var commander = global.commander;

configRouter.get('/menu', function(req, res) {
    var modules = [];

    if (commander.notes) {
        modules.push({
            name: "Notes",
            link: "#/"
        });
    }
    if (commander.checklist) {
        modules.push({
            name: "Checklists",
            link: "#checklist"
        });
    }
    if (commander.journal) {
        modules.push({
            name: "Journal",
            link: "#journal"
        });
    }
    if (commander.flashcards) {
        modules.push({
            name: "Flashcards",
            link: "#flashcards"
        });
    }
    res.json(modules);
});

module.exports = configRouter;