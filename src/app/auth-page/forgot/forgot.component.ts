import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

import { AbstractControl, ValidationErrors } from '@angular/forms';
import Swal from 'sweetalert2';
import { error } from 'jquery';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css'],
})
export class ForgotComponent {
  isRequestForgot: boolean;
  isChangePassword: boolean;
  logo: any;

  constructor(private authService: AuthService, private router: Router) {
    this.isRequestForgot = false;
    this.isChangePassword = false;
    this.logo = '/assets/img/logo-landscape.png';
  }
  //Request reset password area: start
  requestResetForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ], [
      // Custom asynchronous validator to handle emailTaken error
      this.checkEmailTaken.bind(this)
    ]),
  });


  checkEmailTaken(control: AbstractControl): Promise<ValidationErrors | null> {
    const email = control.value;
  
    return new Promise((resolve, reject) => {
      this.authService.checkEmailAvailability(email).subscribe({
        next: (response: any) => {
          if (response.status === 200 && response.message === 'Email Taken') {
            console.log('Email taken');
            resolve(null); // Email is taken, thus valid
          } else {
            console.log('Email not found');
            resolve({ emailNotFound: true }); // Email not found, thus invalid
          }
        },
        
      });
    });
  }
  onSubmitRequest() {

    if (this.requestResetForm.valid) {
      const email = this.requestResetForm.get('email').value;
      //send request to backend to validate the old password
      this.authService.forgetPasswordFirst(email).subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            console.log('Email found');
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
