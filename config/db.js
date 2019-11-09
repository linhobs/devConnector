//handling database connection
const mongoose=require('mongoose');
const config=require('config'); //getting default.json in config
const db=config.get('mongoURI');

//connecting the db. using async await.
const connectDB = async ()=>{
try{
    await mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true});
    console.log('mongo db connect')
}catch(err){
    //print error message if fail
console.error(err.message);
//exit process with failure
process.exit(1);
}
}

//export so it can be imported.
module.exports=connectDB;