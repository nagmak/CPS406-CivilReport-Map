var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Cypress System '});
  res.render('index', { title: 'Cypress System (Civil) ', user: req.user });
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
        // if (err) {
        //   return res.status(500).json({
        //     err: err
        //   });
        // }

        passport.authenticate('local')(req, res, function () {
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
            // return res.status(200).json({
            //   status: 'Registration successful!'
            // });

        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user, error : req.flash('error')});
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/logout', (req, res, next) => {
    req.logout();
    res.status(200).json({
      status: 'Bye!'
    });
    // req.session.save((err) => {
    //     if (err) {
    //         return next(err);
    //     }
    //     res.redirect('/');
    // });
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
  var db = req.db;

  // Get our form values. These rely on the "name" attributes in modal.pug
  var probDesc = req.body.probDesc;
  var probType = req.body.probType;
  var email = req.body.optionEmail;
  if (email == ""){ email = "None" };
  // var lat
  // var long

  // Set our collection
  var regularUser = db.get('regularUser');
  
  // Submit to the DB
    regularUser.insert({
        "probDesc" : probDesc,
        "probType" : probType,
        "email": email
        // "lat": lat
        // "long": long
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
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});
module.exports = router;
