import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../modules/authentication/user/user.service';
import { API_CONFIG } from '../core/constants/api.config';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {

  PUBLIC_URL={
    login:`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`
  }
  constructor(private router:Router,private userService:UserService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(!(request.url.includes(this.PUBLIC_URL.login))){
      const authToken= localStorage.getItem('authToken')!;
      const authReq=request.clone({
        headers:request.headers.set('Authorization',`Bearer ${authToken}`)
      });
      return this.handleRequest(authReq,next);
    }
    return this.handleRequest(request,next);
  }
  handleRequest(req:HttpRequest<unknown>,next:HttpHandler):Observable<HttpEvent<unknown>>{
    return next.handle(req).pipe(tap((event:HttpEvent<unknown>)=>{
      if(event instanceof HttpResponse){
        
      }
    },(error:any)=>{
      if(error instanceof HttpErrorResponse && error.status===401 || error.status===403){
        this.userService.logout(); 
        this.router.navigate(['/auth/sign-in']);
      }
    }))
  }
}