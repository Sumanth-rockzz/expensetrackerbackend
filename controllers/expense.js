
const { where } = require('sequelize');

const Expense=require('../models/expense');
const sequelize = require('../util/database');

function isStringInvalid(string){
    if(string.length===0 || string==undefined){
        return true;
    }else{
        return false;
    }
}

exports.addExpense=async(req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        const {amount,date,reason,category}=req.body;
        if(isStringInvalid(amount)||isStringInvalid(date)||
        isStringInvalid(reason)||isStringInvalid(category))
        {
            return res.status(500).json({message:'Bad Parmeters:Something is Missing',success:false})
        }
       /* const response= await Expense.create({amount,date,reason,category,userId:req.user.id});  */
      //console.log(req.user.totalexpenses);
       
       const response= await req.user.createExpense({amount,date,reason,category},{transaction:t});

       //console.log(response);

       const totalExpense=Number(req.user.totalexpenses)+Number(amount);

        await req.user.update({totalexpenses:totalExpense},{transaction:t});
        
        await t.commit();
        
        res.status(201).json({message:response,success:true});
        
    } catch(err) {
         await t.rollback();
        console.log(err);
        res.status(500).json({message:"Something went wrong",success:false})
    }

}

exports.getExpenses=async(req,res,next)=>{

    try{
    
      /*  const response=await Expense.findAll(); */
       /* const response =await Expense.findAll({where:{userId:req.user.id}}); */
       const response =await req.user.getExpenses();
        res.status(200).json({message:response,success:true});
    }
    catch(err){
        res.status(500).json({message:err,success:false});

    }
}

exports.deleteExpense=async(req,res,next)=>{
    const t= await sequelize.transaction();
    try{
        const id=req.params.id;
       if(isStringInvalid(id))
       {
        return  res.status(500).json({message:'something went wrong',success:false})
       }
       
        const user= await Expense.findOne({where:{id:id}})
        const response=await Expense.destroy({where:{id:id},transaction:t})
        
        const totalExpense=Number(req.user.totalexpenses)-Number(user.amount);

        await req.user.update({totalexpenses:totalExpense},{transaction:t});

        
    
        if(response===0){
           return  res.status(401).json({message:"Expense does not Belongs to User",success:false});
        }
        await t.commit();
        res.status(200).json({message:response,success:true});
      
    }
    catch(err){
        console.log(err)
        await t.rollback();
        res.status(500).json({message:err,success:false});

    }
}
