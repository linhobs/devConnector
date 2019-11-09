const express=require('express');
const app=express();
const connectDB=require('./config/db');
const port=process.env.PORT||5000;
//connect db
connectDB();
//init middleware. body-parser now in express. 
app.use(express.json({extended:false}));


app.get('/',(req,res)=>res.send('api running'));
//define routes middleware to point to routes
app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/profile',require('./routes/api/profile'));
app.use('/api/posts',require('./routes/api/users'));



app.listen(port,()=>{
    console.log(`server  started on port ${port}`);
});
//this will serve as reference and boilerplate to all the node I will be doing from henceforth.
//i Conf a then i go come here come check then make clear. the intention is to go world class, go deep or go home.