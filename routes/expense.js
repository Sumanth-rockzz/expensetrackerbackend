
const express=require('express');

const expenseControllers=require('../controllers/expense');

const router=express.Router();

router.post('/add-expense',expenseControllers.addexpense);

router.get('/get-expenses',expenseControllers.getExpenses);

router.delete('/delete-expense/:id',expenseControllers.deleteExpense);

module.exports=router;