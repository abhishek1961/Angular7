import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl,FormBuilder, Validators, RequiredValidator} from '@angular/forms';
import {AuthService} from '../../services/auth.service'
import {Router} from '@angular/router'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  details:object;
  form:FormGroup;
  return_reg_auth:object={};
  messageClass;
  message;
  processing=false;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;
  
  // profileForm = new FormGroup({
  //   email: new FormControl(''),
  //   username: new FormControl(''),
  //   password: new FormControl(''),
  //   confirm: new FormControl(''),
  // });

  constructor(private frombuilder:FormBuilder,private authService:AuthService,private router:Router) {
    this.createForm()
  }

   createForm(){
     this.form=this.frombuilder.group({
      email:['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validateEmail
      ])],
       username:['', Validators.compose([
         Validators.required,
         Validators.minLength(3),
         Validators.maxLength(12),
         this.validateUsername
       ])],
       password:['', Validators.compose([
         Validators.required,
         this.validatePassword
       ])],
       confirm:['', Validators.required]
     },
     {validator:this.matchingPassword('password','confirm')}
     );
   }
  
   disableForm(){
    this.form.controls['email'].disable();
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable();
   }
   enableForm(){
    this.form.controls['email'].enable();
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();
   }
  //  name = new FormControl('');

  validateEmail(controls){
    const regExp=new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regExp.test(controls.value)){
      return null;
    }
    else{
      return {'validateEmail': true}
    }
  }

  validateUsername(controls){
    const regExp=new RegExp(/^[a-zA-z0-9]+$/);
    if(regExp.test(controls.value))
    {return null;
    }
    else{
      return {'validateUsername':true};
    }

  }

  validatePassword(controls){
    const regExp=new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/);
    if(regExp.test(controls.value)){
      return null;
    }
    else{
      return {'validatePassword':true};
    }
  }

  matchingPassword(password,confirm){
    return (group:FormGroup)=>{
      if(group.controls.password.value===group.controls.confirm.value){
        return null;
      }
      else{
        return {'matchingPassword':true}
      }
    }
  }
   onSubmit(){
       this.processing=true;
       this.disableForm();
      const User={
        email:this.form.get('email').value,
        username:this.form.get('username').value,
        password:this.form.get('password').value
      };
     
     //this.authService.registerUser(User).subscribe(data=> this.return_reg_auth=data);
     this.authService.registerUser(User).subscribe(data=> {
       if(!data.Success){
        this.processing=false;
        this.enableForm();
        this.messageClass='alert alert-danger';
        
       }
       else{this.messageClass='alert alert-success';
       setTimeout(()=>{
        this.router.navigate(['/login']);
       },3000)
       
      }
       this.message=data.message;
       
       
     });
   }

   checkEmail(){
    const email=this.form.get('email').value;
    this.authService.checkEmail(email).subscribe(data=>{
      if(!data.Success){
        this.emailValid=false;
        this.emailMessage=data.message;
      }
      else{
        this.emailValid=true;
        this.emailMessage=data.message;
      }
      console.log(this.emailMessage);
    })
   }

   checkUsername(){
    const username=this.form.get('username').value;
    this.authService.checkUsername(username).subscribe(data=>{
      if(!data.Success){
        this.usernameValid=false;
        this.usernameMessage=data.message;
      }
      else{
        this.usernameValid=true;
        this.usernameMessage=data.message;
      }
    })
  }


  ngOnInit() {
  }

}
