import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css'],
})
export class ForgotComponent {
  isRequestForgot: boolean;
  isChangePassword: boolean;
  logo: any;

  //IsRequestForgot is used to show/hide the Request Reset Password Form.
  //IsChangePassword is used to show/hide the Change Password Form.
  constructor(private authService: AuthService, private router: Router) {
    this.isRequestForgot = false;
    this.isChangePassword = false;
    this.logo = '/assets/img/logo-landscape.png';
  }
  //Request reset password form where user enters their email address.
  requestResetForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ], [
      //Calls custom validator to check if email is taken or not.
      this.checkEmailTaken.bind(this)
    ]),
  });

  //Custom validator to check if email is taken or not.
  //This is a repurposed validator from another page, but it works.
  //It checks if the email is taken or not.
  //User can only request reset password if the email entered is taken.
  checkEmailTaken(control: AbstractControl): Promise<ValidationErrors | null> {
    const email = control.value;
    return new Promise((resolve, reject) => {
      this.authService.checkEmailAvailability(email).subscribe({
        next: (response: any) => {
          if (response.status === 200 && response.message === 'Email Taken') {
            resolve(null); // Email is taken, thus valid
          } else {
            resolve({ emailNotFound: true }); // Email not found, thus invalid
          }
        },
        
      });
    });
  }

  //First part of the reset password process.
  //User enters their email address and clicks submit.
  onSubmitRequest() {
    if (this.requestResetForm.valid) {
      const email = this.requestResetForm.get('email').value;
      //Sends request to backend to send a forgot password email to the user's email address.
      this.authService.forgetPasswordFirst(email).subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            this.isRequestForgot = true;
            this.isChangePassword = true;
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Email not found',
              text: 'Please enter a valid email',
            });
          }
        },
      });
    }
  }


  //Custom validator used to check if both password fields matches.
  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword').value;
    const confirmPassword = formGroup.get('confirmPassword').value;

    //check if both oldpassword and new password matches
    if (newPassword === confirmPassword) {
      return null;
    } else {
      formGroup.get('confirmPassword').setErrors({ passwordMismatch: true });
      return { passwordMismatch: true }; //Password mismatch error
    }
  }

  //Second part of the reset password process.
  //User enters the verification code and new password.
  //This is the form that enables the user to change their password.
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
      validators: [this.passwordMatchValidator],
    }
  );

  //Submit Reset Password Form.
  //If form is valid then call forgetPasswordSecond() method of AuthService.
  //Users need to enter the verification code sent to their email address and also their new password.
  //If forgetPasswordSecond() method returns 200 (success) then show success message and redirect user to login page.
  onSubmitResetPassword() {
    if (this.resetPasswordForm.valid) {
      const newPassword = this.resetPasswordForm.get('newPassword').value;
      const verificationCode = this.resetPasswordForm.get('verificationCode')
        .value;
      const email = this.requestResetForm.get('email').value;
      try {
        this.authService.forgetPasswordSecond(newPassword, verificationCode, email)
        .subscribe({
          next: (response: any) => {
            if (response.status === 200) {
              Swal.fire({
                icon: 'success',
                title: 'Password changed',
                text: 'Please login with your new password',
              });
              this.router.navigate(['auth/login']);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Password change failed',
                text: 'Please try again!',
              }).then((result) => {
                if (result.isConfirmed) {
                  // Reload the current page
                  location.reload();
                }
              });
            }
          },
          error: (error) => {
            // Handle HTTP errors here
            if (error.status === 400) {
              Swal.fire({
                icon: 'error',
                title: 'Invalid Verification Code',
                text: 'Please retry the process!',
              }).then((result) => {
                if (result.isConfirmed) {
                  location.reload();
                }
              });
            } else {
              // Handle other errors
              Swal.fire({
                icon: 'error',
                title: 'Password change failed',
                text: 'Please try again!',
              }).then((result) => {
                if (result.isConfirmed) {
                  // Reload the current page
                  location.reload();
                }
              });
            }
          }
        });
      //Catches any errors that might occur.
      //If it encounters any errors then show error message and redirect user to forgot password page.
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Password change failed',
          text: 'Please try again!',
        });
        this.router.navigate(['auth/forgot']);
      }

    }
  }
}
