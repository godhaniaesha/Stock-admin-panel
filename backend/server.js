require('dotenv').config()

const express = require('express');
// console.log("express");

const path = require('path')
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors')
const passport = require('passport');
const session = require('express-session');

const router = require('./router/api/a1');
const connectDB = require('./db/mongoDB');

app.use("/KAssets", express.static(path.join(__dirname, "KAssets")));

// Session middleware configuration
app.use(session({
    secret: 'sdh@hehf',
    resave: true,
    saveUninitialized: true,
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))


const port = process.env.PORT || 2221


connectDB()

app.use("/api/a1", router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
