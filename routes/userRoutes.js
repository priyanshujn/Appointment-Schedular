const express = require('express');
const {
    loginController,
    registerController,
    getUserController,
    bookAppointmentController,
    userAppointmentController, 
    updateUserController} = require('../controllers/userController');

//router object
const router = express.Router();

//--------routes---------

// REGISTER || POST
router.post('/register', registerController);

// LOGIN || POST
router.post('/login', loginController);

// USER || GET
router.get('/get-user', getUserController);

// USER || POST
router.post('/update-user', updateUserController);

// BOOK APPOINTMENT || POST
router.post('/book-appointment', bookAppointmentController);

// APPOINTMENTS LIST || GET
router.get('/user-appointments', userAppointmentController);

module.exports = router;