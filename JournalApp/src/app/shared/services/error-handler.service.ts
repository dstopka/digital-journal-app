import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements HttpInterceptor {

  constructor(private _router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = this.handleError(error);
        return throwError(errorMessage);
      })
    )
  }

  private handleError = (error: HttpErrorResponse) : string => {
    if(error.status === 404){
      return this.handleNotFound(error);
    }
    else if(error.status === 400){
      return this.handleBadRequest(error);
    }
    else if(error.status === 401){
      return this.handleUnauthorized(error);
    }
    return "";
  }
  
  private handleNotFound = (error: HttpErrorResponse): string => {
    this._router.navigate(['/404']);
    return error.message;
  }
  
  private handleBadRequest = (error: HttpErrorResponse): string => {
    switch(this._router.url){
      case '/authentication/register':
      case '/authentication/login': {
        return this.parseErrors(error.error.errors);
      }
      default: {
        return error.error ? error.error : error.message;
      }
    }
  }

  private handleUnauthorized = (error: HttpErrorResponse): string => {
    switch(this._router.url){
      case '/authentication/login': {
        return `Authentication failed. ${error.error.errors}`;
      }
      default: {
        this._router.navigate(['/authenticate/login']);
        return error.message;
      }
    }
  }

  private parseErrors = (errors: string[]): string => {
    let message = '';
      const values = Object.values(errors);
      values.map((msg) => {
         message += msg + '<br>';
      })
      return message.slice(0, -4);
  }

}