import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})

export class RegisterComponent {
  logo: any;

  constructor(private router: Router) {
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
    userPhone: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    userName: new FormControl('', [
      Validators.required]),
    userAddress: new FormControl('', [
      Validators.required]),
    userPass: new FormControl('', [
      Validators.required,
      Validators.minLength(8),]),
    userPassConfirm: new FormControl('', [
      Validators.required]),
    agreeTOS: new FormControl('', [
      Validators.requiredTrue]),
    }, {
      validators: this.passwordMatchValidator,
    });

    //tracks if user submitted the form.
    submittedClicked = false;
    //function to submit the form.
    onSubmit() {
      this.submittedClicked = true;
      if(this.userDataForm.get('agreeTOS').value){
        if (this.userDataForm.valid) {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Information submitted',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/']);
            }
          });
        }
      }
    }

}
