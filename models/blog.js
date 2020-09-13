const mongoose = require('mongoose');
mongoose.Promise=global.Promise;
const Schema = mongoose.Schema; //defining Schema


let titleLengthChecker=(title)=>{
  if(!title){
      return false;
  }
  else{
      if(title.length<5 || title.length>50){
          return false;
      }
      else{return true;}
  }
};

let validTitleChecker=(title)=>{

  if(!title){return false}
  else{
    const regExp=new RegExp(/^[a-zA-Z0-9 ]+$/);
    return regExp.test(title);
  }
};

const titleValidators=[
  {validator:titleLengthChecker, message:'title must be in between 5 to 50 '},
  {validator:validTitleChecker, message:'must be a valid Title'}
]


let bodyLengthChecker=(body)=>{
  if(!body){
      return false;
  }
  else{
      if(body.length<10 || body.length>500){
          return false;
      }
      else{return true;}
  }
};




const bodyValidator=[
  {validator:bodyLengthChecker, message:'body must be in between 10 to 500 '},
  
]

let commentLengthChecker=(comment)=>{
    if(!comment[0]){
        return false;
    }
    else{
        if(comment[0].length<8 || comment[0].length>200){
            return false;
        }
        else{return true;}
    }
}

const commentValidators=[
    {validator:commentLengthChecker, message:'comment must be in between 8 to 200 '},
    
  ]


const blogSchema=new Schema({
    title:{type:String,required:true,validate:titleValidators},
    body:{type:String,required:true,validate:bodyValidator},
    createdBy:{type:String},
    CreatedAt:{type:Date,default:Date.now()},
    likes:{type:Number,default:0},
    likedBy:{type:Array},
    dislikes:{type:Number,default:0},
    dislikedBy:{type:Array},
    comments:[
        {
            comment:{type:String,validate:commentValidators},
            commentator:{type:String}
        }
        
    ]
})




module.exports= mongoose.model('Blog', blogSchema); //creating model mongoose.model(modelName, schema)

