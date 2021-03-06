import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(private _authService: AuthenticationService, private _router: Router) { }

  ngOnInit(): void {
  }

  public logout = () => {
    this._authService.logoutUser();
    this._router.navigate(["/"]);
  }
}
