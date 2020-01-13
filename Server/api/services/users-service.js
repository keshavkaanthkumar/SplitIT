"use strict";
const mongoose = require("mongoose"),
    User = mongoose.model("User");
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "splititwise@gmail.com",
        pass: "splitit2019$"
    }
});
module.exports.findAllUsers = function() {
    const users = User.find({}).exec();
    return users;
};
/**
 * Delete all users from Mongo DB
 */
module.exports.deleteAllUsers = function(req, response) {
    User.remove().exec(function(err, user) {
        console.log(user);
        response.status(200).json(user);
    });
};
/**
 * Check if email exists in db
 */
module.exports.checkIfEmailAddressExits = function(emailAddress) {
    const promise = User.find({ email: emailAddress }).exec();
    return promise;
};
/**
 * Find user name from email
 */
module.exports.findUserNameByEmail = function(
    users,
    emailParam,
    loggedInUserName
) {
    var user = users.find(u => u.email === emailParam);
    if (user == undefined) {
        this.inviteUser(emailParam, loggedInUserName);
        return `${emailParam} Invited`;
    } else {
        return user.name;
    }
};
/**
 * Invite user by sending email
 */
module.exports.inviteUser = function(email, userName) {
    var mailOptions = {
        from: "splititwise@gmail.com",
        to: email,
        subject: `${userName} is still waiting for you to join SplitIT`,
        html: `<h3> A new expense has been added to your account by ${userName} <br /> Please register using the below email address to join :) <br />${email}<br/> <a href="http://localhost:4200/register">Register</a></h3>`
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
};