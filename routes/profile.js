var express = require('express');
var router = express.Router();

router.get('/', isLoggedIn, function (req, res) {
    var db = req.db;
    var collection = db.get('poll');
    
    collection.find({ "obj.pollOwnerID": req.user.twitter.id }, {}, function (e, docs) {
        res.render('profile', { docs: docs, user: req.user });
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
};