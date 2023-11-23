import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-merchant',
  templateUrl: './register-merchant.component.html',
  styleUrls: ['./register-merchant.component.css'],
})
export class RegisterMerchantComponent {
  logo: any;
  isPersonalData: boolean;
  isAttachment: boolean;

  constructor(private router: Router) {
    this.logo = '/assets/img/logo-landscape.png';
    this.isPersonalData = true;
    this.isAttachment = false;
  }

  //function to change the form
  changeForm() {
    this.isPersonalData = !this.isPersonalData;
    this.isAttachment = !this.isAttachment;
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

  //tracks if user submitted the form.
  submittedClicked = false;
  //function to submit the form.
  onSubmit() {
    this.submittedClicked = true;
    if (this.userDataForm.get('agreeTOS').value) {
      if (this.userDataForm.valid) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Yeay, your merchant account already registered! Wait until the government accept your request',
          confirmButtonText: 'OK',

          iconColor: '#4F46E5',
          color: '#4F46E5',
          confirmButtonColor: '#4F46E5',
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/auth/login']);
          }
        });
      }
    }
  }
}
