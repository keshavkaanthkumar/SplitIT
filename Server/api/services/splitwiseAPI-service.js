"use strict";
const expenseService = require("../services/expense-service");

/**
 * Service for importing splitwise data
 *
 * @param {Object} params {Search parameters}
 */
const qs = require("querystring");
const OAuth = require("oauth");
const Splitwise = require("splitwise");
const CONSUMER_KEY = "bXeLBMOnkN6B5XSOj5Dc2CyeeVUZ8C4CAwmqIgaB";
const CONSUMER_SECRET = "mtXwT7gynrzDiWwaXHU35OlcMAU53pwizQOECAmI";
const TOKEN_URL = "/oauth/token";
const AUTHORIZE_URL = "/oauth/authorize";
const MY_CALLBACK_URL = "http://localhost:4200/profile";
const BASE_SITE = "https://www.splitwise.com";

var authURL;
const client = new OAuth.OAuth2(
    CONSUMER_KEY,
    CONSUMER_SECRET,
    BASE_SITE,
    AUTHORIZE_URL,
    TOKEN_URL,
    null
);

exports.getSplitWiseAuthenticationUrl = function(req, res) {
    authURL = client.getAuthorizeUrl({
        redirect_uri: MY_CALLBACK_URL,
        response_type: "code"
    });
    res.status(200).json(authURL);
};
exports.importData = function(req, res) {
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

    const resolve = imported => {
        console.log(imported);
        res.status(200);
        res.json(imported);
    };
    const accessCode = req.query.accessCode;
    client.getOAuthAccessToken(
        accessCode, {
            redirect_uri: MY_CALLBACK_URL,
            grant_type: "authorization_code"
        },
        function(e, access_token, refresh_token, results) {
            if (e) {
                console.log(e);
                res.end(JSON.stringify(e));
            } else if (results.error) {
                console.log(results);
                res.end(JSON.stringify(results));
            } else {
                console.log("Obtained access_token: ", access_token);
                var splitWiseData = {
                    expenses: [],
                    friends: []
                };
                client.get(
                    "https://secure.splitwise.com/api/v3.0/get_expenses?limit=1000&&order=date",
                    access_token,
                    function(e, data, response) {
                        if (e) console.error(e);
                        var parsedData = JSON.parse(data);
                        splitWiseData.expenses = parsedData.expenses;
                        client.get(
                            "https://secure.splitwise.com/api/v3.0/get_friends",
                            access_token,
                            function(e, friendsData, response) {
                                if (e) console.error(e);
                                client.get(
                                    "https://secure.splitwise.com/api/v3.0/get_current_user",
                                    access_token,
                                    function(e, currentuser, response) {
                                        if (e) console.error(e);
                                        var parsedFriends = JSON.parse(friendsData);
                                        var parsedCurrentUser = JSON.parse(currentuser);
                                        parsedFriends.friends.push(parsedCurrentUser.user);
                                        splitWiseData.friends = parsedFriends.friends;
                                        console.log(splitWiseData);
                                        expenseService
                                            .importSplitWiseData(splitWiseData)
                                            .then(resolve)
                                            .catch(renderErrorResponse(res));
                                    }
                                );
                            }
                        );
                    }
                );
            }
        }
    );
};