import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public isAuthenticated!: boolean;
  constructor(private _authService: AuthenticationService) { }

  ngOnInit(): void {
    this.isAuthenticated = this._authService.isAuthenticated();
  }

}
