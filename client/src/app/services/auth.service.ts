import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { HttpHeaders} from '@angular/common/http' ;
import{Observable} from 'rxjs/Observable';
// import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class AuthService  {
domain="http://localhost:8080";
authToken;
user;
options;

  constructor(private http:HttpClient) { }

  createAuthenticationHeaders(){
    this.loadToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken });
        this.options = { headers: headers };
    
  }

  loadToken(){
    this.authToken=localStorage.getItem('token');
  }

  getToken(){
    return localStorage.getItem('token');
  }
  registerUser(user):Observable<User_reg>{
    //  console.log(user);
    return this.http.post<User_reg>(this.domain+'/authentication/register',user);
  }

  checkEmail(email):Observable<email_chk>{
    // console.log(email);
    // return this.http.get(this.domain+'/authentication/checkEmail/'+ email).map(res=>res);
    return this.http.get<email_chk>(this.domain+'/authentication/checkEmail/'+ email);
    }
    
    checkUsername(username):Observable<username_chk>{
      // return this.http.get(this.domain+'/authentication/checkUsername/'+ username).map(res => res);
      return this.http.get<username_chk>(this.domain+'/authentication/checkUsername/'+ username);
      }

      loginUser(login):Observable<User_log>
      {
        return this.http.post<User_log>(this.domain+'/authentication/login',login)
      }

      logout(){
        this.authToken=null;
        this.user=null;
        localStorage.clear();
      }
      storeUserData(token,user){
        localStorage.setItem('token',token);
        localStorage.setItem('User',JSON.stringify(user));
        this.authToken=token;
        this.user=user
      }

      getProfile():Observable<any>{
         this.createAuthenticationHeaders();
        // this.intercept();
        
        return this.http.get<any>(this.domain+'/authentication/profile',this.options);
      }

      loggedIn(){
        this.loadToken();
        if(this.authToken){
          return true;
        }
        else{
          return false;
        }
      }

      
}

  



interface User_reg{
  email:string,username:string,password:string,Success:string,message:string
}

interface email_chk{
  email:string,Success:string,message:string
}

interface username_chk{
  username:string,Success:string,message:string
}

interface User_log{
  email:string,password:string,Success:string,message:string,token:string,user:object
}