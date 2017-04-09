var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user : req.user });
  res.render('index', { title: 'Cypress System ' });
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
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
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

/* GET Userlist page. */
// router.get('/userlist', function(req, res) {
//     var db = req.db;
//     var collection = db.get('regularUser');
//     collection.find({},{},function(e,docs){
//         res.render('userlist', {
//             "userlist" : docs
//         });
//     });
// });
module.exports = router;
