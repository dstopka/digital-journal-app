import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { UserForAuthenticationDto } from 'src/app/shared/models/user/userForAuthenticationDto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../authentication.scss']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public errorMessage: string = '';
  public showError!: boolean;

  constructor(private _authService: AuthenticationService, private _router: Router,
    private _activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required])
    })
  }

  public validateControl = (controlName: string) => {
    return this.loginForm.controls[controlName].invalid && this.loginForm.controls[controlName].touched
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName)
  }

  public loginUser = (loginFormValue: any) => {
    this.showError = false;

    const login = { ...loginFormValue };
    const userForAuth: UserForAuthenticationDto = {
      email: login.email,
      password: login.password
    }

    this._authService.loginUser(userForAuth)
      .subscribe(res => {
        this.onLogin(res.token);
        
        this._router.navigate(['/dashboard']);
        this.close();
      },
        (error) => {
          this.errorMessage = error;
          this.showError = true;
        })
  }

  private onLogin = (token: string) => {
    localStorage.setItem("token", token);
  }

  public closeRoute = (route: string) => {
    this.close();
    this._router.navigate([route])
  }

  private close = () => {
    this._activeModal.close();
  }

}
