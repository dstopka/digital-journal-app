import { Injectable } from '@angular/core';
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

  constructor(private _http: HttpClient, private _jwtHelper: JwtHelperService) {
    this.apiUrl = 'api/account/';
  }

  public registerUser = (body: UserForRegistrationDto) => {
    return this._http.post<RegistrationResponseDto>(this.getFullRoute('register'), body);
  }

  public loginUser = (body: UserForAuthenticationDto) => {
    return this._http.post<AuthResponseDto>(this.getFullRoute('login'), body);
  }

  public logoutUser = () => {
    localStorage.removeItem("token");
  }

  public isAuthenticated = () => {
    const token = localStorage.getItem('token');

    return token == null ? false : !this._jwtHelper.isTokenExpired(token);
  }

  public getUserId = (): number | null => {
    const token = localStorage.getItem('token');

    if (token == null) {
      return null;
    }

    return this._jwtHelper.decodeToken(token).id;
  }

  private getFullRoute = (route: string): string => {
    return `${this.apiUrl}${route}`;
  }
}
