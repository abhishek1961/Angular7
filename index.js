const express=require('express');
const app= express();
const router=express.Router();
const path=require('path');


const config=require('./config/database');
const mongoose = require('mongoose');
const authentication=require('./routes/auhentication')(router);
const blog=require('./routes/blog')(router);

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
const cors=require('cors');

mongoose.Promise=global.Promise;

mongoose.connect(config.uri,(err)=>{
    if(err){
        console.log('database not connected: ',err)
    }
    else{console.log('connected to database: '+config.db)
    // console.log(config.secret)
}
});






app.use(cors())

app.use(bodyParser.urlencoded({extended : false}))
app.use(express.static(__dirname+'/client/dist/'));
app.use('/authentication',authentication);
app.use('/blogs',blog);




app.get('/',(req,res,nex)=>{
    // res.sendFile(path.join(__dirname+'/client/dist/index.html'));
    res.send('First Angular 6 Application');
})

app.listen(8080,()=>{console.log(__dirname);})