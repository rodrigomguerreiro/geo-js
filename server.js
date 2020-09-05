const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env'});

//Connect DB
connectDB();

const app = express();

//Body parser

app.use(express.json());

//Enable Cors
app.use(cors());

//Static FOlder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/api/v1/talhaos', require('./routes/talhaos'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);