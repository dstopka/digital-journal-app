import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PasswordValidators } from 'src/app/shared/validators/passwordValidator';
import { UserForRegistrationDto } from '../../shared/models/user/userForRegistrationDto';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss', '../authentication.scss']
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
      password: new FormControl('', [PasswordValidators.strong, Validators.required]),
      confirmPassword: new FormControl('', [PasswordValidators.confirmPassword])
    })
  };

  public validateTouched = (controlName: string) => {
    return this.registerForm.controls[controlName].invalid && this.registerForm.controls[controlName].touched;
  }

  public validateDirty = (controlName: string) => {
    return this.registerForm.controls[controlName].invalid && this.registerForm.controls[controlName].dirty;
  }

  public hasError = (controlName: string, errorName?: string ) => {
    if(errorName == undefined) {
      console.log(this.registerForm.controls[controlName].errors);
      return this.registerForm.controls[controlName].errors == null ? false : true;
    }

    return this.registerForm.controls[controlName].hasError(errorName);
  }

  public checkPasswordRequirement = (requirement: string) => {
    if (this.hasError('password', requirement)) {
      return 'text-invalid';
    }

    return 'text-valid';
  }

  public registerUser = (registerFormValue: any) => {
    this.showError = false;
    const formValues = { ...registerFormValue };
    const user: UserForRegistrationDto = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      password: formValues.password,
      passwordConfirmation: formValues.confirmPassword
    };

    this._authService.registerUser(user)
      .subscribe(_ => {
        this._router.navigate(["/authentication/login"])
        this.close();
      },
        error => {
          this.errorMessage = error;
          this.showError = true;
        })
  }

  public closeRoute = (route: string) => {
    this.close();
    this._router.navigate([route])
  }

  private close = () => {
    this._activeModal.close();
  }
}
