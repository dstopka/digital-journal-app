import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  public isAuthenticated!: boolean;
  constructor(private _authService: AuthenticationService) { }

  ngOnInit(): void {
    this.isAuthenticated = this._authService.isAuthenticated();
  }

}
