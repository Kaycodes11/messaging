require('dotenv').config()
const express = require('express');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");


const app = express();
console.log(process.env.MONGO_URL);
// database connection
// mongoose.connect('')


app.use(express.json());
app.use(express.urlencoded({extended: true}));


const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});