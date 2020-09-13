import { Component, OnInit, createPlatform } from '@angular/core';
import {FormsModule, Validators} from '@angular/forms'
import {FormGroup,FormBuilder} from '@angular/forms'
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router'
import PNotify from 'pnotify/dist/es/PNotify';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form:FormGroup;
  processing=false;
  message;
  messageClass;

  constructor(private formbuilder:FormBuilder,private authService:AuthService,private router:Router) { 
    this.createform();
  }

createform(){
 this.form=this.formbuilder.group({
  email:['',Validators.compose([
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(30),
    this.validateEmail
  ])],
  password:['',Validators.compose([
    Validators.required,
         Validators.minLength(3),
         Validators.maxLength(12),
         this.validatePassword
  ])]
 })
}

  validateEmail(controls){
    const regExp=new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regExp.test(controls.value)){
      return null;
    }
    else{
      return {'validateEmail': true}
    }
  }

  validatePassword(control){
    const regExp=new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/);
    if (regExp.test(control.value)){
      return null;
    }
    else{
      return {'validatePassword': true}
    }
  }

  disableForm(){
    this.form.controls.email.disable();
    this.form.controls.password.disable();
  }

  enableForm(){
    this.form.controls.email.enable();
    this.form.controls.password.enable();
  }

  onloginsubmit(){
    // console.log();
    const Login={
      email:this.form.get('email').value,
      password:this.form.get('password').value
    }
    this.disableForm();
    this.processing=true;
    this.authService.loginUser(Login).subscribe(data=>{
      if(data.Success){
        this.message=data.message;
        this.messageClass="alert alert-success";
        this.authService.storeUserData(data.token,data.user);

        PNotify.success({text:'Login Successfully!!'});
        setTimeout(()=>{
          this.router.navigate(['/profile'])
        },2000);
      }
      else{
        this.message=data.message;
        this.messageClass="alert alert-danger";
      }
    })
  }
  ngOnInit() {
  }

}
