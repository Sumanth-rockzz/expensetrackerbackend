

const User=require('../models/users');

exports.addUsers=async(req,res,next)=>{
    try{  

    const username=req.body.username;
    const email=req.body.email;
    const number=req.body.number;
    const password=req.body.password;

    if(username.length===0||username==null||
        email.length===0||email==null||
        number.length===0||number==null||
        password.length===0||password===null)
        {
            return res.status(400).json({params:"enter all fields"})
        }


    const data= await User.create({
        username:username,
        email:email,
        number:number,
       password:password
    }) 

    
    res.status(201).json({newuserdetails:data});
    }
    catch(err){
        res.status(500).json({
            error:err
        });
    }

}