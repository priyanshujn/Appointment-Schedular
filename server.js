const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

//dotenv config
require('dotenv').config();

//mongodb connection
connectDB();

//rest object
const app = express();

//middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes
app.use('/api', require('./routes/userRoutes'));

//port
const port = process.env.PORT || 8080;

//listen port
app.listen(port, () => {
    console.log(`Server runnning in ${process.env.NODE_MODE} Mode on port ${port}`);
})