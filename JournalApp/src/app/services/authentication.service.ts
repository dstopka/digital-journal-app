import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserForRegistrationDto } from '../models/user/userForRegistrationDto';
import { RegistrationResponseDto } from '../models/response/registrationResponseDto';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  apiUrl: string;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    })
  };
  constructor(private _http: HttpClient) {
    this.apiUrl = 'api/account/';
  }

  public registerUser = (route: string, body: UserForRegistrationDto) => {
    return this._http.post<RegistrationResponseDto>(`${this.apiUrl}${route}`, body);
  }
}
