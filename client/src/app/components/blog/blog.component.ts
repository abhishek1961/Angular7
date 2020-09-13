import { Component, OnInit } from '@angular/core';
import {FormControl,FormGroup,FormBuilder,Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service'
import {BlogService} from '../../services/blog.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  newpost=false;
  loadingBlogs=false;
  form;
  processing=false;
  username='';
  messageClass;
  message;
  blogPost;
  delBlog;
  delmsg=false;

  constructor(private formBuilder:FormBuilder,private authService:AuthService,private blogService:BlogService,private router:Router) { 
    this.createNewBlogForm();
  }

  createNewBlogForm(){
    this.form=this.formBuilder.group({
      title:['',Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphaNumericValidation
      ])],
      body:['',Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5),
        this.alphaNumericValidation
      ])],
    })
  }

  enableFormNewBlogForm(){
    this.form.get('title').enable;
    this.form.get('body').enable;
  }

  disableFormNewBlogForm(){
    this.form.get('title').disable;
    this.form.get('body').disable;
  }
  alphaNumericValidation(controls){
    const regExp=new RegExp(/^[a-zA-Z0-9 ]+$/);
    if(regExp.test(controls.value)){
      return null;
    }
    else{
      return {'alphaNumericValidation':true}
    }
  }

  newBlogForm(){
    this.newpost=true;
  }

  reloadBlogs(){
    this.loadingBlogs=true;
    this.getAllBlogs();
   setTimeout(()=>{
    this.loadingBlogs=false;
   },2000);
  }

  draftComment(){

  }

  onBlogSubmit(){
    this.processing=true;
    this.disableFormNewBlogForm();

    const blog={
      title:this.form.get('title').value,
      body:this.form.get('body').value,
      createdBy:this.username
    }

    this.blogService.newBlog(blog).subscribe(data=>{
      if(!data.Success){
        this.messageClass="alert alert-danger";
        this.message=data.message;
        this.processing=false;
        this.enableFormNewBlogForm();
      }
      else{
        this.messageClass="alert alert-success";
        this.message=data.message;
        this.getAllBlogs();
        
        setTimeout(()=>{
          this.newpost=false;
          this.processing=false;
          this.message=false;
          this.form.reset();
          this.enableFormNewBlogForm();
        },2000)

      }
    })
  }

  goBack(){
    window.location.reload();
  }
  

  getAllBlogs(){
    this.blogService.getAllBlogs().subscribe(data=>{
      this.blogPost=data.blogs;
    })
    // console.log(this.blogPost);
  }

  deleteBlog(){console.log('del');
    this.blogService.deleteBlog(this.delBlog._id).subscribe(data=>{
    
      if(!data.Success){
        this.messageClass='alert alert-danger';
         this.message=data.message;
      }
      else{
        this.messageClass='alert alert-success';
         this.message=data.message;
         
      }
      this.delmsg=true;
      this.delBlog={};
      this.reloadBlogs();
    })
    
  }

  setBlog(blog){
    this.delBlog=blog;
    console.log(this.delBlog);
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile=>{
      this.username=profile.user.username
    })

    this.getAllBlogs();
  }

}
