require('dotenv').config()

const express = require('express');
console.log("express");

const path = require('path')
const app = express();
const cors = require('cors')

const router = require('./router/api/a1');
const connectDB = require('./db/mongoDB');



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
