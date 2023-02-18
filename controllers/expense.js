
const { where } = require('sequelize');
const Expense=require('../models/expense');

function isStringInvalid(string){
    if(string.length===0 || string==undefined){
        return true;
    }else{
        return false;
    }
}

exports.addexpense=async(req,res,next)=>{
    try{
        const {amount,date,reason,category}=req.body;
        if(isStringInvalid(amount)||isStringInvalid(date)||
        isStringInvalid(reason)||isStringInvalid(category))
        {
            return res.status(500).json({message:'Bad Parmeters:Something is Missing',success:false})
        }
       const response= await Expense.create({amount,date,reason,category})
        res.status(200).json({message:response,success:true});
        
    }catch(err){
        res.status(500).json({message:"Something went wrong",success:false})
    }

}

exports.getExpenses=async(req,res,next)=>{

    try{
        const response=await Expense.findAll();
        res.status(200).json({message:response,success:true});
    }
    catch(err){

        res.status(500).json({message:err,success:true});

    }
}

exports.deleteExpense=async(req,res,next)=>{

    try{
        const id=req.params.id;
        const response=await Expense.destroy({where:{id:id}});
        res.status(200).json({message:response,success:true});
    }
    catch(err){

        res.status(500).json({message:err,success:true});

    }
}
