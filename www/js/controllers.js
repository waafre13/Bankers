angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $rootScope, $localstorage, $ionicPopup, $state) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.profileData = {
        ambition: 2,
        incomes: [],
        expenses: []
    };

    $scope.goToPage = function (page) {
        $state.go(page);
    };

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/profile.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Open the login modal
    $scope.logout = function () {
        $timeout(function () {
            $rootScope.user.loggedIn = false;
        }, 400);
        $localstorage.setObject('user', $rootScope.user);
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        $rootScope.user.loggedIn = true;
        $localstorage.setObject('user', $rootScope.user);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };

    // Perform the login action when the user submits the login form
    $scope.removeUser = function () {
        $rootScope.user = {};
        $localstorage.setObject('user', $rootScope.user);
    };

    if ($rootScope.user.profile.ambition === undefined) {
        $timeout($scope.login, 300);
    }

    $scope.showIncome = function () {
        $scope.income = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<label class="item"><input type="text" placeholder="Navn" ng-model="income.name"></label><label class="item"><input type="tel" placeholder="Inntekt" ng-model="income.value"></label>',
            title: 'Legg til inntekt',
            subTitle: 'Kun faste inntekter',
            scope: $scope,
            buttons: [
                {
                    text: 'Avbryt'
                },
                {
                    text: '<b>Lagre</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.income.name || !$scope.income.value) {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                            return $scope.income;
                        }
                    }
  }
  ]
        });
        myPopup.then(function (res) {
            var name = res.name;
            var value = parseInt(res.value);
            if (!isNaN(value)) {
                res.name = name;
                res.value = value;
                $scope.profileData.incomes.push(res);
            } else {
                console.log("NaN");
            }
        });
    };

    $scope.showExpense = function () {
        $scope.expense = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<label class="item"><input type="text" placeholder="Navn" ng-model="expense.name"></label><label class="item"><input type="tel" placeholder="Utgift" ng-model="expense.value"></label>',
            title: 'Legg til utgift',
            subTitle: 'Kun faste utgifter',
            scope: $scope,
            buttons: [
                {
                    text: 'Avbryt'
                },
                {
                    text: '<b>Lagre</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.expense.name || !$scope.expense.value) {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                            return $scope.expense;
                        }
                    }
  }
  ]
        });
        myPopup.then(function (res) {
            var name = res.name;
            var value = parseInt(res.value);
            if (!isNaN(value)) {
                res.name = name;
                res.value = value;
                $scope.profileData.expenses.push(res);
            } else {
                console.log("NaN");
            }
        });
    };

    $scope.saveProfile = function () {
        $rootScope.user.profile = $scope.profileData;
        $localstorage.setObject('user', $rootScope.user);
        $scope.modal.hide();
    };
})

//NOTE: OverviewCtrl
.controller('OverviewCtrl', function ($scope, $rootScope) {
    $scope.overview = {
        budgets: [],
        usedPerBudget: [],
        totalBudget: 0,
        totalSave: 0,
        used: 0,
        saved: 0,
        total: 0,
        difference: 0,
        lastTransaction: {}

    };
    $scope.calcTotal = function () {
        $scope.overview = {
            budgets: [],
            usedPerBudget: [],
            totalBudget: 0,
            totalSave: 0,
            used: 0,
            saved: 0,
            total: 0,
            difference: 0,
            lastTransaction: {}
        };
        for (var i = 0; i < $rootScope.user.accounts.length; i++) {
            $scope.overview.total += parseInt($rootScope.user.accounts[i].balance);
        }
        for (i = 0; i < $rootScope.user.budgets.length; i++) {
            $scope.overview.budgets.push($rootScope.user.budgets[i].name);
            $scope.overview.usedPerBudget.push($rootScope.user.budgets[i].used);
            $scope.overview.totalBudget += $rootScope.user.budgets[i].amount;
            $scope.overview.used += $rootScope.user.budgets[i].used;
        }
        for (i = 0; i < $rootScope.user.savegoals.length; i++) {
            $scope.overview.totalSave += $rootScope.user.savegoals[i].amount;
            $scope.overview.saved += $rootScope.user.savegoals[i].saved;
        }
        for (i = 0; i < $rootScope.user.transactions.length; i++) {
            if ($rootScope.user.transactions[i].type === "Inngående") {
                $scope.overview.difference += $rootScope.user.transactions[i].amount;
            } else {
                $scope.overview.difference -= $rootScope.user.transactions[i].amount;
            }
        }
        if ($rootScope.user.transactions.length > 0) {
            $scope.overview.lastTransaction = $rootScope.user.transactions[$rootScope.user.transactions.length - 1];
        }
        $scope.smallDatachart.labels = $scope.overview.budgets;
        $scope.smallDatachart.datasets[0].data = $scope.overview.usedPerBudget;
    };

    // Form data for the login modal
    $scope.datachart = {
        labels: ["Uke 1", "Uke 2", "Uke 3", "Uke 4"],
        datasets: [
            {
                fillColor: "rgba(255, 255, 255, 0.3)",
                strokeColor: "rgba(52, 152, 219,0)",
                pointColor: "rgba(255,255,255,1)",
                pointStrokeColor: "rgba(255, 255, 255,0)",
                data: [99, 299, 532, 400]
   },
            {
                fillColor: "rgba(255, 255, 255, 0.1)",
                strokeColor: "rgba(52, 152, 219,0)",
                pointColor: "rgba(255, 255, 255,0)",
                pointStrokeColor: "rgba(255, 255, 255, 0.2)",
                data: [0, 899, 200, 100]
   }
  ],
    }

    ;
    $scope.options = {
        scaleFontColor: "rgba(255,255,255,0.8",
        scaleLineColor: "rgba(255,255,255,0.2)",
        scaleLineWidth: 1,
    };

    $scope.smallDatachart = {
        labels: [],
        datasets: [
            {
                fillColor: "rgba(52, 152, 219,1.0)",
                strokeColor: "rgba(52, 152, 219,0)",
                pointColor: "rgba(151,187,205,0)",
                pointStrokeColor: "#e67e22",
                data: []
   }
  ],
    };

    $scope.smallOptions = {};
    $scope.doRefresh = function () {
        $scope.calcTotal();
        $scope.$broadcast('scroll.refreshComplete');
    };
    $scope.calcTotal();
})

//NOTE: BudgetCtrl
.controller('BudgetCtrl', function ($scope, $rootScope, $ionicModal, $localstorage) {
    $scope.newBudget = {};
    $scope.newBudget.type = "week";
    $ionicModal.fromTemplateUrl('templates/newBudget.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function () {
        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
    });
    $scope.addBudget = function () {
        if ($scope.newBudget.type === "week") {
            $scope.newBudget.amount = parseInt($scope.newBudget.amount);
        } else {
            $scope.newBudget.amount = parseInt($scope.newBudget.amount) / 4;
        }
        $scope.newBudget.used = 0;
        $rootScope.user.budgets.push($scope.newBudget);
        $localstorage.setObject('user', $rootScope.user);
        $scope.newBudget = {};
        $scope.newBudget.type = "week";
        $scope.modal.hide();
        $scope.calcTotal();
    };
    $scope.totalBudget = 0;
    $scope.totalUsed = 0;
    $scope.calcTotal = function () {
        $scope.totalBudget = 0;
        $scope.totalUsed = 0;
        for (var i = 0; i < $rootScope.user.budgets.length; i++) {
            $scope.totalBudget += parseInt($rootScope.user.budgets[i].amount);
            $scope.totalUsed += parseInt($rootScope.user.budgets[i].used);
        }
    };
    $scope.doRefresh = function () {
        $scope.calcTotal();
        $scope.$broadcast('scroll.refreshComplete');
    };
    $scope.calcTotal();
})

.controller('BudgetDetailsCtrl', function ($scope, $rootScope, $ionicModal, $localstorage, $stateParams) {

    var budgets = $rootScope.user.budgets;
    for (var i = 0; i < budgets.length; i++) {
        if (budgets[i].name === $stateParams.id) {
            $scope.budget = budgets[i];
        }
    }

    $scope.transactions = [];
    var transactions = $rootScope.user.transactions;
    for (i = 0; i < transactions.length; i++) {
        if (transactions[i].budget.name === $stateParams.id) {
            $scope.transactions.push(transactions[i]);
        }
    }
})

//NOTE: SavingsCtrl
.controller('SavingsCtrl', function ($scope, $rootScope, $ionicModal, $localstorage) {
    $scope.newSaving = {};
    $scope.totalGoal = 0;
    $scope.totalSaved = 0;
    $scope.calcTotal = function () {
        $scope.totalGoal = 0;
        $scope.totalSaved = 0;
        for (var i = 0; i < $rootScope.user.savegoals.length; i++) {
            $scope.totalGoal += parseInt($rootScope.user.savegoals[i].amount);
            $scope.totalSaved += parseInt($rootScope.user.savegoals[i].saved);
        }
    };
    $scope.autoSave = "show";
    $ionicModal.fromTemplateUrl('templates/newSave.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function () {
        $scope.modal.show();
        var num = $rootScope.user.settings.defaultAccount;
        $scope.newSaving.account = $rootScope.user.accounts[num];
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    $scope.addSaving = function () {

        if ($rootScope.user.counter === null) {
            //alert("counter does not exist");
            $rootScope.user.counter.push(0);
        }

        $rootScope.user.counter++;
        $scope.newSaving.id = $rootScope.user.counter;
        $scope.newSaving.created = new Date();
        //alert("id: "+$scope.newSaving.id +" / counter: ");
        $scope.newSaving.amount = parseInt($scope.newSaving.amount);
        $scope.newSaving.saved = $scope.newSaving.amount / (Math.floor(Math.random() * 2) + 1.5);

        $rootScope.user.savegoals.push($scope.newSaving);

        $localstorage.setObject('user', $rootScope.user);
        $scope.newSaving = {};
        $scope.modal.hide();
        $scope.calcTotal();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
    });
    angular.element(document).ready(function () {
        $scope.calcTotal();
    });
})

//NOTE: SaveDetailsCtrl
.controller('SaveDetailsCtrl', function ($scope, $rootScope, $ionicModal, $localstorage, $stateParams) {

    var saveList = $rootScope.user.savegoals;
    var savingsObject;
    //alert($stateParams.saveId);
    for (var i = 0; i < saveList.length; i++) {
        if (saveList[i].id === $stateParams.saveId) {
            savingsObject = saveList[i];

            $scope.currentDate = new Date();
            $scope.name = savingsObject.name;
            $scope.description = savingsObject.description;
            $scope.genre = savingsObject.genre;
            $scope.deadline = savingsObject.deadline;
            $scope.amount = savingsObject.amount;
            $scope.saved = savingsObject.saved;
        }
    }
})

//Note: SettingsCtrl
.controller('SettingsCtrl', function ($scope, $ionicModal, $rootScope, $localstorage) {
    $scope.settings = $rootScope.user.settings;
    $scope.$watch('settings', function (newValue) { //NOTE: removed oldValue because it was not in use
        $rootScope.user.settings = newValue;
        $localstorage.setObject('user', $rootScope.user);
    }, true);
})

//NOTE: AccountsCtrl
.controller('AccountsCtrl', function ($scope, $ionicModal, $rootScope, $localstorage) {
    $scope.newAccount = {};
    $scope.listCanSwipe = true;
    $ionicModal.fromTemplateUrl('templates/newAccount.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function () {
        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };
    $scope.addAccount = function () {
        $scope.newAccount.balance = parseInt($scope.newAccount.balance);
        $rootScope.user.accounts.push($scope.newAccount);
        $localstorage.setObject('user', $rootScope.user);
        $scope.newAccount = {};
        $scope.modal.hide();
    };
    $scope.deleteAccount = function (index) {
        $rootScope.user.accounts.splice(index, 1);
        $localstorage.setObject('user', $rootScope.user);
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
    });
})

//NOTE: ContactsCtrl
.controller('ContactsCtrl', function ($scope, $rootScope, $ionicModal, $localstorage, $stateParams) {

    var contactsList = $rootScope.user.contacts;
    var contactObject;
    //alert($stateParams.saveId);
    for (var i = 0; i < contactsList.length; i++) {
        if (contactsList[i].id === $stateParams.saveId) {
            contactObject = contactsList[i];


            $scope.name = contactObject.name;
            $scope.description = contactObject.description;
            $scope.genre = contactObject.genre;
            $scope.deadline = contactObject.deadline;
            $scope.amount = contactObject.amount;
            $scope.saved = contactObject.saved;
        }
    }
})

//NOTE: EventsCtrl
.controller('EventsCtrl', function ($scope, $rootScope, $ionicModal, $localstorage) {
    $scope.newSaving = {};
    $scope.totalGoal = 0;
    $scope.totalSaved = 0;
    $scope.calcTotal = function () {
        $scope.totalGoal = 0;
        $scope.totalSaved = 0;
        for (var i = 0; i < $rootScope.user.savegoals.length; i++) {
            $scope.totalGoal += parseInt($rootScope.user.savegoals[i].amount);
            $scope.totalSaved += parseInt($rootScope.user.savegoals[i].saved);
        }
    };
    $scope.autoSave = "show";
    $ionicModal.fromTemplateUrl('templates/newEvent.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function () {
        $scope.modal.show();
        var num = $rootScope.user.settings.defaultAccount;
        $scope.newSaving.account = $rootScope.user.accounts[num];
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    $scope.addSaving = function () {

        if ($rootScope.user.counter === null) {
            //alert("counter does not exist");
            $rootScope.user.counter.push(0);
        }

        $rootScope.user.counter++;
        $scope.newSaving.id = $rootScope.user.counter;
        $scope.newSaving.created = new Date();
        //alert("id: "+$scope.newSaving.id +" / counter: ");
        $scope.newSaving.amount = parseInt($scope.newSaving.amount);
        $scope.newSaving.saved = $scope.newSaving.amount / (Math.floor(Math.random() * 2) + 1.5);

        $rootScope.user.savegoals.push($scope.newSaving);

        $localstorage.setObject('user', $rootScope.user);
        $scope.newSaving = {};
        $scope.modal.hide();
        $scope.calcTotal();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
    });
    angular.element(document).ready(function () {
        $scope.calcTotal();
    });
})

//NOTE: EventDetailsCtrl
.controller('EventDetailsCtrl', function ($scope, $rootScope, $ionicModal, $localstorage, $stateParams) {

    var eventsList = $rootScope.user.events;
    //alert(eventsList[0].name);
    for (var i = 0; i < eventsList.length; i++) {
        if (eventsList[i].id === $stateParams.eventId) {
            $scope.event = eventsList[i];
        }
    }
})

//NOTE: TransactionsCtrl
.controller('TransactionsCtrl', function ($scope, $ionicModal, $rootScope, $localstorage) {
    $scope.newTransaction = {};
    $ionicModal.fromTemplateUrl('templates/newTransaction.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function () {
        $scope.modal.show();
        var num = $rootScope.user.settings.defaultAccount;
        $scope.newTransaction.account = $rootScope.user.accounts[num];
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };
    $scope.addTransaction = function () {
        $scope.newAccount.balance = parseInt($scope.newAccount.balance);
        $rootScope.user.accounts.push($scope.newAccount);
        $localstorage.setObject('user', $rootScope.user);
        $scope.newAccount = {};
        $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
    });
    $scope.addTransaction = function () {
        var accountIndex;
        var budgetIndex;
        $rootScope.user.accounts.some(function (entry, i) {
            if (entry.name === $scope.newTransaction.account.name) {
                accountIndex = i;
                return true;
            }
        });
        $rootScope.user.budgets.some(function (entry, i) {
            if (entry.name === $scope.newTransaction.budget.name) {
                budgetIndex = i;
                return true;
            }
        });
        $scope.newTransaction.amount = parseInt($scope.newTransaction.amount);
        $scope.newTransaction.date = new Date();
        $rootScope.user.transactions.push($scope.newTransaction);
        $rootScope.user.accounts[accountIndex].balance -= $scope.newTransaction.amount;
        $rootScope.user.budgets[budgetIndex].used += $scope.newTransaction.amount;
        $localstorage.setObject('user', $rootScope.user);
        $scope.newTransaction = {};
        $scope.modal.hide();
    };
})

//NOTE: LoansCtrl
.controller('LoansCtrl', function ($scope, $rootScope, $ionicModal, $localstorage) {

    $scope.newLoan = {};
    $scope.totalLoan = 0;
    $scope.totalPayed = 0;

    $scope.calcTotal = function () {
        $scope.totalLoan = 0;
        $scope.totalPayed = 0;
        for (var i = 0; i < $rootScope.user.loans.length; i++) {
            $scope.totalLoan += parseInt($rootScope.user.loans[i].amount);
            $scope.totalPayed += parseInt($rootScope.user.loans[i].saved);
        }
    };

    $scope.autoSave = "show";
    $ionicModal.fromTemplateUrl('templates/newLoan.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function () {
        $scope.modal.show();
        var num = $rootScope.user.settings.defaultAccount;
        $scope.newLoan.account = $rootScope.user.accounts[num];
    };

    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    $scope.addLoan = function () {
        $scope.newLoan.amount = parseInt($scope.newLoan.amount);
        $scope.newLoan.payed = $scope.newLoan.amount / (Math.floor(Math.random() * 2) + 1.5);
        $rootScope.user.loans.push($scope.newLoan);
        $localstorage.setObject('user', $rootScope.user);
        $scope.newLoan = {};
        $scope.modal.hide();
        $scope.calcTotal();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
    });

    angular.element(document).ready(function () {
        $scope.calcTotal();
    });
})

//NOTE: PaymentsCtrl
.controller('PaymentsCtrl', function ($scope, $ionicModal, $rootScope, $localstorage) {
    $scope.newTransaction = {};
    $ionicModal.fromTemplateUrl('templates/newPayment.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function (payment) {

        payment = payment || null;
        //alert(payment.name);
        $scope.newTransaction.id = "";
        $scope.newTransaction.name = "";
        $scope.newTransaction.to = "";
        $scope.newTransaction.amount = "";

        var num = $rootScope.user.settings.defaultAccount;
        $scope.newTransaction.account = $rootScope.user.accounts[num];

        if (payment) {
            $scope.newTransaction.id = payment.id;
            $scope.newTransaction.name = payment.name;
            $scope.newTransaction.amount = payment.amount;

            var contactList = $rootScope.user.contacts;
            var test = false;
            for (var i = 0; i < contactList.length; i++) {
                //alert(contactList[i].name+" testing against "+payment.from);

                if (contactList[i].name === payment.from) {
                    $scope.newTransaction.to = contactList[i];
                    test = true;
                    //alert(contactList[i]+" if is true");
                } else if (!test) {
                    $scope.newTransaction.to = "";
                }
            }
            //alert("Payment from: " + payment.from + " / Scope: " + $scope.newTransaction.to);
        }

        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };
    $scope.addTransaction = function () {
        $scope.newAccount.balance = parseInt($scope.newAccount.balance);
        $rootScope.user.accounts.push($scope.newAccount);
        $localstorage.setObject('user', $rootScope.user);
        $scope.newAccount = {};
        $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
    });
    $scope.addTransaction = function () {
        var accountIndex;
        var budgetIndex;
        $rootScope.user.accounts.some(function (entry, i) {
            if (entry.name === $scope.newTransaction.account.name) {
                accountIndex = i;
                return true;
            }
        });
        $rootScope.user.budgets.some(function (entry, i) {
            if (entry.name === $scope.newTransaction.budget.name) {
                budgetIndex = i;
                return true;
            }
        });
        $scope.newTransaction.amount = parseInt($scope.newTransaction.amount);
        $scope.newTransaction.date = new Date();
        $scope.newTransaction.type = "Utgående";
        $rootScope.user.transactions.push($scope.newTransaction);
        $rootScope.user.accounts[accountIndex].balance -= $scope.newTransaction.amount;
        $rootScope.user.budgets[budgetIndex].used += $scope.newTransaction.amount;
        $localstorage.setObject('user', $rootScope.user);

        var paymentList = $rootScope.user.payments;
        for (var i = 0; i < paymentList.length; i++) {
            if (paymentList[i].id === $scope.newTransaction.id) {
                paymentList.splice(i, 1);
            }
        }
        $scope.newTransaction = {};
        $scope.modal.hide();
    };
});