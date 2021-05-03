import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserForRegistrationDto } from '../../models/user/userForRegistrationDto';
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
  private _returnUrl!: string;

  constructor(private _authService: AuthenticationService, private _router: Router, private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required])
    })
    this._returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
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
        localStorage.setItem("token", res.token);
        localStorage.setItem("id", res.id.toString());
        this._authService.sendAuthStateChangeNotification(res.isSuccessful);
        this._router.navigate([this._returnUrl]);
      },
        (error) => {
          this.errorMessage = error;
          this.showError = true;
        })
  }


}
