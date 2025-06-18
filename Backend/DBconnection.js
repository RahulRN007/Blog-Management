// const mongoose = require("mongoose");
// require("dotenv").config();

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect("mongodb://localhost:27017/Blogmanagement");
//     console.log(`MongoDB connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error("MongoDB connection error:", error.message);
//     process.exit(1); // Exit the process if unable to connect
//   }
// };

// connectDB();

// module.exports = connectDB;


var mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/Blogmanagement")
var db = mongoose.connection
db.on('error',console.error.bind(console,'connection error'))
db.once('open',function(){
    console.log("Db connection Succesfull")
})

module.exports = db
