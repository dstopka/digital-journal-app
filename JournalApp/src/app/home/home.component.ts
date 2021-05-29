import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../authentication/login/login.component';
import { RegisterUserComponent } from '../authentication/register-user/register-user.component';
import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private dialog!: NgbModalRef;
  public isAuthenticated!: boolean;

  constructor(private _modalService: NgbModal, private _router: Router,
     private _authService: AuthenticationService) {
    this.isAuthenticated = this._authService.isAuthenticated();
    this.routeAuthenticatedUser();
    this.createModal();
  }

  ngOnInit(): void { }

  private createModal = () => {
    const url = this._router.url;

    if (url == '/authentication/login') {
      this.dialog = this._modalService.open(LoginComponent, { centered: true, animation: true })
    }
    else if (url == '/authentication/register') {
      this.dialog = this._modalService.open(RegisterUserComponent, { centered: true, animation: true })
    }

    if (this.dialog != null) {
      this.dialog.result.then(() => {
      }, (reason) => {
        this._router.navigateByUrl('');
      });
    }
  }

  private routeAuthenticatedUser = () => {
    if(this.isAuthenticated && this._router.url == '/'){
      this._router.navigateByUrl('/dashboard');
    }
  }
}

