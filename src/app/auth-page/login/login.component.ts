import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TokenService } from 'src/app/token.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  logo: any;
  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService
  ) {
    this.logo = '/assets/img/logo-landscape.png';
  }

  //Login form
  userLoginForm = new FormGroup({
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    userPass: new FormControl('', [Validators.required]),
  });
  //A counter to check if user has clicked the login button.
  //Useful to trigger the validation warnings.
  loginClicked = false;

  //Submit login form.
  //If form is valid then call loginUser() method of AuthService.
  //This sends the user's username and password to the backend.
  //If login is successful then save the token in local storage and--
  //--redirect user to their appropriate pages according to their role.
  onSubmit() {
    this.loginClicked = true;
    if (this.userLoginForm.valid) {
      const email = this.userLoginForm.get('userEmail').value;
      const password = this.userLoginForm.get('userPass').value;

      this.authService.loginUser(email, password).subscribe({
        next: (res) => {
          if (res.status === 200) {
            localStorage.setItem('token', res.token);
            if (this.tokenService.decodeToken().roles == 'user') {
              this.router.navigate(['/']);
            } else if (
              this.tokenService.decodeToken().roles == 'merchant' &&
              this.tokenService.decodeToken().hasResetPassword == false
            ) {
              this.router.navigate(['/auth/change_password']);
            } else if (
              this.tokenService.decodeToken().roles == 'merchant' &&
              this.tokenService.decodeToken().hasResetPassword == true
            ) {
              this.router.navigate(['/merchant']);
            } else if (this.tokenService.decodeToken().roles == 'officer') {
              this.router.navigate(['/officer']);
            } else {
              this.router.navigate(['/']);
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Unexpected error!',
            });
          }
        },
        error: (err) => {
          if (err.status === 400) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Email not found!',
            });
          } else if (err.status === 401) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Account is not activated yet!',
            });
          } else if (err.status === 402) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Wrong password!',
            });
          } else if (err.status === 200) {
            Swal.fire({
              icon: 'success',
              title: 'NICE',
              text: 'Welcome!',
            });
          }
        },
      });
    }
  }
}
