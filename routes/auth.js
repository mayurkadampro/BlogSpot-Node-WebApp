var express = require('express');
var router = express.Router();
var User = require('../db/User');
var passport = require("passport");

/* GET home page. */



module.exports = function (passport) {
	/*
	router.get('/google', passport.authenticate('google', {scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]}));*/
	
	router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

	router.get('/google/redirect', passport.authenticate('google'), function(req, res) {
		res.redirect('/profile/');
	});
	
    router.post('/signup', function (req, res) {
        var body = req.body,
            username = body.username,
			email = body.email,
			confrompassword = body.confrompassword,
            password = body.password;
			if(password != confrompassword)
			{
				res.status(500).send("Password didn't match");		
			}else
			{
				User.findOne({
				username: username
        }, function (err, doc) {
            if (err) {
                res.status(500).send('error occured')
            } else {
                if (doc) {
                    res.status(500).send('Username already exists')
                } else {
                    var record = new User()
                    record.username = username;
					record.email = email;
                    record.password = record.hashPassword(password);
					record.confrompassword = record.hashPassword(confrompassword);
                    record.save(function (err, user) {
                        if (err) {
                            res.status(500).send('db error')
                        } else {
                            res.redirect('/login')
                        }
                    })
                }
            }
        })
		}
    });


    router.post('/login', passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/profile',
    }), function (req, res) {
        res.send('hey')
    })
    return router;
};