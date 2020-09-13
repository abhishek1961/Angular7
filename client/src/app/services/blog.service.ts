import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { HttpHeaders} from '@angular/common/http' ;
import{Observable} from 'rxjs/Observable';
import {AuthService} from './auth.service'
// import 'rxjs/add/operator/map';


@Injectable({
  providedIn: 'root'
})
export class BlogService {
  options;
  domain=this.authService.domain;
  constructor(private authService:AuthService,private http:HttpClient) { }

  createAuthenticationHeaders(){
    this.authService.loadToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authService.authToken });
        this.options = { headers: headers };
    
  }

  newBlog(blog):Observable<any>{
    this.createAuthenticationHeaders();
    return this.http.post<any>(this.domain+'/blogs/newBlog',blog,this.options)
  }

  getAllBlogs():Observable<any>{
    this.createAuthenticationHeaders();
    return this.http.get<any>(this.domain+'/blogs/allBlogs',this.options);
  }

  getSingleBlogId(id):Observable<any>{
    this.createAuthenticationHeaders();
   
    return this.http.get<any>(this.domain+'/blogs/singleBlog/'+id,this.options);
  }

  editBlog(Blog):Observable<any>{
    this.createAuthenticationHeaders();
    
    return this.http.put<any>(this.domain+'/blogs/updateBlog/',Blog,this.options)
  }

  deleteBlog(Blog):Observable<any>{
    this.createAuthenticationHeaders();
    
    return this.http.delete<any>(this.domain+'/blogs/deleteBlog/'+Blog,this.options)
  }

}
