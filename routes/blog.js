const User=require('../models/user');
const Blog=require('../models/blog');
// const jwt=require('jsonwebtoken');
const config=require('../config/database');

module.exports=(router)=>{

        router.post('/newBlog',(req,res)=>{
            // res.send('blog content');

            if(!req.body.title){
                res.json({Success:false,message:'Blog Title is required'});
            }
                else if(!req.body.body){
                    res.json({Success:false,message:'Blog Body is required'});
                }
                  else if(!req.body.createdBy){
                        res.json({Success:false,message:'Blog creator is required'});
                    }
                else{
                    const blog=new Blog({
                        title:req.body.title,
                        body:req.body.body,
                        createdBy:req.body.createdBy
                    });
                    blog.save((err)=>{
                        if(err){
                            res.json({Success:false,message:'error:'+err})
                        }
                       else{
                           res.json({Success:true,message:'Blog Saved!'})
                       }
                    })
                }
            
        })

        router.get('/allBlogs',(req,res)=>{
            Blog.find({},(err,blogs)=>{
                if(err){
                    res.json({Success:false,message:err})
                }
                else{
                    if(!blogs){
                        res.json({Success:false,message:'No Blog Found'});
                    }
                    else{
                        res.json({Success:true,blogs:blogs})
                    }
                }
            }).sort({'_id':-1});
        });

        router.get('/singleBlog/:id',(req,res)=>{
           
            
            if(!req.params.id){
                res.json({Success:false,message:'No blog id was provided'})
            }
            Blog.findOne({_id:req.params.id},(err,blog)=>{
                if(err){
                    res.json({Success:false,message:'error:'+err})
                }
                else{
                    if(!blog){
                        res.json({Success:false,message:'Blog not found'})
                    }
                    else{
                        res.json({Success:true,blog:blog})
                    }
                }
            })
        })

        router.put('/updateBlog',(req,res)=>{
           
            if(!req.body._id){
                res.json({Success:false,message:'No blog id is provided'})
            }
            else{
                Blog.findOne({_id:req.body._id},(err,blog)=>{
                    if(err){
                        res.json({Success:false,message:'not a valid blog id'})
                    }
                    else{
                        if(!blog){
                            res.json({Success:false,message:'blog not found'}) 
                        }
                        else{
                            User.findOne({_id:req.decoded.userId},(err,user)=>{
                                if(err){
                                    res.json({Success:false,message:err})
                                }
                                else{
                                    if(!user){
                                        res.json({Success:false,message:'Unable to authenticate user'})
                                    }
                                    else{
                                        if (user.username !== blog.createdBy) {
                                            res.json({ success: false, message: 'You are not authorized to edit this blog post.' }); // Return error message
                                          }
                                          else{
                                            blog.title = req.body.title; // Save latest blog title
                                            blog.body = req.body.body; // Save latest body
                                            blog.save((err) => {
                                              if (err) {
                                                if (err.errors) {
                                                  res.json({ success: false, message: 'Please ensure form is filled out properly' });
                                                } else {
                                                  res.json({ success: false, message: err }); // Return error message
                                                }
                                              } else {
                                                res.json({ success: true, message: 'Blog Updated!' }); // Return success message
                                              }
                                            });
                                          }
                                    }
                                }
                            })
                        }
                    }
                })
            }
        })

        router.delete('/deleteBlog/:id',(req,res)=>{
            if(!req.params.id){
                res.json({Success:true,message:'No id provided'});
            }
            else{
                Blog.findOne({_id:req.params.id},(err,blog)=>{
                    if(err){
                        res.json({Success:false,message:'Invalid Id'});
                    }
                    else{
                        if(!blog){
                            res.json({Success:false,message:'Id was not fond'});
                        }
                        else{
                            User.findOne({_id:req.decoded.userId},(err,user)=>{
                                if(err){
                                    res.json({Success:false,message:'Invalid Id'});
                                }
                                else{
                                    if(!user){
                                        res.json({Success:false,message:'Unable to authenticate user'});
                                    }
                                    else{
                                        if(user.username!==blog.createdBy){
                                            res.json({Success:false,message:'You are not autherized to delete this blog'})
                                        }
                                        else{
                                            blog.remove((err)=>{
                                                if(err){
                                                    res.json({Success:false,message:err})
                                                }
                                                else{
                                                    res.json({Success:true,message:'Blog Deleted!'})
                                                }
                                            })
                                        }
                                    }
                                } 
                            })
                        }
                    }
                })
            }
        })  
    return router;
}