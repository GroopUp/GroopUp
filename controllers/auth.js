var authController = require('./authcontroller.js');
var express = require('express');
var db = require('../models');
var router = express.Router();


router.get("/new-user", authController.signup);