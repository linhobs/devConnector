const jwt=require('jsonwebtoken');
const config=require('config');



module.exports=function(req,res,next){
//get the token from the header
const token=req.header('x-auth-token');
//check if no token
if(!token){
    return res.status(401).json({msg:'no token, authentication denied'});
}

//verify token.
try{
    const decoded=jwt.verify(token,config.get('jwtSecret'));
    req.user=decoded.user; //the user specified in the payload.
    next();

}catch(err){
  res.status(401).json({msg:'invalid token'});
}

}

//interestingly wrote these codes on a busy day on nov,7 through to 8. I slept in the office to get this piece of 
//sh*t working. 
//sleepy as I write this but I know I will see this and smile one day.
//if you ever happen to see this, hala moi at gyamenahyawpius@gmail.com.