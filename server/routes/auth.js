const express = require('express');
const router = express.Router();
const passport = require('passport');



//const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const authController = require('../controllers/authController');



router.post('/register', authController.registerAddUserSubmit);
router.get('/register', authController.register);
router.get('/login', authController.login);
router.post('/login', authController.loginConnexion);


module.exports = router;