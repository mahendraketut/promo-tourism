import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  
//
  logo: any;

  constructor(private router: Router, private authService: AuthService) {
    this.logo = '/assets/img/logo-landscape.png';
  }


  userLoginForm = new FormGroup({
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    userPass: new FormControl('', [
      Validators.required,
    ]),
  });




  loginClicked = false;
  // onSubmit() {
  //   this.loginClicked = true;

  //   console.log("test");
  //   if (this.userLoginForm.valid) {
  //     const email = this.userLoginForm.get('userEmail').value;
  //     const password = this.userLoginForm.get('userPass').value;
  //     this.authService.loginUser({ email, password }).subscribe(
  //       (res) => {
  //         console.log(res);
  //         if (res.status === 200) {
  //           localStorage.setItem('token', res.token);
  //           this.router.navigate(['/dashboard']);
  //         } else {
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Oops...',
  //             text: res.message,
  //           });
  //         }
  //       },
  //       (err) => {
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Oops...',
  //           text: err,
  //         });
  //       }
  //     );

  //   }
  // }



  // onSubmit() {
  //   this.loginClicked = true;
  //   console.log("kena click");
  //   if (this.userLoginForm.valid) {
  //     const email = this.userLoginForm.get('userEmail').value;
  //     const password = this.userLoginForm.get('userPass').value;
  
  //     this.authService.loginUser(email, password).subscribe({
  //       next: (res) => {
  //         console.log("WEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
  //         console.log("response atas: ",res);
  //         if (res.status === 200) {
  //           localStorage.setItem('token', res.token);
  //           this.router.navigate(['/dashboard']);
  //         } 
  //         else{
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Oops...',
  //             text: 'Unexpected error!',
  //           });
  //         }
  //       },
  //       error: (err) => {
  //         console.log("error bawah: ",err);
  //         if(err.status === 401){
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Oops...',
  //             text: 'Wrong email or password!',
  //           });
  //         }
  //         else if(err.status === 402)){
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Oops...',
  //             text: 'Account is not activated yet!',
  //           });
  //         }
  //       }
  // });
  //   }
  // }



  onSubmit() {
    this.loginClicked = true;
    console.log("kena click");
    if (this.userLoginForm.valid) {
      const email = this.userLoginForm.get('userEmail').value;
      const password = this.userLoginForm.get('userPass').value;
  
      this.authService.loginUser(email, password).subscribe({
        next: (res) => {
          console.log("response atas: ", res);
          if (res.status === 200) {
            localStorage.setItem('token', res.token);
            this.router.navigate(['/']);
            console.log("MASUK BRO");

          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Unexpected error!',
            });
          }
        },
        error: (err) => {
          console.log("error bawah: ", err);
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
          }
          else if (err.status === 402) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Wrong password!',
            });
          }
          else if(err.status === 200){
            Swal.fire({
              icon: 'success',
              title: 'NICE',
              text: 'MASUK BRO!',
            });
          }
        }
      });
    }
  }
}
