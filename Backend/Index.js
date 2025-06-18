var express = require("express");
var cors = require("cors");
var app = express();
var connectDB = require("./DBconnection"); // renamed to connectDB for clarity
const path = require('path');

const parser = require("body-parser");
const route = require("./Routes");

// 1. Connect DB before anything else
connectDB(); 

// 2. Middlewares
app.use(cors());
app.use(express.json());
app.use(parser.json());

// 3. Static file handling
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. Routes
app.use("/", route);

// 5. Start server
app.listen(5000, function () {
  console.log("Index success");
});
