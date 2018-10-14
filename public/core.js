var notesApp = angular.module('notesApp', ['ngRoute']);

notesApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/note.html',
            controller: 'mainController'
        })
        .when('/checklist', {
            templateUrl: 'pages/checklist.html',
            controller: 'mainController'
        })
        .when('/journal', {
            templateUrl: 'pages/journal.html',
            controller: 'mainController'
        })
        .when('/flashcards', {
            templateUrl: 'pages/flashcards.html',
            controller: 'mainController'
        })
});

notesApp.controller('mainController', function ($scope, $http, $timeout) {
    $scope.formData = {};
    var _timeout;

    $http.get('/api/config/menu')
        .success(function(menu) {
            $scope.menu = menu;
        })
        .error(function(error) {
            console.log('Error getting config menu: ' + error);
        })

    $http.get('/api/flashcard')
        .success(function(cardTopics) {
            $scope.cardTopics = cardTopics;
        })
        .error(function(error) {
            console.log('Error getting flashcard topics: ' + error);
        })

    $http.get('/api/lists')
        .success(function(lists) {
            $scope.lists = lists;
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });

    $http.get('/api/notes')
        .success(function(data) {
            var result = [];
            
            Object.keys(data.keywords).map(e => result.push({
                key: e,
                value: data.keywords[e]
            }));

            // sort keywords and limit to 10
            result = result.sort(comparePopularKeywords).slice(0, 10);

            $scope.keywords = result;
            $scope.notes = data.notes;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $http.get('/api/todos')
        .success(function(todos) {
            $scope.todos = todos;
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });

    $http.get('/api/journal')
        .success(function(data) {
            $scope.journals = data;
        })
        .error(function(error) {
            console.log('Error getting journals: ' + error);
        })

    $scope.createFlashcardSubject = function(subject) {
        $http.post('/api/flashcard', $scope.formData)
            .success(function(data) {
                $scope.formData = {};
                $scope.cardTopics = data;
            })
            .error(function(error) {
                console.log('Error: ' + error);
            })
    }

    $scope.getFlashcard = function(set) {
        $http.get('/api/flashcard/' + set)
            .success(function(response) {
                if (response === 'No cards') {
                    $scope.set = set;
                    $('.no-card').removeClass('hidden');
                    $('.add-flashcard').removeClass('hidden');
                    $('.flashcard').addClass('hidden');
                } else {
                    $scope.set = set;
                    $scope.card = response;
                    $('.no-card').addClass('hidden');
                    $('.add-flashcard').addClass('hidden');
                    $('.flashcard').removeClass('hidden');
                    $('.flascard-topic-section').addClass('hidden');
                }
            })
            .error(function(error) {
                console.log('Error getting flashcard: ' + error);
            })
    }

    $scope.cardAnswer = function(set, id, answeredCorrect) {
        var payload = {
            set: set,
            id: id,
            correct: answeredCorrect
        }
        $http.post('/api/flashcard/answer', payload)
            .success(function(response) {
                console.log(response);
            })
            .error(function(error) {
                console.log('Error answering card: ' + error);
            })
    };

    $scope.createFlashcard = function(set) {
        var payload = {
            set: set,
            question: $scope.formData.newQuestion,
            answer: $scope.formData.newAnswer
        }

        $http.post('/api/flashcard/card', payload)
            .success(function(response) {
                $scope.card = response;
                $('.flashcard').removeClass('hidden');
                $('.add-flashcard').addClass('hidden');
                $('.no-card').addClass('hidden');
                $('#question').val('');
                $('#answer').val('');
            })
            .error(function(error) {
                console.log('Error creating flashcard: ' + error);
            })
    }

    $scope.createList = function() {
        $http.post('/api/lists', $scope.formData)
            .success(function(lists) {
                $scope.lists = lists;
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
    }

    $scope.updateItem = function(column, id) {
        var payload = {
            column: column,
            id: id
        };
        $http.post('/api/lists/update', payload)
            .success(function(lists) {
                $scope.lists = lists;
            })
            .error(function(error) {
                console.log('Error: ' + error);
            })
    }

    $scope.createNote = function() {
        $http.post('/api/notes', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; 
                $scope.notes = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.createTodo = function() {
        $http.post('/api/todos', $scope.formData)
            .success(function(todos) {
                $('#todo-create-text').val('');
                $scope.todos = todos;
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
    };

    $scope.deleteTodo = function(id) {
        $http.delete('/api/todos/' + id)
            .success(function(todos) {
                $('#todo-create-text').val('');
                $scope.todos = todos;
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
    };

    $scope.answerCardIncorrect = function(id) {
        $http.post('/api/flashcard/incorrect/' + id)
            .success(function(response) {
                $scope.card = response;
                $('.card-answer').addClass('hidden');
                $('.show-button').removeClass('hidden');
            })
            .error(function(error) {
                console.log('Unable to answer: ' + error);
            });
    }

    $scope.answerCardCorrect = function(id) {
        $http.post('/api/flashcard/correct/' + id)
            .success(function(response) {
                $scope.card = response;
                $('.card-answer').addClass('hidden');
                $('.show-button').removeClass('hidden');
            })
            .error(function(error) {
                console.log('Unable to answer: ' + error);
            });
    }

    $scope.editNote = function() {
        $http.post('/api/notes/note', $scope.formData)
            .success(function(data) {
                $scope.notes = data;
                $scope.formData = {};                

                updateInputFields();                
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.getEditNote = function(id) {
        $http.get('/api/notes/note/' + id)
            .success(function(data) {
                $scope.notes = {};
                updateInputFields(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.deleteNote = function(id) {
        var confirm = window.confirm('Are you sure you want to delete this?');

        if (confirm) {
            $http.delete('/api/notes/' + id)
                .success(function(data) {
                    $scope.notes = data;
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        }         
    };

    $scope.searchKeyword = function(keyword) {
        if (keyword === undefined || keyword === '') {
            return;
        }

        $http.get('/api/notes/search/keyword/' + keyword)
            .success(function(data) {
                $scope.notes = data;
                $scope.isSearchKeyword = true;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.clearKeywords = function() {
        $http.get('/api/notes')
            .success(function(data) {
                var result = [];
                
                Object.keys(data.keywords).map(e => result.push({
                    key: e,
                    value: data.keywords[e]
                }));

                // sort keywords and limit to 10
                result = result.sort(comparePopularKeywords).slice(0, 10);

                $scope.keywords = result;
                $scope.notes = data.notes;
                $scope.isSearchKeyword = false;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }

    $scope.search = function() {
        if (_timeout) {
            $timeout.cancel(_timeout);
        }

        var searchVal = $scope.sText;

        if (searchVal === undefined || searchVal === '') {
            _timeout = $timeout(function() {
                $http.get('/api/notes')
                    .success(function(data) {
                        var result = [];
            
                        Object.keys(data.keywords).map(e => result.push({
                            key: e,
                            value: data.keywords[e]
                        }));
                        $scope.keywords = result;
                        $scope.notes = data.notes;
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    });
            }, 1000);
        } else {
            _timeout = $timeout(function() {
                $http.get('/api/notes/search/' + searchVal)
                    .success(function(data) {
                        $scope.notes = data;
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    })
            }, 1000);        
        }
    }

    $scope.createJournalEntry = function() {
        $http.post('/api/journal/', $scope.formData)
            .success(function(journals) {
                $scope.journals = journals;
            })
            .error(function(error) {
                console.log('Error posting journal: ' + error);
            });
    };

    // Sorting algorithm
    function comparePopularKeywords(a, b) {
        if (a.value < b.value) {
            return 1;
        }
        if (a.value > b.value) {
            return -1;
        }
        return 0;
    }

    function updateInputFields(data) {
        if (data === undefined) {
            $('#input-title').val('');
            $('#input-note').val('');
            $('#input-keywords').val('');
            $('#input-id').val('');
            $('#editSubmit').addClass('hidden');
            $('#createSubmit').removeClass('hidden');
        } else {
            $('#input-title').val(data.title);
            $('#input-note').val(data.body);
            $('#input-keywords').val(data.keywords);
            $('#input-id').val(data.id);
            $('#editSubmit').removeClass('hidden');
            $('#createSubmit').addClass('hidden');

            // trigger events for angular
            // delayed to prevent clash with angular digest
            setTimeout(function() {
                $('#input-title').trigger('input');
                $('#input-note').trigger('input');
                $('#input-keywords').trigger('input');
                $('#input-id').trigger('input');
            }, 500);
        }
    }
});