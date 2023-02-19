const express=require('express');

const app=express();

const cors=require('cors');
app.use(cors());

const UserRoutes=require('./routes/users');

const ExpenseRoutes=require('./routes/expense');

const bodyParser=require('body-parser');

const sequelize=require('./util/database');


const User=require('./models/users');
const Expense=require('./models/expense');

User.hasMany(Expense);
Expense.belongsTo(User);



app.use(bodyParser.json({extended:false}));


app.use('/user',UserRoutes);

app.use('/expense',ExpenseRoutes);



sequelize.sync(/* {force:true} */)
.then(()=>{
    app.listen(3000);
}).catch(err=>console.log(err));


