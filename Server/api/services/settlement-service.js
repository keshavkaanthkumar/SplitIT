"use strict";
const mongoose = require("mongoose"),
    Settlement = mongoose.model("settlement");
/**
 * Service for Settlement operations.
 */

exports.settle = function(settle) {
    const settleObj = new Settlement(settle);
    const promise = settleObj.save();
    return promise;
};
exports.deleteSettlementById = function(request, response) {
    var settlementId = request.params.settlementId;
    Settlement.remove({ _id: settlementId }).exec(function(err, removed) {
        console.log(removed);
        response.status(200).json(removed);
    });
};
exports.deleteAllSettlements = function(req, response) {
    Settlement.remove().exec(function(err, settlement) {
        console.log(settlement);
        response.status(200).json(settlement);
    });
};
exports.settleMany = function(settleManyArray) {
    const promise = Settlement.insertMany(settleManyArray);
    return promise;
};