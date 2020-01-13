var passport = require("passport");
var mongoose = require("mongoose");
var User = mongoose.model("User");
const expenseService = require("../services/expense-service");
const userService = require("../services/users-service");

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res) {
  // if(!req.body.name || !req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }

  var user = new User();

  user.name = req.body.name;
  user.email = req.body.email;

  user.setPassword(req.body.password);
  userService
    .checkIfEmailAddressExits(req.body.email)
    .then(usersCollectionSize => {
      if (usersCollectionSize.length > 0) {
        console.log(usersCollectionSize);
        res.status(200).json("Username already exits");
      } else {
        expenseService
          .updateSplitExpenseUserName(user.name, user.email)
          .then(expenseRes => {
            expenseService
              .updatePaidByUserName(user.name, user.email)
              .then(result => {
                user.save(function(err) {
                  var token;
                  token = user.generateJwt();
                  res.status(200);
                  res.json({
                    token: token
                  });
                });
              });
          });
      }
    });
};

module.exports.login = function(req, res) {
  // if(!req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }

  passport.authenticate("local", function(err, user, info) {
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if (user) {
      token = user.generateJwt();
      res.status(200);
      res.json({
        token: token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);
};
