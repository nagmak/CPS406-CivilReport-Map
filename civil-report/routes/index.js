var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cypress System ' });
});
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About ' });
});
router.get('/map', function(req, res, next) {
  res.render('map', { title: 'Map ' });
});
router.post('/problem',function(req, res, next) {
  var db = req.db;

  // Get our form values. These rely on the "name" attributes in modal.pug
  var probDesc = req.body.probDesc;
  var probType = req.body.probType;
  var submit = req.body.submit;

  // Set our collection
  var regularUser = db.get('regularUser');
  
  // Submit to the DB
    regularUser.insert({
        "probDesc" : probDesc,
        "probType" : probType
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

/* GET Userlist page. */
// router.get('/problem', function(req, res) {
//     var db = req.db;
//     var collection = db.get('regularUser');
//     collection.find({},{},function(e,docs){
//         res.render('userlist', {
//             "userlist" : docs
//         });
//     });
// });
module.exports = router;
