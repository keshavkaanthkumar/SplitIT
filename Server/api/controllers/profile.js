const expenseService = require("../services/expense-service");
const profileService = require("../services/profile-service");
const splitWiseAPIService = require("../services/splitwiseAPI-service");
const usersService = require("../services/users-service");
const settleService = require("../services/settlement-service");

module.exports.profileRead = function(req, res) {
    profileService.getProfileData(req, res);
};
module.exports.deleteAllUsers = function(req, res) {
    usersService.deleteAllUsers(req, res);
};
module.exports.importSplitWiseData = function(req, res) {
    splitWiseAPIService.importData(req, res);
};
module.exports.deleteExpenseById = function(req, res) {
    expenseService.deleteExpenseById(req, res);
};
module.exports.getSplitWiseAuthUrl = function(req, res) {
    splitWiseAPIService.getSplitWiseAuthenticationUrl(req, res);
};
module.exports.deleteAllExpenses = function(req, res) {
    expenseService.deleteAllExpenses(req, res);
};
module.exports.addExpense = function(req, res) {
    const resolve = expense => {
        res.status(200);
        res.json(expense);
    };
    const request = Object.assign({}, req.body);
    usersService.findAllUsers().then(users => {
        request.addedByName = usersService.findUserNameByEmail(
            users,
            request.addedBy
        );
        request.paidByName = usersService.findUserNameByEmail(
            users,
            request.paidBy
        );
        request.split.forEach(split => {
            split.userName = usersService.findUserNameByEmail(
                users,
                split.userEmail,
                request.addedByName
            );
        });
        console.log("Request " + request);
        expenseService
            .addExpense(request)
            .then(resolve)
            .catch(renderErrorResponse(res));
    });
};
module.exports.settle = function(req, res) {
    const resolve = expense => {
        res.status(200);
        res.json(expense);
    };
    const request = Object.assign({}, req.body);
    request.date = Date.now();
    console.log("Request " + request);
    settleService
        .settle(request)
        .then(resolve)
        .catch(renderErrorResponse(res));
};
let renderErrorResponse = response => {
    const errorCallback = error => {
        if (error) {
            console.log(error);
            response.status(500);
            response.json({
                message: error.message
            });
        }
    };
    return errorCallback;
};
module.exports.deleteSettlementById = function(req, res) {
    settleService.deleteSettlementById(req, res);
};
module.exports.deleteAllSettlements = function(req, res) {
    settleService.deleteAllSettlements(req, res);
};