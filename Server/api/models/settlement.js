var mongoose = require("mongoose");
var settlementSchema = new mongoose.Schema({
  paidBy: {
    type: String
  },
  paidTo: {
    type: String
  },
  date: {
    type: Date
  },
  amount: {
    type: Number
  }
});
module.exports = mongoose.model("settlement", settlementSchema);
