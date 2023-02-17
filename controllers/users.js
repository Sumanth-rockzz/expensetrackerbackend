const User=require('../models/users');

function isStringInvalid(string){
    if(string==undefined ||string.length===0){
        return true;
    }
    else{
        return false;
    }
}

exports.addUsers=async(req,res,next)=>{
    try{  

    const{username,email,number,password}=req.body;
   
        if(isStringInvalid(username)||isStringInvalid(email)||
        isStringInvalid(number)||isStringInvalid(password)){

            return res.status(400).json({message:"Bad parameters:Something is missing"})

        }

    const data= await User.create({username,email,number,password}) 
    res.status(201).json({message:"Successfully Created New User"});
    }
    catch(err){
       if(err.name="SequelizeUniqueConstraintError")
        {
           err="User Already Exists";
        } 
        else{
        err="OOPS! Something Went wrong";
        }

        res.status(500).json({
            message:err
        });
    }
}

exports.login   = async (req,res,next)=>{
    try{
        
        const{email,password}=req.body;
        console.log(email);
        const user= await User.findAll({where:{email:email}});
        if(user.length>0)
        {
            if(user[0].password===password){
                return res.status(200).json({success:true,message:"User Logged in  Successfully"});
            }
            else{
                return res.status(400).json({success:false,message:"Password is invalid"});
            }
        }
        else{
            return res.status(404).json({success:false,message:"User does Not Exist"});
        }
    }catch(err){
        return res.status(500).json({success:false,message:err});
    }     
    }