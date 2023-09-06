const bcrypt = require('bcryptjs');
const userModel = require('../models/userModels');

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

        const newUser = new userModel(req.body);
        await newUser.save();

        const { passwd, ...userInfo } = newUser;
        res.status(201).send({
            message: 'User registered successfully', success: true, data: {
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
                username: newUser.username,
                offStartTime: newUser.offStartTime,
                offEndTime: newUser.offEndTime,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: `Error in login controller ${error.message}` });
    }
};

module.exports = {
    loginController,
    registerController,
};