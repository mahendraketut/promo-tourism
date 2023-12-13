import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css'],
})
export class ForgotComponent {
  isRequestForgot: boolean;
  isChangePassword: boolean;
  logo: any;

  constructor() {
    this.isRequestForgot = false;
    this.isChangePassword = false;
    this.logo = '/assets/img/logo-landscape.png';
  }
  //Request reset password area: start
  requestResetForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  requestResetValidator(formGroup: FormGroup) {
    const email = formGroup.get('email').value;
  }

  onSubmitRequest() {
    this.isRequestForgot = true;
    this.isChangePassword = true;
  }

  //Request reset password area: end

  //Change password area: start
  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword').value;
    const confirmPassword = formGroup.get('confirmPassword').value;

    //check if both old Password and New Password are match.
    if (newPassword === confirmPassword) {
      return null;
    } else {
      formGroup.get('confirmPassword').setErrors({ passwordMismatch: true });
      return { passwordMismatch: true }; // Passwords do not match
    }
  }

  // verification code checker
  verificationCodeValidator(formGroup: FormGroup) {
    const verificationCode = formGroup.get('verificationCode').value;
    //check if verification code is valid
    if (verificationCode === '123456') {
      return null;
    } else {
      formGroup.get('verificationCode').setErrors({ invalidCode: true });
      return { invalidCode: true }; // invalid verification code
    }
  }

  resetPasswordForm = new FormGroup(
    {
      verificationCode: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    {
      validators: [this.passwordMatchValidator, this.verificationCodeValidator],
    }
  );

  onSubmitResetPassword() {
    if (this.resetPasswordForm.valid) {
      const newPassword = this.resetPasswordForm.get('newPassword').value;
      //send request to backend to validate the old password
      //if valid, then update the new password
      //if not, then return error message
    }
  }
}
