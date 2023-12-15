import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/token.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent {
  logo: any;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private location: Location,
    private authService: AuthService
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


onSubmit() {
  if (this.changePasswordForm.valid) {
    const tokenData = this.tokenService.decodeToken();
    console.log(tokenData);
    const oldPassword = this.changePasswordForm.get('oldPassword').value;
    const newPassword = this.changePasswordForm.get('newPassword').value;
    this.authService.changePassword(oldPassword, newPassword, tokenData.id).subscribe({
      next: (response) => {
        console.log(response);
        if (response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Password changed successfully, please login again!',
            timer: 3000,
            showConfirmButton: false,
          });
          this.authService.logoutUser();
          this.router.navigate(['/auth/login']);
        }
        else if(response.status === 400){
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Incorrect password!',
            timer: 3000,
            showConfirmButton: false,
          });
        }
        else if(response.status === 404){
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'User not found',
            timer: 3000,
            showConfirmButton: false,
          });
        }
      },
      error: (error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Unable to change password!',
          timer: 3000,
          showConfirmButton: false,
        });
      },
      complete: () => {
        console.log('complete');
      },
    });
  }
  else{
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

// TODO: gabisa tut-- Hendry tolong nanti di email change password nya kasi redirect ke link changePass
// localhost:4200/auth/change_password
