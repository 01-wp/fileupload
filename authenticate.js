/***************************************************************
 * WIX APP AUTHENTICATION
 *
 * Used to authenticate each url request as a Wix request.
 * Uses openapi-node library provided by Wix.
 * Required for all requests to and from Wix.
 ***************************************************************/
var express = require('express');
var app = express();
var wix = require('openapi-node');


//heroku
var APP_SECRET = process.env.APP_SECRET;
var APP_ID = process.env.APP_ID;
var DEBUG = process.env.DEBUG;

/**
 * Exports the authenticate function to be used as middleware
 * in between every server request made by the Rolling Notes Settings
 * or Widget endpoint.
 *
 * @param req - server request
 * @param res - server response
 */
exports.authenticate = function authenticate(req, res) {
    var instance = req.query.instance;
    if (DEBUG) return true;

    try {
        /* Parse the instance parameter */
        var wixInstance = wix.getConnect();
        var wixParse = wixInstance.parseInstance(instance, APP_SECRET, function(date) {
            return true;
        });

        var instanceId = wixParse.instanceId;

        /* Get a shortcut for the Wix RESTful API */
        wixAPI = wix.getAPI(APP_SECRET, APP_ID, instanceId);

        /* save instanceId and compId in request to be used in routes/index.js*/
        req.instanceId = instanceId;
        req.compId = req.query.compId;
        req.origCompId = req.query.origCompId;
    } catch(e) {
        console.log(e);
        title = "Wix API init failed. Check your app key, secret and instance Id";
        console.log( title );
        res.send( title );
    }
}