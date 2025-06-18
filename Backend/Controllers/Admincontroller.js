const userschema = require("../Schema/Userschema");
const blogschema = require("../Schema/Blogschema")


const totalUsers=async(req,res)=>{
    try{
        const result = await userschema.find()
        
        res.status(200).json({
            data:result
        })
    }catch(error){
        console.log("totalusers backend issue")
    }

}


const totalActive=async(req,res)=>{
    try{
        const result = await userschema.find({status:'active'})
       
        res.status(200).json({
            data:result
        })
    }catch(error){
        console.log("totalusers backend issue")
    }
}


const fetchUserDetails=async(req,res)=>{
    try{
        const result = await userschema.find()
        
        res.status(200).json({
            data:result
        })
    }catch(error){
        console.log("fetchuserdetails backend issue")
    }
}


const fetchblogdetails=async(req,res)=>{
    try{
        const result = await blogschema.find().populate('user')
       
        res.status(200).json({
            data:result
        })
    }catch(error){
        console.log("fetchblogdetails backend issue")
    }
}


const editUserDetails = async(req,res)=>{
    try {
    const user = await userschema.findById(req.params.id);
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch user", error });
  }
}


const deactivatedAccount = async (req, res) => {
  try {
    const users = await userschema
      .find({ status: "deactive" })
      .select("-password -confirmpassword")

    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch users", error });
  }
};



const updateUserDetails = async(req,res)=>{
     const { id } = req.params
  const updatedData = req.body
  try {
    const result = await userschema.findByIdAndUpdate(id, updatedData, { new: true })
    

    res.status(200).json({ msg: "details successfully updated", data: result })
  }
  catch (error) {
    
    res.status(500).json({ msg: "Failed to update details", error });
  }
}

const deleteBlog = async (req, res) => {
    const {id} = req.body
  try {
    const value = await blogschema.findByIdAndDelete(id)
    res.status(200).json({
      msg: "Blog Deleted successfully"
    })
  }
  catch (error) {
    res.status(500).json({
      msg: "deletion failed!!!"
    })
  }
}

const monthlyViews = async(req,res)=>{
 try {
    const result = await blogschema.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },  // Group all blogs by the month they were created in
          totalViews: { $sum: "$views" }  // Sum the views of all blogs in each month
        }
      },
      {
        $sort: { _id: 1 }  // Sort the results by month (January=1, February=2, etc.)
      }
    ]);
    res.json(result);  // Send the grouped data back to the frontend as JSON
  } catch (error) {
    console.error("Error fetching monthly views:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


const userBLogDetails=async(req,res)=>{
  const {id} = req.params
    try{
        const result = await blogschema.find({user:id}).populate('user')
        res.status(200).json({
            data:result
        })
    }catch(error){
        console.log("userBLogDetails backend issue")
    }
}


module.exports = {userBLogDetails,monthlyViews,deactivatedAccount,deleteBlog,updateUserDetails,editUserDetails,fetchblogdetails,totalUsers,totalActive,fetchUserDetails}