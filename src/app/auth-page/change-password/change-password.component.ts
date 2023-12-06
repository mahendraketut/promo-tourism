import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordService } from 'src/app/services/password.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent {
  logo: any;

  constructor(
    private passwordService: PasswordService,
    private router: Router,
    private location: Location //inject the location using angular commons
  ) {
    this.logo = '/assets/img/logo-landscape.png';
  }

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

  changePasswordForm = new FormGroup(
    {
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    {
      validators: this.passwordMatchValidator,
    }
  );

  // changePasswordValidator(formGroup: FormGroup) {
  //   const oldPassword = formGroup.get('oldPassword').value;
  //   const newPassword = formGroup.get('newPassword').value;
  //   const confirmPassword = formGroup.get('confirmPassword').value;

  //   if (newPassword !== confirmPassword) {
  //     formGroup.get('confirmPassword').setErrors({ mismatch: true });
  //   } else {
  //     formGroup.get('confirmPassword').setErrors(null);
  //   }
  //   // if (newPassword !== confirmPassword) {
  //   //   const matchNewPassword = true;
  //   // } else {
  //   //   const matchNewPassword = false;
  //   // }
  // }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      const oldPassword = this.changePasswordForm.get('oldPassword').value;
      const newPassword = this.changePasswordForm.get('newPassword').value;

      //send request to backend to validate the old password
      //if old password is valid, then change the password
      //else, show error message
      this.passwordService.changePassword(oldPassword, newPassword).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Password changed successfully',
            timer: 3000,
            showConfirmButton: true,
          }).then(() => {
            this.location.back(); // Redirect to the previous page
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to change password, Please check your current password again!',
            timer: 3000,
            showConfirmButton: false,
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill all the fields',
        timer: 3000,
        showConfirmButton: false,
      });
    }
  }
}

// TODO Hendry tolong nanti di email change password nya kasi redirect ke link changePass
// localhost:4200/auth/change_password
