/**
 * Service for profile operations.
 */

"use strict";
const mongoose = require("mongoose"),
    Expense = mongoose.model("Expense");
var User = mongoose.model("User");
var Settle = mongoose.model("settlement");
const friendsService = require("../services/friends-service");
const expenseService = require("../services/expense-service");
/**
 * Get User profile data
 *
 * @param {Object} params {Search parameters}
 */
exports.getProfileData = function(req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            message: "UnauthorizedError: private profile"
        });
    } else {
        var profile = {
            userInfo: {},
            friends: [],
            expenses: [],
            settlementsIncoming: [],
            settlementsOutgoing: [],
            trends: {
                totalBalance: 0,
                totalShare: 0,
                paymentsMade: 0,
                totalChangeInBalance: 0
            },
            dashboard: {
                totalBalance: 0,
                owe: {
                    amount: 0,
                    oweToUsers: []
                },
                get: {
                    amount: 0,
                    getFromUsers: []
                }
            }
        };
        User.findById(req.payload._id).exec(function(err, user) {
            profile.userInfo = user;
            Expense.find({ "split.userEmail": user.email }).exec(function(
                err,
                expenses
            ) {
                profile.expenses = expenses.sort((a, b) => b.date - a.date);
                profile.friends = friendsService.findFriends(expenses, user.email);
                profile.dashboard = expenseService.simplifyDashboard(
                    expenseService.calculateDashBoard(profile)
                );
                Settle.find({ paidBy: user.email }).exec(function(err, settlements) {
                    profile.settlementsOutgoing = settlements;
                    profile.dashboard = expenseService.simplifyDashboard(
                        expenseService.calculateDashBoard(profile)
                    );
                    Settle.find({ paidTo: user.email }).exec(function(err, settlements) {
                        profile.settlementsIncoming = settlements;

                        profile.dashboard = expenseService.simplifyDashboard(
                            expenseService.calculateDashBoard(profile)
                        );
                        profile.trends = expenseService.findTrendsData(
                            expenses,
                            profile.dashboard.totalBalance,
                            user.email
                        );
                        res.status(200).json(profile);
                    });
                });
            });

            console.log("Profile" + profile);
        });
    }
};