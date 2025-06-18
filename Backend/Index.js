var express = require("express")
var cors = require("cors")
var app = express()
var database = require("./DBconnection")
const path = require('path');

const parser = require("body-parser")
const route = require("./Routes")

app.use(cors())
app.use(express.json());  // to parse JSON body
app.use(parser.json())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/",route)


app.listen(5000,function(){
    console.log("Index success")
})
 