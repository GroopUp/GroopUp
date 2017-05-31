var express = require('express');
var db = require('../models');
var router = express.Router();
var authController = require('./authcontroller.js');
var passport = require("passport");
var bCrypt = require("bcrypt-nodejs");
var moment = require('moment');


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

router.get("/logout", function(req, res) {
    req.flash("error", "You are logged out.");
    req.session.destroy(function(err) {
        res.redirect("/");
    });

})


//////////////////////////////////////////////////////////////////////////////////////////////////////
//Protected Routes
router.get('/my-business', function(req, res) {
    if (req.isAuthenticated()) {
        console.log("data", req.user)
        if (req.user.phonenumber) {
            db.Business.findOne({
                where: {
                    id: req.user.id
                },
                include: [db.Event]
            }).then(function(data) {
                console.log("this is the data--------------", data.dataValues.Events);
                res.render("my-business", data.dataValues);
            })
        }
    }
});

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
            date: moment(req.body.date).format('MM-DD-YYYY'),
            time: req.body.time,
            picture: req.body.picture,
            attendance_cap: parseInt(req.body.attendance_cap),
            totalUsers: 0,
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
        if (req.user.phonenumber) {
            db.Event.findAll({
                order: [
                    ['date'],
                    ['time']
                ]
            }).then(function(data) {
                var gooddate = [];

                for (var i = 0; i < data.length; i++) {
                    if (moment().isBefore(data[i].date)) {
                        gooddate.push(data[i]);
                        console.log(gooddate);
                    }
                }
                var hbsObject = {
                    event: gooddate
                }
                console.log(data);
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
                    ['date'],
                    ['time']
                ]
            }).then(function(data) {
                var gooddate = [];

                for (var i = 0; i < data.length; i++) {
                    if (moment().isBefore(data[i].date)) {
                        gooddate.push(data[i]);
                        console.log(gooddate);
                    }
                }
                var hbsObject = {
                    event: gooddate
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

router.get("/my-account", function(req, res) {
    if (req.isAuthenticated()) {
        console.log("checking", req.user.id)
        if (req.user.age) {
            db.User.findOne({
                where: {
                    id: req.user.id
                },
                include: [{
                    model: db.Signup,

                    include: [{
                        model: db.Event
                    }, ]
                }]
            }).then(function(data) {
                // console.log("================", data.dataValues.Signups[0].Event);
                res.render("my-account", data.dataValues);
            })
        }
    }
})

router.put("/my-account", function(req, res) {

    var generateHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
    };
    var userId = req.user.id;
    db.User.findOne({ where: { id: userId } }).then(function(user) {

        if (user.email === req.body.email) {
            //this will check if the user has put the new password in.
            if (user.password === req.body.password) {
                var userPassword = req.body.password;

            } else {
                //if user has put the new password, it has to be hashed again.
                var userPassword = generateHash(req.body.password);
            }
            var data = {
                email: req.body.email,
                password: userPassword,
                name: req.body.name,
                age: req.body.age,
                picture: req.body.picture
            };
            console.log("testing", data);
            db.User.update(data, { where: { id: userId } }).then(function(result) {
                res.redirect("/my-account");
            })
        } else {
            db.User.findOne({ where: { email: req.body.email } }).then(function(user) {

                if (user) {
                    req.flash("error", "That email is already taken.");
                    res.redirect("/my-account");
                    // return done(null, false, { message: 'That email is already taken' });
                } else {
                    if (user.password === req.body.password) {
                        var userPassword = req.body.password;
                    } else {
                        var userPassword = generateHash(req.body.password);
                    }
                    var data = {
                        email: req.body.email,
                        password: userPassword,
                        name: req.body.name,
                        age: req.body.age,
                        picture: req.body.picture
                    };
                    db.User.update(data, { where: { id: userId } }).then(function(result) {
                            res.redirect("/my-account");
                        })
                        // db.User.create(data).then(function(newUser, created) {
                        //     if (!newUser) {
                        //         req.flash("error", "Sorry try again");
                        //         return done(null, false);
                        //     }
                        //     if (newUser) {
                        //         req.flash("success_msg", "Your account has been created.");
                        //         return done(null, newUser);
                        //     }
                        // });
                }
            });
        }
    })
})

// router.get('/my-business', function(req, res) {
//     if (req.isAuthenticated()) {
//         console.log("data", req.user)
//         if (req.user.phonenumber) {
//             db.Business.findOne({
//                 where: {
//                     id: req.user.id
//                 }
//             }).then(function(data) {
//                 res.render("my-business", data.dataValues);
//             })
//         }
//     }
// });

router.put("/my-business", function(req, res) {

    var generateHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
    };
    var businessId = req.user.id;
    db.Business.findOne({ where: { id: businessId } }).then(function(business) {

        if (business.email === req.body.email) {
            //this will check if the business has put the new password in.
            if (business.password === req.body.password) {
                var businessPassword = req.body.password;

            } else {
                //if business has put the new password, it has to be hashed again.
                var businessPassword = generateHash(req.body.password);
            }
            var data = {
                email: req.body.email,
                password: businessPassword,
                name: req.body.name,
                phonenumber: req.body.phonenumber,
                picture: req.body.picture
            };
            console.log("testing", data);
            db.Business.update(data, { where: { id: businessId } }).then(function(result) {
                res.redirect("/my-business");
            })
        } else {
            db.Business.findOne({ where: { email: req.body.email } }).then(function(business) {

                if (business) {
                    req.flash("error", "That email is already taken.");
                    res.redirect("/my-business");
                    // return done(null, false, { message: 'That email is already taken' });
                } else {
                    if (business.password === req.body.password) {
                        var businessPassword = req.body.password;
                    } else {
                        var businessPassword = generateHash(req.body.password);
                    }
                    var data = {
                        email: req.body.email,
                        password: businessPassword,
                        name: req.body.name,
                        phonenumber: req.body.phonenumber,
                        picture: req.body.picture
                    };
                    db.Business.update(data, { where: { id: businessId } }).then(function(result) {
                            res.redirect("/my-business");
                        })
                        // db.business.create(data).then(function(newUser, created) {
                        //     if (!newUser) {
                        //         req.flash("error", "Sorry try again");
                        //         return done(null, false);
                        //     }
                        //     if (newUser) {
                        //         req.flash("success_msg", "Your account has been created.");
                        //         return done(null, newUser);
                        //     }
                        // });
                }
            });
        }
    })
})


///////////////////////////////////////////////////////////////////////////////////////////////////////


// stock index
router.get('/', function(req, res) {
    if (!req.isAuthenticated()) {
        db.Event.findAll({
            order: [
                ['date'],
                ['time']
            ]
        }).then(function(data) {
            var gooddate = [];

            for (var i = 0; i < data.length; i++) {
                if (moment().isBefore(data[i].date)) {
                    gooddate.push(data[i]);
                    console.log(gooddate);
                }
            }
            var hbsObject = {
                event: gooddate
            }
            res.render('index', hbsObject);
        });
    } else {
        res.redirect("/user")
    }
});

// index for user
router.get('/index-user', function(req, res) {
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
});

// index for business
router.get('/index-business', function(req, res) {
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
});

// stock view event
router.get('/view-event/:id', function(req, res) {

    db.Event.findOne({
        where: {
            id: req.params.id
        }
    }).then(function(data) {
        console.log(data);
        // var hbsObject = {
        //     event: data
        // }
        res.render("view-event", data.dataValues);
    });
});

router.get("/new-business", function(req, res) {
    res.render("new-business");
})

router.get("/quiz", function(req, res) {
    res.render("quiz")
})

router.get("/user-view-event/:id", function(req, res) {
    console.log(req.user)
    db.Event.findOne({
        where: {
            id: req.params.id
        }
    }).then(function(data) {

        res.render("user-view-event", data.dataValues);
    });
})

router.post("/event-sign-up/:id", function(req, res) {

        db.Event.findOne({
            where: {
                id: req.params.id
            }
        }).then(function(data1) {
            if (data1.equizresults === null) {
                db.User.findOne({
                    where: {
                        id: req.user.id
                    }
                }).then(function(data2) {
                    db.Event.update({
                        equizresults: data2.uquizresults
                    }, {
                        where: {
                            id: req.params.id
                        }
                    });
                });
            } else {
                db.User.findOne({
                    where: {
                        id: req.user.id
                    }
                }).then(function(data3) {
                    averageArray = [];
                    for (var i = 0, n = JSON.parse(data3.uquizresults).length; i < n; i++) {
                        averageElement = (parseFloat(JSON.parse(data3.uquizresults)[i]) + parseFloat(JSON.parse(data1.equizresults)[i])) / 2.0;
                        averageArray.push(JSON.stringify(averageElement));
                    }
                    db.Event.update({
                        equizresults: JSON.stringify(averageArray)
                    }, {
                        where: {
                            id: req.params.id
                        }
                    }).then(function(data4) {
                        console.log('CHECK WORKBENCH FOR CHANGES');
                    });
                });
            }
        });



        db.Signup.findAll({
            where: {
                UserId: req.user.id,
                EventId: req.params.id
            }
        }).then(function(result) {
            console.log("result", result.dataValues)
            if (result.dataValues) {
                db.Signup.create({
                    EventId: req.params.id,
                    UserId: req.user.id
                }).then(function(data1) {
                    db.Event.findOne({
                        where: {
                            id: req.params.id
                        }
                    }).then(function(data2) {
                        var current = data2.totalUsers
                        current = current + 1
                        db.Event.update({
                            totalUsers: current
                        }, {
                            where: {
                                id: req.params.id
                            }
                        }).then(function(data3) {
                            res.redirect("/user");
                        })
                    })
                })
            } else {
                db.Event.findAll({
                    order: [
                        ['createdAt', 'DESC']
                    ]
                }).then(function(data4) {
                    var hbsObject = {
                        event: data4,
                        error: "You are already signed up for this event"
                    }
                    res.render('index-user', hbsObject);
                });
            }
        })


    })
    // // view event for users, to unregister
    // router.delete('/view-event/unregister/:id', function(req, res) {
    //     db.Signup.destroy({

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// router.get('/user-login', function(req, res) {
//     db.
// });

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// router.get('/business-login', function(req, res) {
//     db.
// });

router.post('/quizdone', function(req, res) {
    console.log("RECEIVED ON BACK-END");
    console.log(req.body.result);
    // res.redirect('/')
    setTimeout(function() { console.log("what") }, 2000);

    db.User.update({
        uquizresults: req.body.result
    }, {
        where: {
            id: req.user.id
        }
    }).then(function(data) {
        res.redirect('/user');
    })
});


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


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// router.update('/business-account', function(req, res) {
//     db.
// });

module.exports = router;
