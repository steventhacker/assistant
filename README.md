# assistant

A personal assistant tool that assists with notes, checklists, a daily journal, and a flashcard system.

## General

### Requirements
  * Node
  * MySQL

Node application using Sequelize ORM for MySQL interactions and Angular v1 for presentation layer.  Each module is optional, launched with arguments.

### Installation and initialization

Install
```
npm i
```

Run
```
node app.js -n -f -j -f
```
All arguments are options
  * -n : Note system
  * -c : checklists
  * -j : Daily journal
  * -f : Flashcards


## Notes

Include a subject, note body, and comma delimited keywords. A keyword search exists, as well as a running list of top keywords for quick access.
Also includes a task list (todo list) that is sortable (does not persist through page load). When a task is completed, the daily journal is automatically updated.

## Checklist

Still WIP

## Daily Journal

Simple journal for keeping a log of work done, retrieved from database on a per-day level. 


## Flashcards

Simple flashcard system that has topics and cards under each topic. You can guess your answer and then log if you were correct or not. Also gives the user the option of viewing only cards that they have a low score on, allowing them to focus on what areas they need the most improvement in.

## License
[MIT](https://opensource.org/licenses/MIT)
