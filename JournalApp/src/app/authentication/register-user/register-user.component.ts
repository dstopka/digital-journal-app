import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserForRegistrationDto } from '../../shared/models/user/userForRegistrationDto';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {
  public registerForm!: FormGroup;
  public errorMessage: string = "";
  public showError!: boolean;

  constructor(private _authService: AuthenticationService, private _router: Router,
    private _activeModal: NgbActiveModal) {
   }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirm: new FormControl('')
    });
  }

  public validateControl = (controlName: string) => {
    return this.registerForm.controls[controlName].invalid && this.registerForm.controls[controlName].touched
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.registerForm.controls[controlName].hasError(errorName)
  }

  public registerUser = (registerFormValue: any) => {
    this.showError = false;
    const formValues = { ...registerFormValue };
    const user: UserForRegistrationDto = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      password: formValues.password,
      passwordConfirmation: formValues.confirm
    };
    this._authService.registerUser("register", user)
    .subscribe(_ => {
      this._router.navigate(["/authentication/login"])
      this.close();
    },
    error => {
      this.errorMessage = error;
      this.showError = true;
    })
  }

  public closeRouteHome = () => {
    this.close();
    this._router.navigate(['/'])
  }

  private close = () => {
    this._activeModal.close();
  }
}
