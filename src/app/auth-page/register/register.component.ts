import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})

export class RegisterComponent {
  logo: any;

  constructor() {
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
  userDataForm = new FormGroup({
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    userPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    userPhone: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    userName: new FormControl('', [
      Validators.required]),
    userAddress: new FormControl('', [
      Validators.required]),
    userPass: new FormControl('', [
      Validators.required]),
    userPassConfirm: new FormControl('', [
      Validators.required]),
    }, {
      validators: this.passwordMatchValidator,
    });

    //display error if nothing submitted


    submittedClicked = false;
    onSubmit() {
      this.submittedClicked = true;
      if (this.userDataForm.valid) {
        alert('Information submitted');
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Information submitted',
          confirmButtonText: 'OK',
        });
      }
    }

}
