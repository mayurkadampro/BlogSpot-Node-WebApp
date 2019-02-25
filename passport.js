var localStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('./db/User')
var keys = require('./db/key');


module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user)
    })
    passport.deserializeUser(function (user, done) {
        done(null, user)
    })
	
	passport.use(new GoogleStrategy({
        callbackURL: '/auth/google/redirect',
        clientID : keys.googleAuth.clientID,
        clientSecret : keys.googleAuth.clientSecret
    },(accessToken,refreshToken,profile,done) => {
        //check if user already exits in our db or not
        User.findOne({googleId:profile.id}).then((currentUser) => {
            if(currentUser)
            {
                // already exits
                console.log('user is ',currentUser);
                done(null,currentUser);
            }else {
                new User({
                    username: profile.displayName,
					email : profile.emails[0].value,
                    googleId: profile.id,
                    thumbnail: profile._json.image.url
                }).save().then((newUser) => {
                    console.log('new user created '+newUser);
                    done(null,newUser);
                })
            }
        })
    })

);

    passport.use(new localStrategy(function (username, password, done) {
        User.findOne({
            username: username
        }, function (err, doc) {
            if (err) {
                done(err)
            } else {
                if (doc) {
                    var valid = doc.comparePassword(password, doc.password)
                    if (valid) {
                        // do not add password hash to session
                        done(null, {
                            username: doc.username,
                            id: doc._id
                        })
                    } else {
                        done(null, false)
                    }
                } else {
                    done(null, false)
                }
            }
        })
    }))
}