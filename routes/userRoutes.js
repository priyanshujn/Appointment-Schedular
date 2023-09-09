const express = require('express');
const {
    loginController,
    registerController,
    getUserController,
    bookAppointmentController,
    userAppointmentController,
    updateUserController, 
    deleteAppointmentController} = require('../controllers/userController');

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
router.put('/update-user', updateUserController);

// BOOK APPOINTMENT || POST
router.post('/book-appointment', bookAppointmentController);

// APPOINTMENTS LIST || GET
router.get('/user-appointments', userAppointmentController);

// REMOVE APPOINTMENT || GET
router.delete('/delete-appointment', deleteAppointmentController);

module.exports = router;