//authenticating user and giving a token.
const express=require('express');
const router=express.Router();
const auth=require('../../middleware/auth');
const {check,validationResult}=require('express-validator');
const User=require('../../models/User');
const bycrpt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const config=require('config');
//@route post api/auth
//@desc  authenticate  user and get token
//@access 
router.post('/', [ 
    //express validation 
    check('email','please enter a valid email').isEmail(),
    check('password','password is required').exists()
], async (req,res)=>{
    //check validation errors
    const errors=validationResult(req);
    if(!errors.isEmpty()){
         res.status(400).json({errors:errors.array() })
    }
//check if user exists.
//destructuring req.body
const { email,password}=req.body;
try{
 let user= await User.findOne({email});
 if(!user){ 
    return res.status(400).json({errors:[{msg:"invalid credentials"}]});
 }   
 //validate email and password. 
const  isMatch= await bycrpt.compare(password,user.password );
if (!isMatch) {
    return res.status(400).json({errors:[{msg:"invalid credentials"}]});
}
//return jwt
const payload={
    user:{
        id:user.id
    }
}
jwt.sign(payload,
    config.get('jwtSecret'),
    {expiresIn:360000},(err,token)=>{
        if(err) throw err;
        res.json({token});
    });



}catch(err){

    console.error(err.message);
    return res.status(500).send('server error');

}






//return jsonwebtoken

   
});

module.exports=router; 