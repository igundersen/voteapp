var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/twitter', passport.authenticate('twitter'));

router.get('/logout', function (req, res, next) {
  req.session.destroy(function(err) {
    res.redirect('/');
  });
});

router.get('/twitter/callback', passport.authenticate('twitter', {
  successRedirect: '/profile',
  failureRedirect: '/',
}));

module.exports = router;
