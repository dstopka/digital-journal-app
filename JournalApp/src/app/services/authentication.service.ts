import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserForRegistrationDto } from '../models/user/userForRegistrationDto';
import { RegistrationResponseDto } from '../models/response/registrationResponseDto';
import { UserForAuthenticationDto } from '../models/user/userForAuthenticationDto';
import { AuthResponseDto } from '../models/response/authResponseDto';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  apiUrl: string;
  private _authChangeSub = new Subject<boolean>()
  public authChanged = this._authChangeSub.asObservable();

  constructor(private _http: HttpClient) {
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
}
