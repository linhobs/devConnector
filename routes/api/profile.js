const express=require('express');
const router=express.Router();
const auth=require('../../middleware/auth');
const Profile =require('../../models/Profile');
const User=require('../../models/User');
const {check,validationResult}=require('express-validator');
//@route GET api/profile/me
//@desc  get current user's profile
//@access private, uses auth.
router.get('/me',auth,async (req,res)=>{
//get current user's profile
try{
    //get users profile and populate with data from user.
    const profile= await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']);
    //check if there is a profile  
    if (!profile) {
        return res.status(400).json({msg:'there is no profile for person'})
    }
    res.json(profile);

}catch(err){
    console.error(err.message);
    res.status(500).send('server error');
}


});

//@route Post api/profile
//@desc  create or update uer profile
//@access private, uses auth middleware
router.post('/',[auth,[
    check('status','status is required').not().isEmpty(),
    check('skills','skills is required').not().isEmpty()
]],
async(req,res)=>{
    const errors=validationResult(req);
    //check if there are errorrs
    if (!errors.isEmpty()) {
        res.status(400).json({errors:errors.array()});
    } 

    //destructring request bosy and getting all the fields in it.
    const{
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    }=req.body;
    //check if a field was added before adding it to database.
    //Build profile object to hold profile stuff.
    const profileFields={};
    profileFields.user=req.user.id;
    if(company)profileFields.company=company;
    if(website)profileFields.website=website;
    if(bio)profileFields.bio=bio;
    if(location)profileFields.location=location;
    if(status)profileFields.status=status;
    if(githubusername)profileFields.githubusername=githubusername;
    
    //split the skills string into an array using , as a delimiter
    if(skills){
        profileFields.skills=skills.split(',').map(skill=>skill.trim());
    };

    //build social object 
    profileFields.social={}
    if(youtube)profileFields.social.youtube=youtube;
    if(facebook)profileFields.social.facebook=facebook;
    if(twitter)profileFields.social.twitter=twitter;
    if(instagram)profileFields.social.instagram=instagram;
    if(linkedin)profileFields.social.linkedin=linkedin;
    //insert or update database.
    try{
        //look for a profile, if there is a profile update it else create it.
        let profile = await Profile.findOne({user:req.user.id});
      
        if (profile) {
            //Update profile
           
            profile = await Profile.findOneAndUpdate(
                {user:req.user.id},
                {$set:profileFields},
                {new: true}
                );
                return res.json(profile);
        }
        //create profile 
        profile=new Profile(profileFields);
        await profile.save();
        res.json(profile);
        
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');

    }


});

//@route GET api/profile
//@desc  get all profiles
//@access Public
router.get('/', async(req,res)=>{
//find all profiles
try{
const profiles= await Profile.find().populate('user',['name','avatar']);
res.json(profiles);

}catch(err){
    console.error(err.message);
    res.status(500).send('server error');
}


});

//@route GET api/profile/user/:user_id
//@desc  get profile by user ID
//@access Public
router.get('/user/:user_id', async(req,res)=>{
    //find all profiles
    try{
    const profile= await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
    if (!profile) return res.status(500).json({msg: "Profile not found"});
    res.json(profile);
    
    }catch(err){
        console.error(err.message);
        if (err.kind=='ObjectId') {
            return res.status(400).json({msg:'profile not found'});
        }
        res.status(500).send('server error');
    }
    
    
    });


module.exports=router;