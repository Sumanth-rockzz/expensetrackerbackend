const Expense=require('../models/expense');
const User=require('../models/users');
const sequelize=require('../util/database');

exports.showLeaderBoard=async(req,res,next)=>{
try{

    const users=await User.findAll();
    const expenses= await Expense.findAll();
    const singleuserstotalexpense={};
    const leaderboarddetails=[];
    
    expenses.forEach((expense) => {
        if(singleuserstotalexpense[expense.userId]){
            singleuserstotalexpense[expense.userId]+=parseInt(expense.amount);
        }else{
            singleuserstotalexpense[expense.userId]=parseInt(expense.amount);
        }
    });

    users.forEach((user)=>{
        leaderboarddetails.push({name:user.username,total_expense:singleuserstotalexpense[user.id]||0})
    })
    console.log(leaderboarddetails);

    leaderboarddetails.sort((a,b)=>b.total_expense-a.total_expense);

    res.status(201).json({leaderboarddetails});

}
catch(err){
    res.status(500).json({success:false,error:err})
}
  

}

