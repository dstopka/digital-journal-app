import { Injectable } from '@angular/core';
import { entryInfoDto } from '../models/journal-entry/entryInfoDto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticationService } from './authentication.service';

enum Count {
  Single,
  Multiple
}

@Injectable({
  providedIn: 'root'
})
export class JournalEntryService {
  private apiUrlSingle: string;
  private apiUrlMultiple: string;

  constructor(private _http: HttpClient, private _jwtHelper: JwtHelperService,
    private _authService: AuthenticationService) {
    this.apiUrlSingle = 'api/entry/';
    this.apiUrlMultiple = 'api/entries/';
  }

  public getEntriesInfo = (): Promise<entryInfoDto[]> => {
    const userId = this._authService.getUserId();

    if (userId == null) {
      return Promise.resolve([]);
    }

    const options = { params: new HttpParams().set('userId', userId.toString()) };
    return this._http.get<entryInfoDto[]>(this.getFullRoute(Count.Multiple, 'overview'), options).toPromise();

  }

  public stringifyDate = (date: Date): string => {
    const day = date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate().toString();
    const month = date.getMonth() < 10 ? '0' + date.getMonth().toString() : date.getMonth().toString();
    const year = date.getFullYear().toString();

    return day + '-' + month + '-' + year;
  }

  private getFullRoute = (count: Count, ...parts: string[]): string => {
    let route: string = '';
    parts.forEach(part => {
      route = `${route}${part}/`;
    });

    return count == Count.Single ? `${this.apiUrlSingle}${route.slice(0, -1)}` : `${this.apiUrlMultiple}${route.slice(0, -1)}`;
  }
}
