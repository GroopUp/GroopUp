var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var db = require("./models");
var bCrypt = require("bcrypt-nodejs");

module.exports = function(passport, user) {

    //Serialize Sessions
    //This will create cookies and stored them in the session
    passport.serializeUser(function(user, done) {
        console.log("serial",user)
        //saving user's unique colume to verify the type of table when desealize
        var key = {
            id: user.id,
            type: user.age
        }
        done(null, key);
    });

    //Deserialized Sessions
    //This sill read cookies. will look up & return users object
    //req.user will return user data
    passport.deserializeUser(function(key, done) {
        //check the type of table
        if (key.type) {

            db.User.findOne({ where: { id: key.id } }).then(function(user) {
                done(null, user);
            }).error(function(err) {
                done(err, null);
            });
        } else {
            db.Business.findOne({ where: { id: key.id } }).then(function(user) {
                done(null, user);
            }).error(function(err) {
                done(err, null);
            });
        }
    });

    passport.use("local-signup", new LocalStrategy({
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true
        },
        //storing user's details
        function(req, email, password, done) {
            var generateHash = function(password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };
            db.User.findOne({ where: { email: email } }).then(function(user) {

                if (user) {
                    req.flash("error", "That email is already taken.");
                    return done(null, false, { message: 'That email is already taken' });
                } else {
                    var userPassword = generateHash(password);
                    var data = {
                        email: email,
                        password: userPassword,
                        name: req.body.name,
                        age: req.body.age,
                        sex: req.body.sex,
                        picture: req.body.picture
                    };

                    db.User.create(data).then(function(newUser, created) {
                        if (!newUser) {
                            req.flash("error", "Sorry try again");
                            return done(null, false);
                        }
                        if (newUser) {
                            req.flash("success_msg", "Your account has been created.");
                            return done(null, newUser);
                        }
                    });
                }
            });
        }
    ));
    passport.use('local-signin', new LocalStrategy(

        {

            // by default, local strategy uses username and password, we will override with email
            usernameField: 'user-email',
            passwordField: 'user-password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },

        function(req, email, password, done) {

            var User = user;

            var isValidPassword = function(userpass, password) {
                return bCrypt.compareSync(password, userpass);
            }

            db.User.findOne({ where: { email: email } }).then(function(user) {

                if (!user) {
                    req.flash("error_msg", "Email does not exist.");
                    return done(null, false, { message: 'Email does not exist' });
                }

                if (!isValidPassword(user.password, password)) {
                    req.flash("error_msg", "Incorrect password.");
                    return done(null, false, { message: 'Incorrect password.' });

                }

                req.flash("success_msg", "You are now logged in")
                var userinfo = user.get();

                return done(null, userinfo);

            }).catch(function(err) {

                console.log("Error:", err);
                req.flash("error", "Something went wrong with your Signin.");
                return done(null, false, { message: 'Something went wrong with your Signin' });


            });

        }
    ));

    passport.use("local-bizsignup", new LocalStrategy({
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true
        },
        //storing business's details
        function(req, email, password, done) {
            var generateHash = function(password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };
            db.Business.findOne({ where: { email: email } }).then(function(business) {

                if (business) {
                    console.log(db.Business)
                    req.flash("error", "That email is already taken.");
                    return done(null, false, { message: 'That email is already taken' });
                } else {
                    var businessPassword = generateHash(password);
                    var data = {
                        email: email,
                        password: businessPassword,
                        name: req.body.name,
                        phonenumber: req.body.phonenumber,
                        email: req.body.email,
                        picture: req.body.picture
                    };

                    db.Business.create(data).then(function(newBusiness, created) {
                        if (!newBusiness) {
                            req.flash("error", "Something went wrong, try again.")
                            return done(null, false);
                        }
                        if (newBusiness) {
                            req.flash("success_msg", "Your account has been created.")
                            return done(null, newBusiness);
                        }
                    });
                }
            });
        }
    ));
    passport.use('local-bizsignin', new LocalStrategy(

        {

            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },

        function(req, email, password, done) {


            var isValidPassword = function(userpass, password) {
                return bCrypt.compareSync(password, userpass);
            }

            db.Business.findOne({ where: { email: email } }).then(function(business) {

                if (!business) {
                    req.flash("error_msg", "Email does not exist.");
                    return done(null, false, { message: 'Email does not exist' });
                }

                if (!isValidPassword(business.password, password)) {
                    req.flash("error", "Incorrect Password.");
                    return done(null, false, { message: 'Incorrect password.' });

                }
                req.flash("success_msg", "You are now log in with your business account.")
                var businessinfo = business.get();

                return done(null, businessinfo);

            }).catch(function(err) {

                console.log("Error:", err);
                req.flash("error", "Something went wrong with your Signin");
                return done(null, false, { message: 'Something went wrong with your Signin' });
            });

        }
    ));
}









// // For Authentication Purpose
// passport.use(new LocalStrategy(
//     function(username, password, done) {
//         db.User.find({ where: { username: username } }).success(function(user) {
//             passwd = user ? user.password : ""
//             isMatch = db.User.validPassword(password, passwd, done, user)
//         });
//     }));
