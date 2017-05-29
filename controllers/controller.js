var express = require('express');
var db = require('../models');

var router = express.Router();

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
        },
        include: [db.User]
    }).then(function(data) {
        res.json(data);
    });
});

// router.post('/view-event/register', function(req, res) {
//     db.Signup.create({

//     }, {
//     	where: {
//     		id: req.params.id
//     	}
//     });
// });

// router.delete('/view-event/unregister/:id', function(req, res) {
//     db.Signup.destroy({

//     }, {
//     	where: {
//     		id: req.params.id
//     	}
//     });
// });

router.get('/edit-event/:id', function(req, res) {
    db.Event.findOne({
        where: {
            id: req.params.id
        },
        include: [db.User]
    }).then(function(data) {
        res.json(data);
    });
});

// router.put('/edit-event/:id', function(req, res) {
//     db.Event.update({

//     }, {
//     	where: {
//     		id: req.params.id
//     	}
//     });
// });

router.get("/new-user", function(req, res) {
    res.render("new-user");
});

router.post('/new-user', function(req, res) {
    console.log(req.body);
    db.User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password,
        email: req.body.email,
        bio: req.body.bio,
        age: req.body.age,
        sex: req.body.sex,
        picture: req.body.picture
    }).then(function(data) {
        res.json(data);
    });
});

router.get("/new-business", function(req, res) {
    res.render("new-business");
});

router.post('/new-business', function(req, res) {
    db.Business.create({
        name: req.body.name,
        password: req.body.password,
        phonenumber: req.body.phonenumber,
        email: req.body.email,
        picture: req.body.picture
    }).then(function(data) {
        //    console.log("data values", data.dataValues);
        // res.render("my-business", data.dataValues)
        res.render("new-event");
    });
});

// BUILD LOGIC
// router.post('/quiz', function(req, res) {
//     db.
// });

router.post('/new-event', function(req, res) {
    console.log("req", req)
    console.log("res", res)
    db.Event.create({
        title: req.body.title,
        location: req.body.location,
        date: req.body.location,
        time: req.body.time,
        picture: req.body.picture,
        attendance_cap: req.body.attendance_cap
    }).then(function(data) {
        console.log("data", data)
        res.json(data);
    });
});

// TEST
router.get('/user-account/:id', function(req, res) {
    db.Signup.findAll({
        where: {
            id: req.params.id
        },
        include: [db.User, db.Event]
    }).then(function(data) {
        res.json(data);
    });
});

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// router.put('/user-account', function(req, res) {
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
// router.put('/business-account', function(req, res) {
//     db.
// });

module.exports = router;
