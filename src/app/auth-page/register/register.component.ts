import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../../models/user.model';
import Swal from 'sweetalert2';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  logo: any;

  constructor(private router: Router, private authService: AuthService) {
    this.logo = '/assets/img/logo-landscape.png';
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('userPass').value;
    const confirmPassword = formGroup.get('userPassConfirm').value;

    //checks if both password entered matched.
    if (password === confirmPassword) {
      return null;
    } else {
      formGroup.get('userPassConfirm').setErrors({ passwordMismatch: true });
      return { passwordMismatch: true }; // Passwords do not match
    }
  }

  //User data form along with its validation.
  userDataForm = new FormGroup(
    {
      // userEmail: new FormControl('', [Validators.required, Validators.email]),
      userEmail: new FormControl('', [
        Validators.required,
        Validators.email,
      ], [
        // Custom asynchronous validator to handle emailTaken error
        this.checkEmailTaken.bind(this)
      ]),
      userPhone: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      userName: new FormControl('', [Validators.required]),
      userAddress: new FormControl('', [Validators.required]),
      userPass: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      userPassConfirm: new FormControl('', [Validators.required]),
      agreeTOS: new FormControl('', [Validators.requiredTrue]),
    },
    {
      validators: this.passwordMatchValidator,
      
    }
  );

  // checkEmailTaken(control: AbstractControl): Promise<ValidationErrors | null> {
  //   return new Promise((resolve, reject) => {
  //     this.authService.checkEmailAvailability(control.value).subscribe({
  //       next: (response: any) => {
  //         if (response.status === 200) {
  //           console.log("Email taken");
  //           resolve({ emailTaken: true });
  //         } else {
  //           resolve(null);
  //           console.log("email no problem");
  //         }
  //       },
  //       error: (error) => {
  //         // console.log('Error checking email availability:', error);
  //         reject({ emailTaken: true }); // Reject the promise to indicate an error
  //       }
  //     });
  //   });
  // }



  checkEmailTaken(control: AbstractControl): Promise<ValidationErrors | null> {
    const email = control.value;
  
    return new Promise((resolve, reject) => {
      this.authService.checkEmailAvailability(email).subscribe(
        (response: any) => {
          if (response.status === 200 && response.message === 'Email Taken') {
            console.log('Email taken');
            resolve({ emailTaken: true });
          } else {
            resolve(null);
            console.log('Email available');
          }
        },
        (error) => {
          console.error('Error checking email availability:', error);
          reject({ emailTaken: true }); // Reject the promise to indicate an error
        }
      );
    });
  }

  submittedClicked = false;
  // onSubmit() {
  //   this.submittedClicked = true;
  //   if (this.userDataForm.get('agreeTOS').value) {
  //     if (this.userDataForm.valid) {
  //       const userData = new User(
  //         this.userDataForm.value.userName,
  //         this.userDataForm.value.userEmail,
  //         this.userDataForm.value.userPass,
  //         'user',
  //         this.userDataForm.value.userPhone,
  //         this.userDataForm.value.userAddress
  //       );
  //       userData.roles = 'user';
  //       console.log('User data:', userData);
  //       this.authService.registerUser(userData).subscribe({
  //         next: (response) => {
  //           console.log('User registered successfully!', response);
  //           Swal.fire({
  //             icon: 'success',
  //             title: 'Success!',
  //             text: 'Yeay, your account is registered!',
  //             confirmButtonText: 'OK',
  //             iconColor: '#4F46E5',
  //             color: '#4F46E5',
  //             confirmButtonColor: '#4F46E5',
  //           }).then((result) => {
  //             if (result.isConfirmed) {
  //               this.router.navigate(['/']);
  //             }
  //           });
  //         },
  //         error: () => {
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Oops...',
  //             text: 'Something went wrong!',
  //             confirmButtonText: 'OK',
  //             iconColor: '#4F46E5',
  //             color: '#4F46E5',
  //             confirmButtonColor: '#4F46E5',
  //           });
  //         }
  //       });
  //     }
  //   }
  // }



  onSubmit() {
    this.submittedClicked = true;
    if (this.userDataForm.get('agreeTOS').value) {
      if (this.userDataForm.valid) {
        const userData = {
          name: this.userDataForm.value.userName,
          email: this.userDataForm.value.userEmail,
          password: this.userDataForm.value.userPass,
          roles: 'user',
          phoneNo: this.userDataForm.value.userPhone,
          address: this.userDataForm.value.userAddress, 
        };
        userData.roles = 'user';
        console.log('User data:', userData);
        this.authService.registerUser(userData).subscribe({
          next: (response) => {
            console.log('User registered successfully!', response);
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Yeay, your account is registered!',
              confirmButtonText: 'OK',
              iconColor: '#4F46E5',
              color: '#4F46E5',
              confirmButtonColor: '#4F46E5',
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/']);
              }
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
              confirmButtonText: 'OK',
              iconColor: '#4F46E5',
              color: '#4F46E5',
              confirmButtonColor: '#4F46E5',
            });
          }
        });
      }
    }
  }
  

}

