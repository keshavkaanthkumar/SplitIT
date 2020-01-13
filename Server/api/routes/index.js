var express = require("express");
var router = express.Router();
var jwt = require("express-jwt");
var auth = jwt({
    secret: "MY_SECRET",
    userProperty: "payload"
});

var ctrlProfile = require("../controllers/profile");
var ctrlAuth = require("../controllers/authentication");

//delete expense
router.delete("/expense/:expenseId", ctrlProfile.deleteExpenseById)
    // profile
router.get("/profile", auth, ctrlProfile.profileRead);
// adding expense
router.post("/expense", ctrlProfile.addExpense);
//delete all users
router.delete("/deleteusers", ctrlProfile.deleteAllUsers);
//deete all expenses
router.delete("/deleteexpenses", ctrlProfile.deleteAllExpenses);
//register a user
router.post("/register", ctrlAuth.register);
//login user
router.post("/login", ctrlAuth.login);
//settlements
router.post("/settlement", ctrlProfile.settle);
//delete a settlement
router.delete("/settlement/:settlementId", ctrlProfile.deleteSettlementById);
//delete all settlements
router.delete("/deletesettlements", ctrlProfile.deleteAllSettlements);
//import SplitWise data using API
router.get("/getSplitWiseAuthUrl", ctrlProfile.getSplitWiseAuthUrl);
router.get("/importSplitWiseData", ctrlProfile.importSplitWiseData);
module.exports = router;