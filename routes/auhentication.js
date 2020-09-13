const User =require('../models/user');
const jwt=require('jsonwebtoken');
const config=require('../config/database');


module.exports=(router)=>{
    router.post('/register',(req,res)=>{
        
        // console.log(req.body);
        // req.body.email;
        // req.body.username;
        // req.body.password;
        if(!req.body.email || !req.body.username || !req.body.password){
            res.json({success:false,message:'You must Provide all Mendatory fields'})
        }
        else{
            // res.send('hello World!!');
            var user=new User({
                email: req.body.email.toLowerCase(),
                username: req.body.username.toLowerCase(),
                password: req.body.password
            })
            user.save((err)=>{
                if(err){

                    if(err.errors)
                    {
                        if(err.errors.email)
                        {
                            res.json({Success:false,message:err.errors.email.message});
                        }

                        else if(err.errors.username)
                        {
                            res.json({Success:false,message:err.errors.username.message});
                        }
                    }
                    

                    else{res.json({Success:false,message:'could not save User. Error:',err });}
                    
                }
                else{
                    res.json({Success:true,message:'Account Registered!'});
                }
            })
        }
        
    });


    


    //check for Email existence in db
    router.get('/checkEmail/:email',(req,res)=>{
        // console.log(req.params.email);
        if(!req.params.email){
            res.json({Success:false,message:'E-mail was not provided'})
        }
        else{
            User.findOne({email:req.param.email},(err,user)=>{

                if(err){
                    res.json({Success:false,message:err})                    
                }
                if(User){
                    res.json({Success:false,message:'E-mail is already taken'})
                }
                else{
                    res.json({Success:true,message:'E-mail is available'})
                }
            })
        }
    })

//check for User existence in db
router.get('/checkUsername/:username',(req,res)=>{
    if(!req.params.username){
        res.json({Success:false,message:'User name was not provided'})
    }
    else{
        User.findOne({email:req.param.username},(err,user)=>{

            if(err){
                res.json({Success:false,message:err})                    
            }
            if(User){
                res.json({Success:false,message:'User name is already taken'})
            }
            else{
                res.json({Success:true,message:'User name is available'})
            }
        })
    }
})
    
router.post('/login',(req,res)=>{console.log('working!!!');
    if(!req.body.email){
        res.json({Success:false,message:'No username was provided'})
    }
    else if(!req.body.password){
        res.json({Success:false,message:'No password was provided'})
    }
    //  console.log(req.body);
    else{
        User.findOne({email:req.body.email.toLowerCase()},(err,user)=>{
            console.log(user)
            if(err){
                res.json({Success:false,message:'error:'+err})
            }
            else{
                if(!user){
                    res.json({Success:false,message:'User not found'})
                }else{
                    const validPassword=user.comparePassword(req.body.password)
                    if(!validPassword){
                        res.json({Success:false,message:'password invalid'})
                    }
                    else{
                        const token=jwt.sign({userId:user._id},config.secret,{expiresIn:'24hr'});
                        res.json({Success:true,message:'Success!',token:token,user:{username:user.username}})
                    }
                }
            }
        })
        // res.json({Success:true,message:'user Login request sent'}) 
    }
     
})

router.use((req,res,next)=>{

    const token=req.headers.authorization;
   
    if(!token){
        res.json({Success:false,message:'no token provided'})
    }
    else{
        jwt.verify(token,config.secret,(err,decoded)=>{
            if(err){
                res.json({Success:false,message:'invalid token!'+err})
            }
            else{
                req.decoded=decoded;
               
                next();
            }
        })
    }
})

router.get('/profile',(req,res)=>{
    User.findOne({_id:req.decoded.userId}).select('username email').exec((err,user)=>{
        if(err){
            res.json({Success:false,message:err})
        }
        else if(!user){
            res.json({Success:false,message:'User not found'}) 
        }
        else{
            res.json({Success:true,user:user})
        }
    })
     // res.send(req.decoded);
})
    return router;
}