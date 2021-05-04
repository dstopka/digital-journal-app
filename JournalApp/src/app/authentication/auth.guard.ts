import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _authService: AuthenticationService, private _router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): true | UrlTree {
      
    return this.checkLogin(state.url);
  }

  checkLogin(url: string) : true | UrlTree {
    if (this._authService.isAuthenticated()) {
      return true;
    }

    this._authService.redirectUrl = url;

    return this._router.parseUrl('/authentication/login');
  }
  
}
