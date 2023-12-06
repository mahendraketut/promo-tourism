import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../../models/user.model';
import Swal from 'sweetalert2';

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
      userEmail: new FormControl('', [Validators.required, Validators.email]),
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

  
  // checkAvailability() {
  //   this.authService.checkEmailAvailability(this.userDataForm.get('userEmail').value).subscribe({
  //     next: (response) => {
  //       if(response.status == 400){
  //         console.log('email is taken!');
  //       }
  //       else if(response.status == 200){
  //         console.log('email is available!');
  //       }
  //       else{
  //         console.log('Something went wrong!');
  //       }
  //     },
  //     error: () => {
  //       console.log('Email is not available!');
  //     }
  //   });
  // }
  emailAvailable = false;
  checkAvailability() {
    this.authService.checkEmailAvailability(this.userDataForm.get('userEmail').value).subscribe(
      (response: any) => {
        if (response.status === 400) {
          this.emailAvailable = false;
          // You can add visual feedback or disable the registration button here
          // For instance, set a flag to disable registration if email is taken
        } else if (response.status === 200) {
          this.emailAvailable = true;
          // Email is available, user can proceed with registration
        } else {
          console.log('Something went wrong!');
          // Handle unexpected status code, if needed
        }
      },
      (error) => {
        console.log('Error checking email availability:', error);
        // Handle error appropriately, e.g., show an error message to the user
      }
    );
  }

  submittedClicked = false;
  onSubmit() {
    this.submittedClicked = true;
    if (this.userDataForm.get('agreeTOS').value) {
      if (this.userDataForm.valid) {
        const userData = new User(
          this.userDataForm.value.userName,
          this.userDataForm.value.userEmail,
          this.userDataForm.value.userPass,
          'user',
          this.userDataForm.value.userPhone,
          this.userDataForm.value.userAddress
        );
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

