var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var Account = require('../models/account');
var map = require('../public/javascripts/map');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var title = 'Toronto Civic Problem Report Map ';
  if(req.isAuthenticated()){
    title = 'Toronto Civic Problem Report Map (Civil User)';
  }
  res.render('index', { title: title, user: req.user });
});
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About ' });
});
router.get('/map', function(req, res, next) {
  res.render('map', { title: 'Map ' });
});

/* Civil User Register/Login */
router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { account : account });
        }

        passport.authenticate('local')(req, res, function () {
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user, error : req.flash('error')});
});

router.post('/login', function (req, res, next) {
        passport.authenticate('local',  function (err, user, info) {
            if (err) {
                return next(err); // will generate a 500 error
            }
            if (!user) {
                return res.send({ success : false, message : info.message || 'not logged in' });
            }

            req.logIn(user, function(err) {
                if (err) { return next(err); }

                req.user = user;
            });
            res.redirect('/');

        })(req, res, next);
    });


router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

router.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });
});

/* Regular User */

router.post('/problem',function(req, res, next) {
    if (!req.isAuthenticated()){
        var db = req.db;
        // Get our form values. These rely on the "name" attributes in modal.pug
        var probDesc = req.body.probDesc;
        var probType = req.body.probType;
        var lat = req.body.latitude;
        var long = req.body.longitude;

        var email = req.body.optionEmail;
        if (email == ""){ email = "None" };

        // Select our collection
        var regularUser = db.get('regularUser');
        
        // Submit Civilian report to the DB
            regularUser.insert({
                "probDesc" : probDesc,
                "probType" : probType,
                "email": email,
                "lat": lat,
                "long": long

            }, function (err, doc) {
                if (err) {
                    // If it failed, return error
                    res.send("There was a problem adding the information to the database.");
                }
                else {
                    // And forward to success page
                    res.redirect("/");
                }
            });
    }
    else{
        // Updating Civil User's account if they add a report
        Account.findOne({ username: req.user.username }, function(err, user){
            if(err){
                res.json(err);
            }
            else if(user == null){
                res.json('no such user!');
            }
            else{
                user.username = req.user.username;
                user.password = req.user.password;
                user.probType = req.body.probType;
                user.probDesc = req.body.probDesc;
                user.email = req.body.email;
                user.lat = req.body.latitude;
                user.long = req.body.longitude;

                user.save(function(err){
                    if(err){
                        console.error('ERROR!');
                    }
                    res.redirect("/");
                });

            }
        });
    }
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});
module.exports = router;
