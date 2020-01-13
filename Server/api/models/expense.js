var mongoose = require("mongoose");

var expenseSchema = new mongoose.Schema({
  addedBy: {
    type: String
  },
  addedByName: {
    type: String
  },
  title: {
    type: String
  },
  amount: {
    type: Number
  },
  currency: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  paidBy: {
    type: String
  },
  lent: {
    type: Number
  },
  paidByName: {
    type: String
  },
  paidByPhoto: {
    type: String
  },
  split: [
    {
      owes: {
        type: Number
      },
      userEmail: {
        type: String
      },
      userName: {
        type: String
      },
      photo: {
        type: String
      }
    }
  ]
});
module.exports = mongoose.model("Expense", expenseSchema);
