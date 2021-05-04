import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserForRegistrationDto } from '../models/user/userForRegistrationDto';
import { RegistrationResponseDto } from '../models/response/registrationResponseDto';
import { UserForAuthenticationDto } from '../models/user/userForAuthenticationDto';
import { AuthResponseDto } from '../models/response/authResponseDto';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl: string;
  public redirectUrl!: string;
  private _authChangeSub = new Subject<boolean>()
  public authChanged = this._authChangeSub.asObservable();

  constructor(private _http: HttpClient, private _jwtHelper: JwtHelperService) {
    this.apiUrl = 'api/account/';
  }

  public registerUser = (route: string, body: UserForRegistrationDto) => {
    return this._http.post<RegistrationResponseDto>(`${this.apiUrl}${route}`, body);
  }

  public loginUser = (route: string, body: UserForAuthenticationDto) => {
    return this._http.post<AuthResponseDto>(`${this.apiUrl}${route}`, body);
  }

  public logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    this.sendAuthStateChangeNotification(false);
  }

  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this._authChangeSub.next(isAuthenticated);
  }

  public isAuthenticated = () => {
    const token = localStorage.getItem('token');

    return token == null ? false : !this._jwtHelper.isTokenExpired(token);
  }
}
