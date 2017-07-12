var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  var db = req.db;
  var collection = db.get('poll');
  var isLoggedIn = false;
  if (req.isAuthenticated()) {
    isLoggedIn = true
  };
  collection.find({}, {}, function (e, docs) {
    res.render('index', { docs: docs, isLoggedIn: isLoggedIn });
  }); 
});

module.exports = router;
