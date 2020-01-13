/**
 * Service for Expenses operations.
 */

"use strict";
const mongoose = require("mongoose"),
    Expense = mongoose.model("Expense");
const settlementService = require("../services/settlement-service");

/**
 * Add Expense
 *
 * @param {Object} params {Search parameters}
 */
exports.addExpense = function(expense) {
    const expenseObj = new Expense(expense);
    const promise = expenseObj.save();
    return promise;
};

exports.findTrendsData = function(expenses, totalBalanceParam, userEmailParam) {
    var totalShare = expenses
        .map(v => {
            if (v.split.find(a => a.userEmail === userEmailParam) != null) {
                var splitEntry = v.split.find(a => a.userEmail === userEmailParam);
                return splitEntry.owes;
            }
        })
        .reduce((a, b) => a + b, 0);
    var paymentsMade = expenses
        .map(v => {
            if (v.paidBy === userEmailParam) {
                return v.amount;
            }
            return 0;
        })
        //  console.log(paymentsMade);
        .reduce((a, b) => a + b, 0);

    return {
        totalBalance: totalBalanceParam,
        totalShare: totalShare,
        paymentsMade: paymentsMade,
        totalChangeInBalance: paymentsMade - totalShare
    };
};
/**
 * Update username
 */
exports.updateSplitExpenseUserName = function(userName, email) {
    const promise = Expense.update({ "split.userEmail": email }, { $set: { "split.$.userName": userName } }).exec(function(err, res) {
        console.log("Error" + err);
        console.log("Response" + res);
    });
    return promise;
};

exports.updatePaidByUserName = function(userName, email) {
    const promise = Expense.updateMany({ paidBy: email }, { $set: { paidByName: userName } }).exec();
    return promise;
};
exports.deleteAllExpenses = function(req, response) {
    Expense.remove().exec(function(err, expense) {
        console.log(expense);
        response.status(200).json(expense);
    });
};
/**
 * Dashboard calculation
 */
exports.calculateDashBoard = function(profile) {
    var userEmail = profile.userInfo.email;
    var owe = 0;
    var get = 0;
    var dashboard = {
        totalBalance: 0,
        owe: {
            amount: 0,
            oweToUsers: []
        },
        get: {
            amount: 0,
            getFromUsers: []
        }
    };
    profile.expenses.forEach(expense => {
        expense.lent = this.calculateLentAmount(expense);
        if (expense.paidBy != userEmail) {
            var expenseSplit = expense.split.find(v => v.userEmail == userEmail);
            this.appendOweToUsers(expense, dashboard.owe.oweToUsers, expenseSplit);
            owe = owe + expenseSplit.owes;
        }
        if (expense.paidBy === userEmail) {
            this.appendGetFromUsers(expense, dashboard.get.getFromUsers);
            get = get + expense.lent;
        }
    });

    profile.settlementsIncoming.forEach(settlement => {
        if (
            dashboard.owe.oweToUsers.filter(v => v.email == settlement.paidBy)
            .length > 0
        ) {
            var arrayEntry = dashboard.owe.oweToUsers.find(
                v => v.email == settlement.paidBy
            );
            arrayEntry.amount = arrayEntry.amount + settlement.amount;
        } else {
            dashboard.owe.oweToUsers.push({
                email: settlement.paidBy,
                name: settlement.paidBy,
                amount: parseFloat(settlement.amount.toFixed(2))
            });
        }
        owe = owe + settlement.amount;
    });

    profile.settlementsOutgoing.forEach(settlement => {
        if (
            dashboard.get.getFromUsers.filter(v => v.email == settlement.paidTo)
            .length > 0
        ) {
            var arrayEntry = dashboard.get.getFromUsers.find(
                v => v.email == settlement.paidTo
            );
            arrayEntry.amount = arrayEntry.amount + settlement.amount;
        } else {
            dashboard.get.getFromUsers.push({
                name: settlement.paidTo,
                email: settlement.paidTo,
                amount: parseFloat(settlement.amount.toFixed(2))
            });
        }

        get = get + settlement.amount;
    });

    dashboard.owe.amount = parseFloat(owe.toFixed(2));
    dashboard.get.amount = parseFloat(get.toFixed(2));
    dashboard.totalBalance = parseFloat((get - owe).toFixed(2));
    return dashboard;
};

exports.calculateLentAmount = function(expense) {
    var lentAmount = 0;
    var paidByEmail = expense.paidBy;
    expense.split.forEach(splitEntry => {
        if (splitEntry.userEmail != paidByEmail) {
            lentAmount = lentAmount + splitEntry.owes;
        }
    });

    return parseFloat(lentAmount.toFixed(2));
};

exports.simplifyDashboard = function(dashboard) {
    var clonedArray = dashboard.owe.oweToUsers.slice(0);
    clonedArray.forEach(oweEntry => {
        var getEntry = dashboard.get.getFromUsers.find(
            v => v.email === oweEntry.email
        );
        if (getEntry) {
            var oweAmount = oweEntry.amount;
            var getAmount = getEntry.amount;
            if (oweAmount > getAmount) {
                oweEntry.amount = oweEntry.amount - getEntry.amount;

                var getEntryIndex = dashboard.get.getFromUsers.findIndex(
                    v => v.email === getEntry.email
                );
                dashboard.get.getFromUsers.splice(getEntryIndex, 1);
            } else if (oweAmount < getAmount) {
                getEntry.amount = getEntry.amount - oweEntry.amount;
                var oweEntryIndex = dashboard.owe.oweToUsers.findIndex(
                    v => v.email === oweEntry.email
                );
                dashboard.owe.oweToUsers.splice(oweEntryIndex, 1);
            } else if (oweAmount === getAmount) {
                var getEntryIndex = dashboard.get.getFromUsers.findIndex(
                    v => v.email === getEntry.email
                );
                var oweEntryIndex = dashboard.owe.oweToUsers.findIndex(
                    v => v.email === oweEntry.email
                );
                dashboard.owe.oweToUsers.splice(oweEntryIndex, 1);
                dashboard.get.getFromUsers.splice(getEntryIndex, 1);
            }
        }
    });
    dashboard.owe.amount = this.calculateOweGetAmount(dashboard.owe.oweToUsers);
    dashboard.get.amount = this.calculateOweGetAmount(dashboard.get.getFromUsers);
    dashboard.totalBalance = dashboard.get.amount - dashboard.owe.amount;

    return dashboard;
};
exports.calculateOweGetAmount = function(usersArray) {
    var amount = 0;
    usersArray.forEach(user => {
        amount = amount + user.amount;
    });
    return amount;
};
exports.appendOweToUsers = function(expense, oweToUsers, expenseSplit) {
    if (oweToUsers.filter(v => v.email == expense.paidBy).length > 0) {
        var arrayEntry = oweToUsers.find(v => v.email == expense.paidBy);
        arrayEntry.amount = arrayEntry.amount + expenseSplit.owes;
    } else {
        oweToUsers.push({
            email: expense.paidBy,
            name: expense.paidByName,
            photo: expense.paidByPhoto,
            amount: parseFloat(expenseSplit.owes.toFixed(2))
        });
    }
};
exports.getFullName = function(user) {
    return `${user.first_name} ${user.last_name}`;
};
exports.findEmail = function(friends, name) {
    return friends.find(v => this.getFullName(v) === name).email;
};

exports.importSplitWiseData = function(splitWiseData) {
    var expenses = [];
    var settlements = [];
    var filteredExpenses = splitWiseData.expenses.filter(
        e => e.currency_code === "USD"
    );
    filteredExpenses.forEach(splitWiseExpense => {
        try {
            //  var isgroup = splitWiseExpense.group_id === null;
            var expensePaidByName = this.getFullName(
                this.findPaidBy(splitWiseExpense)
            );
            var trimmedExpensePaidByName = expensePaidByName
                .replace("null", "")
                .trim();
            var paidByEmail = this.findEmail(
                splitWiseData.friends,
                expensePaidByName
            );
            if (!splitWiseExpense.payment) {
                var expensePaidByPhoto = this.findPaidBy(splitWiseExpense).picture
                    .medium;
                var addedByName = this.getFullName(splitWiseExpense.created_by);
                var trimmedAddedByName = addedByName.replace("null", "").trim();
                var expense = {
                    addedBy: this.findEmail(splitWiseData.friends, addedByName),
                    addedByName: trimmedAddedByName,
                    amount: splitWiseExpense.cost,
                    currency: "$",
                    date: splitWiseExpense.created_at,
                    paidBy: paidByEmail,
                    paidByName: trimmedExpensePaidByName,
                    paidByPhoto: expensePaidByPhoto,
                    title: splitWiseExpense.description,
                    lent: 0,
                    split: []
                };
                splitWiseExpense.users.forEach(userEntry => {
                    var fullName = this.getFullName(userEntry.user);
                    var trimmedFullName = fullName.replace("null", "").trim();
                    var splitEntry = {
                        owes: parseFloat(userEntry.owed_share),
                        userEmail: this.findEmail(splitWiseData.friends, fullName),
                        userName: trimmedFullName,
                        photo: userEntry.user.picture.medium
                    };
                    expense.split.push(splitEntry);
                });
                expense.lent = this.calculateLentAmount(expense);
                expenses.push(expense);
            } else {
                var expensePaidTo = this.getFullName(this.findPaidTo(splitWiseExpense));
                var settlement = {
                    paidBy: paidByEmail,
                    paidTo: this.findEmail(splitWiseData.friends, expensePaidTo),
                    amount: splitWiseExpense.cost
                };
                settlements.push(settlement);
            }
        } catch (err) {
            console.log(err);
        }
    });
    const settlementPromise = settlementService.settleMany(settlements);
    const expensepromise = Expense.insertMany(expenses);

    return Promise.all([settlementPromise, expensepromise]);
};
exports.findPaidBy = function(splitWiseExpenseParam) {
    return splitWiseExpenseParam.users.find(
        v => v.paid_share == splitWiseExpenseParam.cost
    ).user;
};
exports.deleteExpenseById = function(request, response) {
    var expenseId = request.params.expenseId;
    Expense.remove({ _id: expenseId }).exec(function(err, removed) {
        console.log(removed);
        response.status(200).json(removed);
    });
};
exports.findPaidTo = function(splitWiseExpenseParam) {
    return splitWiseExpenseParam.users.find(
        v => v.owed_share == splitWiseExpenseParam.cost
    ).user;
};
exports.appendGetFromUsers = function(expense, getFromUsersArray) {
    var paidByEmail = expense.paidBy;
    expense.split.forEach(splitEntry => {
        if (splitEntry.userEmail != paidByEmail) {
            if (
                getFromUsersArray.filter(v => v.email == splitEntry.userEmail).length >
                0
            ) {
                var arrayEntry = getFromUsersArray.find(
                    v => v.email == splitEntry.userEmail
                );
                arrayEntry.amount = arrayEntry.amount + splitEntry.owes;
            } else {
                getFromUsersArray.push({
                    photo: splitEntry.photo,
                    name: splitEntry.userName,
                    email: splitEntry.userEmail,
                    amount: parseFloat(splitEntry.owes.toFixed(2))
                });
            }
        }
    });
};