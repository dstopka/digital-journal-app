import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { UserForAuthenticationDto } from 'src/app/models/user/userForAuthenticationDto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public errorMessage: string = '';
  public showError!: boolean;

  constructor(private _authService: AuthenticationService, private _router: Router,
    private _route: ActivatedRoute, private _jwtHelper: JwtHelperService) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl("", [Validators.required]),
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
      email: login.username,
      password: login.password
    }

    this._authService.loginUser('login', userForAuth)
      .subscribe(res => {
        this.onLogin(res.token, res.isSuccessful);
        
        const redirectUrl = this._authService.redirectUrl || '/';
        this._router.navigate([redirectUrl]);
      },
        (error) => {
          this.errorMessage = error;
          this.showError = true;
        })
  }

  private onLogin = (token: string, isSuccessful: boolean) => {
    localStorage.setItem("token", token);
    this._authService.sendAuthStateChangeNotification(isSuccessful);
  }


}
