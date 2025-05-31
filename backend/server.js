require('dotenv').config()

const express = require('express');
console.log("express");

const path = require('path')
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

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true
}))

const port = process.env.PORT || 2221


connectDB()

app.use("/api/a1", router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
