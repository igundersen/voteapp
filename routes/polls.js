var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.redirect("/")
});

router.get('/:id', function (req, res, next) {
  var id = req.params.id;
  var db = req.db;
  var collection = db.get('poll');

  var _pollData = {
    "type": "pie",
    "theme": "light",
    "dataProvider": [],
    "titleField": "title",
    "valueField": "value",
    "labelRadius": 5,
    "radius": "42%",
    "innerRadius": "60%",
    "labelText": "[[title]]",
    "export": {
      "enabled": true
    }
  };

  collection.findOne({ _id: id }, {}, function (e, docs) {
    if(!docs) {
      res.redirect("/");
    }
    var _pollOptions = docs.obj.pollOptions;
    _pollOptions.forEach(function (element) {
      _pollData.dataProvider.push({
        title: element.pollAltName,
        value: element.pollNumbers
      })
    }, this);
    res.render('polls', { docs: docs, pollData: _pollData });
  });
});

router.post('/:id', function (req, res, next) {
  
  var selectedVote = parseInt(req.body.list);
  var id = req.params.id;
  var db = req.db;
  var collection = db.get('poll');

  collection.findOneAndUpdate({ "_id": id, "obj.pollOptions.pollAltID": selectedVote }, {
    $inc: {
      "obj.pollOptions.$.pollNumbers": 1
    }
  }, function (e, docs) {
    res.redirect("/polls/" + id );
  });
});

module.exports = router;
