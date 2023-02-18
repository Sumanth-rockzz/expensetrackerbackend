const User=require('../models/users');

const bcrypt=require('bcrypt');

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
    const saltrounds=10;
    bcrypt.hash(password,saltrounds,async(err,hash)=>{
        try{
            await User.create({username,email,number,password:hash}) 
        res.status(201).json({message:"Successfully Created New User"});
        }
        catch(err){

            console.log(err);
        if(err.name="SequelizeUniqueConstraintError"){
           err="User Already Exists";
        } 
        else{
        err="OOPS! Something Went wrong";
        }
            res.status(500).json({
                message:err
            });
        }  
    })
    }
    catch(err){
        console.log("here it is ",err)
        res.status(500).json({
            message:err
        });
    }
}

exports.login= async (req,res,next)=>{
    try{
        const{email,password}=req.body;
        const user= await User.findAll({where:{email:email}});
        console.log(user);
        if(user.length>0)
        {
        bcrypt.compare(password,user[0].password,(err,result)=>{
            if(err){
              throw new Error("Something Went Wrong");
            }
            if(result===true){
                return res.status(200).json({success:true,message:"User Logged in  Successfully"});
            }
                else{
                return res.status(400).json({success:false,message:"Password is invalid"});
             }
        })   
        }
        else{
            return res.status(404).json({success:false,message:"User does Not Exist"});
        }
    }catch(err){
        return res.status(500).json({success:false,message:err});
    }     
    }