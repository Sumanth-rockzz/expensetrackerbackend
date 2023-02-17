const express=require('express');

const app=express();

const cors=require('cors');
app.use(cors());

const UserRoutes=require('./routes/users');

const bodyParser=require('body-parser');
const sequelize=require('./util/database');

app.use(bodyParser.json({extended:false}));


app.use('/user',UserRoutes);

sequelize.sync({force:true})
.then(()=>{
    app.listen(3000);
}).catch(err=>console.log(err));


