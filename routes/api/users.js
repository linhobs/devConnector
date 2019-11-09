const express=require('express');
const router=express.Router();
const {check,validationResult}=require('express-validator');
const User=require('../../models/User');
const gravatar=require('gravatar');
const bycrpt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const config=require('config');
//@route post api/users
//@desc  Register user
//@access 
router.post('/', [ 
    //express validation
    check('name','name is required').not().isEmpty(),
    check('email','please enter a valid email').isEmail(),
    check('password','please enter a password with 6 or mor e characters').isLength({min:6})
], async (req,res)=>{
    //check validation errors
    const errors=validationResult(req);
    if(!errors.isEmpty()){
         res.status(400).json({errors:errors.array() })
    }
    //check if user exists.
//destructuring req.body
const {name, email,password}=req.body;
try{
 let user= await User.findOne({email});
 if(user){ 
    return res.status(400).json({errors:[{msg:"user already exists"}]});
 }   
 //get user gravatar from email
 const avatar=gravatar.url(email,{
     s:'200',
     r:'pg',
     d:'mm'
 });

 //create instance of user.
 user=new User({
     name,email,avatar,password
 });

 //encrypt password, salt it first.
const salt= await bycrpt.genSalt(10);
user.password=await bycrpt.hash(password,salt);
//save user.
await user.save();
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