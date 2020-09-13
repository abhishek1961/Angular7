const mongoose = require('mongoose');
mongoose.Promise=global.Promise;
const Schema = mongoose.Schema; //defining Schema
const bcrypt = require('bcrypt-nodejs');


let emailLengthChecker=(email)=>{
  if(!email){
      return false;
  }
  else{
      if(email.length<5 || email.length>30){
          return false;
      }
      else{return true;}
  }
};

let validEmailChecker=(email)=>{

  if(!email){return false}
  else{
    const regExp=new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regExp.test(email);
  }
};

const emailValidators=[
  {validator:emailLengthChecker, message:'email must be in between 5 to 30 '},
  {validator:validEmailChecker, message:'must be a valid Email'}
]


let UsernameLengthChecker=(username)=>{
  if(!username){
      return false;
  }
  else{
      if(username.length<3 || username.length>13){
          return false;
      }
      else{return true;}
  }
};


let validUsernameChecker=(username)=>{
  if(!username){return false}
  else{
    const regExp=new RegExp(/^[a-zA-z0-9]+$/);
    return regExp.test(username);
   // return true;
  }
}

const usernameValidator=[
  {validator:UsernameLengthChecker, message:'email must be in between 3 to 13 '},
  {validator:validUsernameChecker, message:'must be a valid Username'}
]

const userSchema = new Schema({
  email: {type: String,required:true,unique:true,lowercase:true,validate:emailValidators},
  username: {type: String,required:true,unique:true,lowercase:true,validate:usernameValidator},
  password: {type: String,required:true}
});

userSchema.pre('save',function(next){  
 if(!this.isModified('password')){return next();}
  bcrypt.hash(this.password,null,null,(err,hash)=>{
    if(err){return next(err);}
   
    this.password=hash;
    next();
  });
})

//method that compare password to database encrypted password upon login 
userSchema.methods.comparePassword= function(password){
  
   return bcrypt.compareSync(password,this.password);

   //compareSync not working so use this
  //  bcrypt.hash(password,null,null,(err,hash)=>{
  //   if(err){return false;}
   
  //   password=hash;
   
  //   console.log(password);
  // console.log(this.password);
  // if(password==this.password){
  //   return true;
  // }
  // else{return false;}
  // });
  
};
module.exports= mongoose.model('User', userSchema); //creating model mongoose.model(modelName, schema)

