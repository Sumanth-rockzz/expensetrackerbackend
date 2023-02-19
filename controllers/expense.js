
const { where } = require('sequelize');

const Expense=require('../models/expense');

function isStringInvalid(string){
    if(string.length===0 || string==undefined){
        return true;
    }else{
        return false;
    }
}

exports.addExpense=async(req,res,next)=>{
    try{
        const {amount,date,reason,category}=req.body;
        if(isStringInvalid(amount)||isStringInvalid(date)||
        isStringInvalid(reason)||isStringInvalid(category))
        {
            return res.status(500).json({message:'Bad Parmeters:Something is Missing',success:false})
        }
       /* const response= await Expense.create({amount,date,reason,category,userId:req.user.id});  */
       const response= await req.user.createExpense({amount,date,reason,category});
        
        res.status(201).json({message:response,success:true});
        
    }catch(err){
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
        res.status(500).json({message:err,success:true});

    }
}

exports.deleteExpense=async(req,res,next)=>{

    try{
        const id=req.params.id;
       if(isStringInvalid(id))
       {
        return  res.status(500).json({message:'something went wrong',success:false})
       }
        const response=await Expense.destroy({where:{id:id,userId:req.user.id}});
        if(response===0);
        {
            return res.status(404).json({message:"Expense does not Belongs to User",success:false});
        }
        res.status(200).json({message:response,success:true});
    }
    catch(err){

        res.status(500).json({message:err,success:true});

    }
}
