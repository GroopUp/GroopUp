var express = require('express');
var db = require('../models');
var router = express.Router();
var authController = require('./authcontroller.js');
var passport = require("passport");

//user authentication


router.get("/new-user", authController.signup);

router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/user',
    failureRedirect: '/'
}));

router.post('/bsignin', passport.authenticate('local-bizsignin', {
    successRedirect: '/business',
    failureRedirect: '/'
}));

router.post('/new-user', passport.authenticate('local-signup', {
    successRedirect: '/quiz',
    failureRedirect: '/new-user'
}));

router.post('/new-business', passport.authenticate('local-bizsignup', {
    successRedirect: '/new-event',
    failureRedirect: '/new-business'
}));

router.get("/logout", function(req, res){
     req.flash("error", "You are logged out.");
    req.session.destroy(function(err){
        res.redirect("/");
    });

})


//////////////////////////////////////////////////////////////////////////////////////////////////////
//Protected Routes

router.get("/new-event", function(req, res) {
    console.log(req.user);

    if (req.isAuthenticated()) {
        if (req.user.age) {
            res.redirect("/user");
        } else {
            res.render("new-event");
        }
    } else {
        res.redirect("/");
    }
})


router.post('/new-event', function(req, res) {
    if (req.isAuthenticated()) {
        db.Event.create({
            title: req.body.title,
            location: req.body.location,
            date: req.body.date,
            time: req.body.time,
            picture: req.body.picture,
            attendance_cap: parseInt(req.body.attendance_cap),
            BusinessId: req.user.id
        }).then(function(data) {
            res.redirect("/business");
        });
    } else {
        res.redirect("/");
    }
});

router.get('/business', function(req, res) {
    //protecting business route
    if (req.isAuthenticated()) {
        if(req.user.phonenumber){
        db.Event.findAll({
            order: [
                ['createdAt', 'DESC']
            ]
        }).then(function(data) {
            var hbsObject = {
                event: data
            }
            res.render('index-business', hbsObject);
        });
    } else {
        res.redirect("/user")
    }
    } else {
        res.redirect("/")
    }
});

router.get('/user', function(req, res) {
    if (req.isAuthenticated()) {
        //this will make sure business account can't get into the /user route
        if (req.user.age) {
            db.Event.findAll({
                order: [
                    ['createdAt', 'DESC']
                ]
            }).then(function(data) {
                var hbsObject = {
                    event: data
                }
                res.render('index-user', hbsObject);
            });
        } else {
            res.redirect("/business")
        }
    } else {
        res.redirect("/")
    }
});

router.get("/my-account", function(req, res){
    if (req.isAuthenticated()){
        if (req.user.age){
            db.User.findOne({
                where: {
                    id: req.user.id
                }
            }).then(function(data){
                var hbsObject = {
                event: data
            }
            res.render("my-acount", hbsObject);
            })
        }
    }
})

///////////////////////////////////////////////////////////////////////////////////////////////////////


router.get('/', function(req, res) {
    db.Event.findAll({
        order: [
            ['createdAt', 'DESC']
        ]
    }).then(function(data) {
        var hbsObject = {
            event: data
        }
        res.render('index', hbsObject);
    });
});

router.get('/view-event/:id', function(req, res) {

    db.Event.findOne({
        where: {
            id: req.params.id
        }
    }).then(function(data) {
        console.log(data);
        var hbsObject = {
            event: data
        }
        res.render("view-event", hbsObject);
    });
});

router.get("/new-business", function(req, res) {
    res.render("new-business");
})

router.get("/quiz", function(req, res) {
    res.render("quiz")
})


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// router.get('/user-login', function(req, res) {
//     db.
// });

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// router.get('/business-login', function(req, res) {
//     db.
// });

// // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// router.post('/quiz', function(req, res) {
//     db.
// });


// TEST
router.get('/user-account/:id', function(req, res) {
    db.Signup.findAll({
        where: {
            id: req.body.id
        },
        include: [db.User, db.Event]
    }).then(function(data) {
        res.json(data);
    });
});

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// router.update('/user-account', function(req, res) {
//     db.
// });

router.get('/business-account/:id', function(req, res) {
    db.Business.findOne({
        where: {
            id: req.body.id
        },
        include: [db.Event]
    }).then(function(data) {
        res.json(data);
    });
});

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// router.update('/business-account', function(req, res) {
//     db.
// });

module.exports = router;
