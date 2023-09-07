const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    guestname: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
}, { timestamps: true });

const appointmentModel = mongoose.model('appointments', appointmentSchema);

module.exports = appointmentModel;