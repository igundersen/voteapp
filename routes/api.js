var express = require('express');
var router = express.Router();

router.delete('/poll/:id', function (req, res) {
    var id = req.params.id;
    var db = req.db;
    var collection = db.get('poll');
    collection.remove({_id: id},{},function(e,docs){
        res.send("OK");
    });
})

module.exports = router;
