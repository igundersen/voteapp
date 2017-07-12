var TwitterStrategy = require('passport-twitter').Strategy;
var configAuth = require('./auth');
var db = require('./db');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        var collection = db.get('user');
        collection.findOne({ _id: id }, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new TwitterStrategy({
        consumerKey: configAuth.twitterAuth.consumerKey,
        consumerSecret: configAuth.twitterAuth.consumerSecret,
        callbackURL: configAuth.twitterAuth.callbackURL,
    },
        function (token, tokenSecret, profile, done) {
            process.nextTick(function () {
                var collection = db.get('user');

                collection.findOne({ 'twitter.id': profile.id }, {}, function (err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, user);
                    } else {
                        var twitter = {
                            id: profile.id,
                            token: token,
                            username: profile.username,
                            displayName: profile.displayName
                        };
                        collection.insert({
                            twitter
                        }, function (err, doc) {
                            if (err) {
                                throw err;
                            }
                            else {
                                return done(null, twitter)
                            }
                        });
                    }
                });
            });
        }));

};