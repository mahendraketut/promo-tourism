import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register-merchant',
  templateUrl: './register-merchant.component.html',
  styleUrls: ['./register-merchant.component.css'],
})
export class RegisterMerchantComponent {
  logo: any;
  cover: any;
  isPersonalData: boolean;
  isAttachment: boolean;
  isPersonalDataBtnClicked: boolean;

  constructor(private router: Router, private authService: AuthService) {
    this.logo = '/assets/img/logo-landscape.png';
    this.cover = '/assets/img/merchant.jpg';
    this.isPersonalData = true;
    this.isAttachment = false;
    this.isPersonalDataBtnClicked = false;
  }

  //function to change the form
  changeForm() {
    this.isPersonalData = !this.isPersonalData;
    this.isAttachment = !this.isAttachment;
  }

  //User data form along with its validation.
  userDataForm = new FormGroup({
    userEmail: new FormControl(
      '',
      [Validators.required, Validators.email],
      [this.checkEmailTaken.bind(this)]
    ),
    userPhone: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    userName: new FormControl('', [Validators.required]),
    userDescription: new FormControl('', [Validators.required]), // This will be used for description instead
    roles: new FormControl('merchant'), // Assuming 'merchant' is a constant value
    license: new FormControl(),
    licenseDescription: new FormControl('', [Validators.required]),
    reviews: new FormControl(),
    reviewsDescription: new FormControl('', [Validators.required]),
  });
  checkEmailTaken(control: AbstractControl): Promise<ValidationErrors | null> {
    const email = control.value;

    return new Promise((resolve, reject) => {
      this.authService.checkEmailAvailability(email).subscribe({
        next: (response: any) => {
          if (response.status === 200 && response.message === 'Email Taken') {
            console.log('Email taken');
            resolve({ emailTaken: true });
          } else {
            resolve(null);
            console.log('Email available');
          }
        },
        error: (error) => {
          console.error('Error checking email availability:', error);
          reject({ emailTaken: true });
        },
      });
    });
  }

  //check if userEmail, userPhone, userName, and userDescription is validated.
  //If yes, then return true
  //If no, then return false
  isPersonalDataSectionValidated(): boolean {
    const isValid =
      this.userDataForm.controls.userEmail.valid &&
      this.userDataForm.controls.userPhone.valid &&
      this.userDataForm.controls.userName.valid &&
      this.userDataForm.controls.userDescription.valid;

    console.log('isValid:', isValid);
    return isValid;
  }

  //check if userEmail, userPhone, userName, and userDescription is validated and isPersonalDataBtnClicked is true
  //If yes, return nothing
  //If no, return swal
  isPersonalDataSectionValidatedAndClicked() {
    if (this.isPersonalDataSectionValidated()) {
      this.changeForm();

      console.log('Form Change:' + this.changeForm);
      console.log('Validasi:' + this.isPersonalDataSectionValidated);
    } else {
      console.log('Form Change:' + this.changeForm);
      console.log('Validasi:' + this.isPersonalDataSectionValidated);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all the required fields!',
      });
    }
  }

  selectedFiles: Record<string, File> = {};

  // handleFileInput(event: Event, fieldName: string): void {
  //   console.log('file masuk: ', fieldName);
  //   const element = event.currentTarget as HTMLInputElement;
  //   let fileList: FileList | null = element.files;
  //   if (fileList) {
  //     this.selectedFiles[fieldName] = fileList[0];
  //   }
  // }

  handleFileInput(event: Event, fieldName: string): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;

    if (fileList) {
      // Set the form control value
      this.userDataForm.get(fieldName)?.setValue(fileList[0]);

      // Trigger validation update
      this.userDataForm.get(fieldName)?.updateValueAndValidity();
    }
  }

  formatFileSize(size: number): string {
    const kilobytes = size / 1024;
    if (kilobytes < 1024) {
      return kilobytes.toFixed(2) + ' KB';
    } else {
      const megabytes = kilobytes / 1024;
      return megabytes.toFixed(2) + ' MB';
    }
  }

  // Display File Name
  get licenseFileName(): string | undefined {
    return this.userDataForm.get('license')?.value?.name;
  }

  // Display File Size
  get licenseFileSize(): string | undefined {
    return this.formatFileSize(this.userDataForm.get('license')?.value?.size);
  }

  // Display File Name
  get reviewsFileName(): string | undefined {
    return this.userDataForm.get('reviews')?.value?.name;
  }

  // Display File Size
  get reviewsFileSize(): string | undefined {
    return this.formatFileSize(this.userDataForm.get('reviews')?.value?.size);
  }

  //tracks if user submitted the form.
  submittedClicked = false;

  onSubmit() {
    console.log('submit ke klik');
    this.submittedClicked = true;
    console.log('validitas form: ', this.userDataForm.valid);
    console.log('error form', this.userDataForm.errors);
    Object.keys(this.userDataForm.controls).forEach((key) => {
      const controlErrors: ValidationErrors = this.userDataForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          console.log(
            'Key control: ' + key + ', keyError: ' + keyError + ', err value: ',
            controlErrors[keyError]
          );
        });
      }
    });
    if (this.userDataForm.valid) {
      const formData = new FormData();

      // Append file inputs to the FormData object from selectedFiles
      if (this.selectedFiles['license']) {
        formData.append('license', this.selectedFiles['license']);
      }
      if (this.selectedFiles['reviews']) {
        formData.append('reviews', this.selectedFiles['reviews']);
      }

      // Append text inputs to the FormData object
      formData.append('email', this.userDataForm.get('userEmail').value);
      formData.append('roles', this.userDataForm.get('roles').value); // Make sure 'roles' has a value.
      formData.append('phoneNo', this.userDataForm.get('userPhone').value);
      formData.append(
        'description',
        this.userDataForm.get('userDescription').value
      );
      formData.append('name', this.userDataForm.get('userName').value);
      formData.append(
        'licenseDescription',
        this.userDataForm.get('licenseDescription').value
      );
      formData.append(
        'reviewsDescription',
        this.userDataForm.get('reviewsDescription').value
      );

      // Call the service to send the form data to the backend
      this.authService.registerUser(formData).subscribe({
        next: (response) => {
          // Handle the response
          console.log(response);
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Your merchant account has been registered! Please wait for approval.',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/auth/login']);
            }
          });
        },
        error: (error) => {
          // Handle the error
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: 'There was an issue with your registration. Please try again.',
            // ... other options
          });
        },
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all the required fields!',
      });
    }
  }
}
