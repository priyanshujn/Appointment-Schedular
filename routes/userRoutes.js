const express = require('express');
const {
    loginController,
    registerController } = require('../controllers/userController');

//router object
const router = express.Router();

//--------routes---------

// REGISTER || POST
router.post('/register', registerController);

// LOGIN || POST
router.post('/login', loginController);

module.exports = router;