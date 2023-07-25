
const uuid=require('uuid');
const User=require('../models/users')
const ForgotPassword=require('../models/forgotpassword')
const transporter = require('./email/Brevo'); 
const bcrypt=require('bcrypt');

exports.forgotpassword= async(req,res,next)=>{
        try {
            const {email}  =  req.body;
            /* console.log("it entered ")
            console.log(">>>>>>>>>>",email); */
            const user = await User.findOne({where : {email: email }});
            console.log(user);
            if(user){
                const userId=user.id;
                const id = uuid.v4();
               await ForgotPassword.create({id,isactive:true,userId:user.id})
                    .catch(err => {
                        throw new Error(err)
                    })
    
                var mailOptions = {
                    to: email,
                    from: `${process.env.FROM_EMAIL}`,
                    subject: 'Reset Password✅',
                    text: 'Forgot Password Do Not Worry Click below',
                    html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`
    
                };
                //Send email
                await transporter.sendMail(mailOptions);
                return res.status(200).json({ message:"New password Reset Link Sent", success: true });

            }else {
                throw new Error("User doesn't exist")
            }
        } catch(err){
            /* console.error(err) */
            return res.status(500).json({ message: err, success: false });
        }
}

exports.resetpassword=async(req,res,next)=>{

    try{
        const uuid=req.params.id;

     const forgotpasswordrequest = await  ForgotPassword.findOne({where:{id:uuid}})
     /* console.log(forgotpasswordrequest);
        console.log(uuid); */
    if(forgotpasswordrequest){
          await forgotpasswordrequest.update({isactive:false})

            res.status(200).send(`<html>
            <script>
                function formsubmitted(e){
                    e.preventDefault();

                }
            </script>
            <form action="/password/updatepassword/${uuid}" method="get">
                <label for="newpassword">Enter New password</label>
                <input name="newpassword" type="password" required></input>
                <button>Reset password</button>
            </form>
        </html>`
        )
res.end()
    }
    else{
        throw new Error("invalid uuid")
    }
    }
    catch(err){
       /*  console.log(err); */
        res.status(500).json({message:err,success:false})
    }
}

exports.updatepassword= async (req,res,next)=>{

        try {
            const { newpassword } = req.query;
            /* console.log('>>>>>',newpassword); */
            const  resetpasswordid  = req.params.id;
           /*  console.log('>>>>>',resetpasswordid); */
           const resetpasswordrequest= await  ForgotPassword.findOne({ where : { id: resetpasswordid }})
              const user= await  User.findOne({where: { id : resetpasswordrequest.userId}})
                    if(user) {
                        const saltRounds = 10;
                            bcrypt.hash(newpassword,saltRounds,function(err, hash){
                                if(err){
                                    console.log(err);
                                  return res.status(500).json({message:err})
                                }
                               user.update({ password: hash }).then(() => {
                                    res.status(201).json({message: 'Successfuly updated the new password'})
                                }).catch((err)=>{
                                   return res.status(500).json({message:err})
                                })
                            });
                } else{
                    return res.status(404).json({ error: 'No user Exists', success: false})
                }
        } catch(error){
            return res.status(403).json({ error, success: false } )
        }
    
    }
    
    

