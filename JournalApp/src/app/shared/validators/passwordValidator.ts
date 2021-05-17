import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PasswordValidators {

    public static strong = (control: AbstractControl): ValidationErrors | null => {

        let errors = { 'capital': false, 'number': false, 'length': false };

        const length = control.value.length;

        const hasNumber = /\d/.test(control.value);
        const hasCapital = /[A-Z]/.test(control.value);
        const validLength = length >= 8 && length <= 20;

        if (hasNumber && hasCapital && validLength) {
            return null;
        }

        if (!hasNumber) {
            errors['number'] = true;
        }

        if(!hasCapital) {
            errors['capital'] = true;
        }

        if (!validLength) {
            errors['length'] = true;
        }

        control.setErrors(errors);
        return errors;
    }

    public static confirmPassword = (control: AbstractControl): ValidationErrors | null => {

        if (!control.parent || !control) {
            return null;
        }

        const password = control.parent.get('password');
        const confirmPassword = control.parent.get('confirmPassword');

        if (!password || !confirmPassword) {
            return null;
        }

        if (password.value !== confirmPassword.value) {
            control.setErrors({ 'mismatch': true });
            return { 'mismatch': true };
        }

        return null;
    }
}