var express = require('express');
var db = require('../models');

var router = express.Router();

router.get('/', function(req, res) {
    db.Event.findAll({
    	order: [['createdAt', 'DESC']]
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

router.post('/new-user', function(req, res) {
    db.User.create({
    	name: req.body.name,
    	password: req.body.password,
    	email: req.body.email,
    	age: req.body.age,
    	sex: req.body.sex,
    	picture: req.body.picture
    }).then(function(data) {
    	res.json(data);
    });
});

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
router.get('/user-login', function(req, res) {
    db.
});

router.post('/new-business', function(req, res) {
    db.Business.create({
    	name: req.body.name,
    	password: req.body.password,
    	phone: req.body.phone,
    	email: req.body.email,
    	picture: req.body.picture
    }).then(function(data) {
    	res.json(data);
    });
});

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
router.get('/business-login', function(req, res) {
    db.
});

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
router.post('/quiz', function(req, res) {
    db.
});

router.post('/new-event', function(req, res) {
    db.Event.create({
        title: req.body.title,
        location: req.body.location,
        date: req.body.location,
        time: req.body.time,
        picture: req.body.picture,
        attendance_cap: req.body.attendance_cap
    }).then(function(data) {
    	res.json(data);
    });
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
router.update('/user-account', function(req, res) {
    db.
});

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
router.update('/business-account', function(req, res) {
    db.
});

module.exports = router;
