const Expense=require('../models/expense');
const User=require('../models/users');
const sequelize=require('../util/database');

exports.showLeaderBoard=async(req,res,next)=>{
try{

    const leaderboarddetails=await User.findAll({
        attributes:['id','username',[sequelize.fn('sum',sequelize.col('expenses.amount')),'total_expense']],
        include:[
            {
                model:Expense,
                attributes:[]
            }    
        ],
        group:['user.id'],
        order:[['total_expense','DESC']]
    });


    res.status(201).json({leaderboarddetails});

}
catch(err){
    res.status(500).json({success:false,error:err})
}
  

}

