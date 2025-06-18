const express = require("express");
const route = express.Router();
const Usercontroller = require("./Controllers/Usercontroller");
const Admincontroller = require("./Controllers/Admincontroller");
const upload = require("./MulterConfig");
const verifyToken = require("./Middleware/verifyToken");

// For saving user with image upload
route.post("/savecreatedblogs", upload.single("image"), Usercontroller.saveCreatedBlogs);

// Other routes
route.post("/userdetailssave",Usercontroller.saveUserData);
route.post("/userloginverification",Usercontroller.userLoginVerification);
route.post("/displayuserprofiledetails/:userid", Usercontroller.userProfileDetails);
route.get("/displaymyblogs/:id", Usercontroller.displayMyBlogs);
route.get("/displayhomeblogs", Usercontroller.displayHomeBlogs);
route.get("/blog/:id", Usercontroller.blogDetails);
route.post("/blog/update/:id", upload.single("image"),Usercontroller.blogDetailsUpdate);
// route.get("/displayuserblogsprofile/:id", Usercontroller.displayUserBlogsProfile);
route.post("/updateprofileimage/:id", upload.single("profileImage"), Usercontroller.updateProfileImage);
route.post("/updateviewcount",Usercontroller.viewCount)
route.post("/updatelikecount",Usercontroller.toggleLike)
route.get("/favorites/:id",Usercontroller.favorites)
route.post("/blog/comment",Usercontroller.comment)
route.post("/blog/reply",Usercontroller.replyToComment)
route.post("/updateusername/:id",Usercontroller.updateUserName)


route.get("/totalusers",Admincontroller.totalUsers)
route.get("/activeusers",Admincontroller.totalActive)
route.get("/fetchuserdetails",Admincontroller.fetchUserDetails)
route.get("/fetchblogdetails",Admincontroller.fetchblogdetails)
route.get("/edituserdetails/:id",Admincontroller.editUserDetails)
route.post("/updateuserdetails/:id",Admincontroller.updateUserDetails)
route.post("/deleteblog",Admincontroller.deleteBlog)
route.get("/deactivatedaccount",Admincontroller.deactivatedAccount)
route.get("/monthlyviews",Admincontroller.monthlyViews)
route.get("/userblogdetails/:id",Admincontroller.userBLogDetails)



module.exports = route;
