// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'angles', 'ionic.utils'])

.run(function ($ionicPlatform, $localstorage, $rootScope) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
    var user = $localstorage.getObject('user');
    if (user.accounts) {
        $rootScope.user = user;
    } else {
        user = {
            "loggedIn": true,
            "counter": [], // For unique IDs
            "accounts": [
                {
                    "name": "Hoved",
                    "balance": 824237
                }
            ],
            "contacts": [ // dummy data for testing
                {
                    "name": "John Appleseed",
                    "location": "Oslo",
                    "account": "5555.55.58392",
                    "img": "user.png"
                },
                {
                    "name": "Abraham Lincoln",
                    "location": "Oslo",
                    "account": "5545.54.51247",
                    "img": "user.png"
                },
                {
                    "name": "MPX.no",
                    "location": "Oslo",
                    "account": "5545.55.54905",
                    "img": "user.png"
                },
                {
                    "name": "TelenorFaktura",
                    "location": "Oslo",
                    "account": "5545.54.46789",
                    "img": "user.png"
                }
            ],
            "events": [
                {
                    "id": 1,
                    "name": "Hyttetur til Hemsedal",
                    "location": "Hemsedal",
                    "img": "Eiendom.jpg",
                    "amount": 1000,
                    "saved": 500,
                    "type": "facebook",
                    "link": "www.facebook.com/",
                    "date": "23.01.2016",
                    "description": "Legg inn beskrivelse til evntet her",
                    "updates": [
                        {
                            "title": "Ta med mat",
                            "content": "Husk å ta med mat.",
                            "author": "Abraham Lincoln"
                        }
                    ]

                },
                {
                    "id": 2,
                    "name": "Sommerfest!",
                    "location": "Odalen",
                    "img": "Musikk.jpg",
                    "amount": 400,
                    "saved": 350,
                    "type": "annet",
                    "link": "www.odalen.no",
                    "date": "23.06.2015",
                    "description": "Legg inn beskrivelse til evntet her",
                    "updates": [
                        {
                            "title": "Ta med mat",
                            "content": "Husk å ta med mat.",
                            "author": "John Appleseed"
                        },
                        {
                            "title": "Avicii til Hemsedal",
                            "content": "Husk å ta med mat.",
                            "author": "John Appleseed"
                        }
                        ]

                }
            ],
            "savegoals": [],
            "genres": [
                "Mat og drikke",
                "Teknologi",
                "Klær",
                "Eiendom",
                "Kjøretøy",
                "Musikk",
                "Kunst",
                "Sport",
                "Hjem",
                "Arbeid",
                "Arrangement",
                "Skole",
                "Annet"
            ],
            "budgets": [
                {
                    "type": "week",
                    "name": "Mat",
                    "amount": 5000,
                    "used": 0
                }
            ],
            "transactionTypes": [
                "Innkommende",
                "Utgående",
                "eFaktura",
                "AutoGiro"
            ],
            "transactions": [],
            "loans": [],
            "payments": [
                {
                    "id": "0",
                    "from": "MPX.no",
                    "amount": "6490",
                    "name": "Apple iPhone 6",
                    "dueDate": "15.06.2015"
                },
                {
                    "id": "1",
                    "from": "Abraham Lincoln",
                    "amount": "490",
                    "name": "Grillfest",
                    "dueDate": "22.07.2015"
                }
            ],
            "settings": {
                "defaultAccount": "0"
            },
            "profile": {}
        };
        $localstorage.setObject('user', user);
        $rootScope.user = user;
    }
})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'AppCtrl'
        })
        .state('app.home', {
            url: "/home",
            views: {
                'menuContent': {
                    templateUrl: "templates/home.html"
                }
            }
        })
        .state('app.accounts', {
            url: "/accounts",
            views: {
                'menuContent': {
                    templateUrl: "templates/accounts.html"
                }
            }
        })
        .state('app.contacts', {
            url: "/contacts",
            views: {
                'menuContent': {
                    templateUrl: "templates/contacts.html"
                }
            }
        })
        .state('app.events', {
            url: "/events",
            views: {
                'menuContent': {
                    templateUrl: "templates/events.html"
                }
            }
        })
        .state('app.eventDetails', {
            url: "/events/{eventId:int}",
            views: {
                'menuContent': {
                    templateUrl: "templates/eventDetails.html"
                }
            }
        })
        .state('app.transactions', {
            url: "/transactions",
            views: {
                'menuContent': {
                    templateUrl: "templates/transactions.html"
                }
            }
        })
        .state('app.savings', {
            url: "/savings",
            views: {
                'menuContent': {
                    templateUrl: "templates/savings.html"
                }
            }
        })
        .state('app.saveDetails', {
            url: "/savings/{saveId:int}",
            views: {
                'menuContent': {
                    templateUrl: "templates/saveDetails.html"
                }
            }
        })
        .state('app.budget', {
            url: "/budget",
            views: {
                'menuContent': {
                    templateUrl: "templates/budget.html"
                }
            }
        })
        .state('app.budgetDetail', {
            url: "/budget/:id",
            views: {
                'menuContent': {
                    templateUrl: "templates/budgetDetails.html"
                }
            }
        })
        .state('app.loan', {
            url: "/loan",
            views: {
                'menuContent': {
                    templateUrl: "templates/loan.html"
                }
            }
        })
        .state('app.pay', {
            url: "/pay",
            views: {
                'menuContent': {
                    templateUrl: "templates/payments.html"
                }
            }
        })
        .state('app.settings', {
            url: "/settings",
            views: {
                'menuContent': {
                    templateUrl: "templates/settings.html"
                }
            }
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
});