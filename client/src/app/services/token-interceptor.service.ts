import { Injectable,Injector } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { HttpHeaders,HttpInterceptor,HttpRequest,HttpHandler ,HttpEvent } from '@angular/common/http' ;
import{Observable} from 'rxjs/Observable';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  authToken=localStorage.getItem('token');
  constructor(private injector:Injector) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   let authService=this.injector.get(AuthService);
   let  tokenizedReq = req.clone({
      setHeaders: {
        // Content-Type : 'application/json; charset=utf-8',
        Accept       : 'application/json',
        Authorization: authService.getToken(),
      },
      // headers: req.headers.set('Authorization', 'bearer ' + this.authToken)
    })

    return next.handle(tokenizedReq);
  }
}
