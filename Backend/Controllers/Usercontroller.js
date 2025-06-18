const userschema = require("../Schema/Userschema");
const blogschema = require("../Schema/Blogschema");
const jwt = require("jsonwebtoken");
const secretKey = "yoursecretkey"; 

const saveUserData = async (req, res) => {
  try {
    const details = new userschema({
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
      confirmpassword: req.body.confirmpassword,
      status: "active",
    });

    await details.save();
    res.status(200).json({ msg: "User Data Saved successfully", id: details._id });
  } catch (error) {

    res.status(500).json({ msg: "Error saving data" });
  }
};




const userLoginVerification = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await userschema.findOne({ email: email });

    if (!result) {
      return res.status(200).json({ msg: "Username not found" });
    }

    if (result.email === email && result.password === password) {
      if (result.status === "deactive") {
        return res.status(200).json({ msg: "Account is deactivated. Contact admin!" });
      }

      // ✅ Generate JWT
      const token = jwt.sign(
        { id: result._id, email: result.email },
        secretKey,
        { expiresIn: "2h" }
      );

      return res.status(200).json({
        msg: "Account Successfully found",
        data: result,
        token: token, // send token
      });
    } else {
      return res.status(200).json({ msg: "Password incorrect" });
    }
  } catch (error) {
    console.log("userLoginVerification error", error);
    return res.status(500).json({ msg: "Failed to login", error });
  }
};


const userProfileDetails = async (req, res) => {
  try {
    const result = await userschema.findById(req.params.userid);
    res.status(200).json({
      data: result
    })
  }
  catch (error) {
    console.error("error fetching details", error)
    res.status(500).json({
      msg: "an error occured while fetching data"
    })

  }
}

const saveCreatedBlogs = async (req, res) => {
  try {

    const { title, description, category, content, user } = req.body;
    let imagePath = null;

    if (req.file) {
      imagePath = req.file.path;  // this is the path on server (e.g. uploads/image-12345.png)
    }

    // Create new blog document
    const newBlog = new blogschema({
      title,
      description,
      category,
      content,
      image: imagePath,
      user,  // pass user id from frontend or from token/session
    });

    await newBlog.save();

    res.status(200).json({ msg: "Blog saved successfully", blogId: newBlog._id });
  } catch (error) {
    console.error("Error saving blog:", error);
    res.status(500).json({ msg: "Failed to save blog", error });
  }
};


const displayMyBlogs = async (req, res) => {
  try {

    const result = await blogschema.find({ user: req.params.id }).populate('user')
    res.status(200).json({
      data: result
    })
  }
  catch (error) {
    console.error("error fetching details", error)
    res.status(500).json({
      msg: "an error occured while fetching data(displaymyblogs)"
    })

  }
}


const displayHomeBlogs = async (req, res) => {
  const userId = req.query.userId; // get userId from frontend

  try {
    const blogs = await blogschema.find().populate('user');

    const result = blogs.map(blog => ({
      ...blog.toObject(),
      isLiked: blog.likesBy.includes(userId) // this is the key!
    }));

    res.status(200).json({
      data: result
    });
  } catch (error) {
    res.status(500).json({
      msg: "error occurred while displaying home blogs"
    });
  }
};



const blogDetails = async (req, res) => {
  try {
    const blog = await blogschema
      .findById(req.params.id)
      .populate("user")
      .populate("comments.user", "fullname profileImage"); // Populate commenter details

    res.json({ data: blog });
  } catch (err) {
    res.status(500).json({ error: "Blog not found" });
  }
};



const deleteBlog = async (req, res) => {
  try {
    const value = await blogschema.findByIdAndDelete({ _id: req.params.id })

    res.status(200).json({
      msg: "Deleted successfully"
    })
  }
  catch (error) {
    res.status(500).json({
      msg: "deletion failed!!!"
    })
  }
}


const viewCount = async (req, res) => {
  const { blogId, userId } = req.body;


  try {
    const blog = await blogschema.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (!blog.viewedBy.includes(userId)) {
      blog.views += 1;
      blog.viewedBy.push(userId);
      await blog.save();
    }

    res.status(200).json({ message: "View counted", views: blog.views });
  } catch (err) {
    console.error("Error updating views:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const toggleLike = async (req, res) => {
  const { blogId, userId } = req.body;

  try {
    const blog = await blogschema.findById(blogId);

    if (!blog) return res.status(404).send("Blog not found");

    const alreadyLiked = blog.likesBy.includes(userId); // ✅ CORRECT

    if (alreadyLiked) {
      // Unlike
      blog.likesBy.pull(userId);
      blog.likes = blog.likes - 1;
    } else {
      // Like
      blog.likesBy.push(userId);
      blog.likes = blog.likes + 1;
    }

    await blog.save();

    res.status(200).json({ message: "Toggled like", likes: blog.likes });
  } catch (error) {
    console.error("Toggle like failed:", error);
    res.status(500).json({ error: "Toggle like failed" });
  }
};


const comment = async (req, res) => {
  const { blogId, userId, commentText } = req.body;

  const blog = await blogschema.findById(blogId);
  if (!blog) return res.status(404).json({ error: "Blog not found" });

  const newComment = {
    user: userId,   // ✅ Store only the ID
    text: commentText,
  };

  blog.comments.push(newComment);
  await blog.save();

  // ✅ Now populate the latest comment with user name
  const populatedBlog = await blogschema.findById(blogId)
    .populate("comments.user", "fullname");

  const lastComment = populatedBlog.comments[populatedBlog.comments.length - 1];

  res.json({ message: "Comment added", comment: lastComment });
};


const replyToComment = async (req, res) => {
  const { blogId, commentIndex, userId, replyText } = req.body;

  try {
    const blog = await blogschema.findById(blogId);
    if (!blog || !blog.comments[commentIndex]) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    const reply = {
      user: userId,
      text: replyText,
    };

    blog.comments[commentIndex].replies.push(reply);
    await blog.save();

    const updatedBlog = await blogschema.findById(blogId).populate("comments.user replies.user", "fullname profileImage");
    res.status(200).json({ msg: "Reply added", comment: updatedBlog.comments[commentIndex] });
  } catch (error) {
    console.error("Reply error:", error);
    res.status(500).json({ msg: "Failed to add reply" });
  }
};


// const displayUserBlogsProfile =async(req,res)=>{
//   try{
//     const result = await blogschema.find({user:req.params.id}).populate('user')
//     console.log(result)
//     res.status(200).json({
//       data:result
//     })
//   }catch(error){
//     res.status(500).json({
//       msg:"error occured while displaying blogs on profilepage backend"
//     })
//   }
// }


const updateProfileImage = async (req, res) => {
  try {
    const userId = req.params.id;
    const imagePath = req.file.path;

    const updatedUser = await userschema.findByIdAndUpdate(
      userId,
      { profileImage: imagePath },
      { new: true }
    );

    res.status(200).json({ msg: "Profile image updated", data: updatedUser });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ msg: "Failed to update profile image" });
  }
};


const blogDetailsUpdate = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, content } = req.body;
  let updateFields = { title, description, category, content };

  try {
    if (req.file) {
      updateFields.image = `uploads/${req.file.filename}`;
    }

    const result = await blogschema.findByIdAndUpdate(id, updateFields, { new: true });

    res.status(200).json({ msg: "Details successfully updated", data: result });
  } catch (error) {
    console.log("Update details error", error);
    res.status(500).json({ msg: "Failed to update details", error });
  }
};


const favorites = async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await blogschema.find({ likesBy: userId }).populate("user")
    console.log(result)
    res.status(200).json({
      data: result,

    })
  } catch (error) {
    res.status(500).json({
      msg: "favorites backend issue"
    })
  }
}


const updateUserName = async (req, res) => {
  const userId = req.params.id;
  try {
    const { fullname } = req.body;
    await User.findByIdAndUpdate(req.params.id, { fullname });
    res.json({ success: true, message: "Name updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating name" });
  }
}

module.exports = {updateUserName,replyToComment, comment,favorites, blogDetailsUpdate, toggleLike, viewCount, updateProfileImage, deleteBlog, blogDetails, displayHomeBlogs, displayMyBlogs, saveUserData, userLoginVerification, userProfileDetails, saveCreatedBlogs };