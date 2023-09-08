const bcrypt = require('bcryptjs');
const userModel = require('../models/userModels');
const appointmentModel = require('../models/appointmentModel');
const moment = require('moment');

const registerController = async (req, res) => {
    try {
        // const { username, password } = req.body;
        console.log('in register ctrl');
        const exitingUser = await userModel.findOne({ username: req.body.username });

        if (exitingUser) {
            return res.status(200).send({ message: 'User already exist', success: false });
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;

        const offStartTime = req.body.offStartTime;
        const offEndTime = req.body.offEndTime;

        if (offStartTime && offEndTime) {
            req.body.offStartTime = moment(offStartTime, 'HH:mm').toISOString();
            req.body.offEndTime = moment(offEndTime, 'HH:mm').toISOString();
        }
        else if (req.body.offStartTime || req.body.offEndTime) {
            return res.status(500).send({
                success: false,
                message: `Incorrect user data`, // message: 'Both offStartTime and offEndTime must be present
            });
        }

        const newUser = new userModel(req.body);
        await newUser.save();

        const { passwd, ...userInfo } = newUser;
        res.status(201).send({
            message: 'User registered successfully',
            success: true,
            data: {
                username: newUser.username,
                offStartTime: newUser.offStartTime,
                offEndTime: newUser.offEndTime,
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: `Error in register controller ${error.message}` });
    }
};

const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({ username: req.body.username });
        if (!user) {
            return res.status(404).send({ success: false, message: `User not found` });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).send({ success: false, message: 'Invalid username/password' });
        }
        res.status(200).send({
            success: true,
            message: `Login successful`,
            data: {
                username: user.username,
                offStartTime: user.offStartTime,
                offEndTime: user.offEndTime,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: `Error in login controller ${error.message}` });
    }
};

const getUserController = async (req, res) => {
    try {
        const user = await userModel.findOne({ username: req.query.username });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: `User not found`
            });
        } else {
            res.status(200).send({
                success: true,
                // data: user => it's showing the user's password in final result
                data: {
                    username: user.username,
                    offStartTime: user.offStartTime,
                    offEndTime: user.offEndTime,
                }
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Error while fetching user data',
            success: false,
            error
        });
    }
}

const updateUserController = async (req, res) => {
    try {
        // console.log(req.query.userId);
        const user = await userModel.findOne({ username: req.query.username });

        // const user = await userModel.findOne({ username: req.body.username });
        console.log('userData: ', user);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: `User not found`
            });
        } else {
            // trade-off: while configuring offTIme, previously scheduled appointments will scheduled as it is.
            // one way to handle this, either through an error if offTime conflicts with user's any appointment
            let { username, password, offStartTime, offEndTime } = req.body;
            const userDetails = {};
            if (username)
                userDetails.username = username;
            if (password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                userDetails.password = hashedPassword;
            }
            if (offStartTime && offEndTime) {
                userDetails.offStartTime = moment(offStartTime, 'HH:mm').toISOString();
                userDetails.offEndTime = moment(offEndTime, 'HH:mm').toISOString();
            } else if (offStartTime || offEndTime) {
                return res.status(500).send({
                    success: false,
                    message: `Incorrect user data`, // message: 'Both offStartTime and offEndTime must be present
                });
            }
            const updatedUser = await userModel.findOneAndUpdate({ username: user.username }, userDetails, { new: true });
            console.log('updateUserData: ', updatedUser);
            res.status(200).send({
                success: true,
                message: 'User data updated successfully',
                data: {
                    username: updatedUser.username,
                    offStartTime: updatedUser.offStartTime,
                    offEndTime: updatedUser.offEndTime,
                }
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Auth Error',
            success: false,
            error
        });
    }
}

const bookAppointmentController = async (req, res) => {
    try {
        req.body.date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
        req.body.startTime = moment(req.body.startTime, 'HH:mm').toISOString();
        req.body.endTime = moment(req.body.endTime, 'HH:mm').toISOString();

        const { date, startTime, endTime, guestname } = req.body;
        const appointments = await appointmentModel.find({
            $and: [
                { guestname: guestname },
                { date: date },
                {
                    $or: [
                        {
                            startTime: {
                                $gte: startTime, $lte: endTime
                            },
                        },
                        {
                            endTime: {
                                $gte: startTime, $lte: endTime
                            }
                        }]
                }
            ]
        });

        const offTime = await userModel.find({
            $and: [
                { username: req.body.guestname },
                {
                    $or: [
                        {
                            offStartTime: {
                                $gte: startTime, $lte: endTime
                            },
                        },
                        {
                            offEndTime: {
                                $gte: startTime, $lte: endTime
                            }
                        },
                        {
                            offStartTime: {
                                $lte: startTime
                            },
                        },
                        {
                            offEndTime: {
                                $gte: endTime
                            },
                        }]
                }
            ]
        });

        if (appointments.length > 0 || offTime.length > 0) {
            offTime.length ? console.log(offTime[0]) : console.log(appointments[0]);
            return res.status(200).send({
                message: `Guest is not available during this time slot`,
                success: true
            });
        }
        const newAppointment = new appointmentModel(req.body);
        await newAppointment.save();

        // const user = await userModel.findOne({ username: req.body.username });
        // await user.save();
        res.status(201).send({
            message: 'Appointment scheduled successfully',
            success: true,
            data: newAppointment
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Error while booking an appointment',
            success: false,
            error
        });
    }
}

const userAppointmentController = async (req, res) => {
    try {
        // Appointments which are scheduled by user
        const userAppointments = await appointmentModel.find({ username: req.query.username });

        // Appointmets where user is a guest
        const guestAppointments = await appointmentModel.find({ guestname: req.query.username });
        return res.status(200).send({
            success: true,
            message: 'User appointments fetched successfully',
            data: [...userAppointments, ...guestAppointments],
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Error while fetching user\'s appointments',
            success: false,
            error
        });
    }
}

module.exports = {
    loginController,
    registerController,
    getUserController,
    updateUserController,
    bookAppointmentController,
    userAppointmentController,
};