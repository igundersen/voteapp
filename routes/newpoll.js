var express = require('express');
var router = express.Router();

router.get('/', isLoggedIn, function (req, res, next) {
    var isLoggedIn = false
    if (req.isAuthenticated()) {
        isLoggedIn = true
    };
    res.render('newpoll')
});

router.post('/', function (req, res) {
    //Setting up the DB
    var _db = req.db;
    var collection = _db.get('poll');

    //Getting the information from the query
    var _pollOwnerName = req.user.twitter.displayName;
    var _pollOwnerID = req.user.twitter.id;
    var _pollName = req.body.pollName;
    var _pollOptions = req.body.pollOptions;

    //Splitting the poll options
    _pollOptions = _pollOptions.split("\n");

    //Creating the obj. that we should store
    var obj = {
        pollName: _pollName,
        pollOwnerName: _pollOwnerName,
        pollOwnerID: _pollOwnerID,
        pollOptions: []
    };

    //Adding the options for the poll
    var i = 0;
    _pollOptions.forEach(function (element) {
        obj.pollOptions.push({
            pollAltName: element,
            pollAltID: i,
            pollNumbers: 0
        })
        i++;
    }, this);

    //Storing it in the DB
    collection.insert({
        obj
    }, function (err, doc) {
        if (err) {
            //TODO - Error msg.
            res.send("There was a problem adding the information to the database.");
        }
        else {
            //Redirect
            var uri = '/polls/' + doc._id;
            res.redirect(uri)
        }
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
};