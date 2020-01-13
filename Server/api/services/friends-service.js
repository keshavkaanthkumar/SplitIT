/**
 * Service for Friends operations.
 */

"use strict";
const mongoose = require("mongoose");

/**
 * Add Expense
 *
 * @param {Object} params {Search parameters}
 */

exports.findFriends = function(expenses, loggedInUserEmail) {
  var friends = [];
  expenses.forEach(expense => {
    expense.split.forEach(splitEntry => {
      if (splitEntry.userEmail != loggedInUserEmail) {
        if (friends.filter(v => v.email == splitEntry.userEmail).length == 0) {
          friends.push({
            name: splitEntry.userName,
            email: splitEntry.userEmail,
            linkedExpenses: []
          });
        }
      }
    });
  });
  friends.forEach(friend => {
    expenses.forEach(expense => {
      if (
        (expense.paidBy === loggedInUserEmail ||
          expense.paidBy === friend.email) &&
        expense.split.filter(v => v.userEmail == friend.email).length > 0
      ) {
        friend.linkedExpenses.push(expense);
      }
    });
  });
  return friends;
};
