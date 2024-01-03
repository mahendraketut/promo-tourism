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
    licenseDescription: new FormControl('', [Validators.required]),
    reviewsDescription: new FormControl('', [Validators.required]),
  });

  //Custom validator to check if email is taken
  checkEmailTaken(control: AbstractControl): Promise<ValidationErrors | null> {
    const email = control.value;
    return new Promise((resolve, reject) => {
      this.authService.checkEmailAvailability(email).subscribe({
        next: (response: any) => {
          if (response.status === 200 && response.message === 'Email Taken') {
            resolve({ emailTaken: true });
          } else {
            resolve(null);
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
    return isValid;
  }

  //check if userEmail, userPhone, userName, and userDescription is validated and isPersonalDataBtnClicked is true
  //If yes, return nothing
  //If no, return swal
  isPersonalDataSectionValidatedAndClicked() {
    if (this.isPersonalDataSectionValidated()) {
      this.changeForm();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all the required fields!',
      });
    }
  }

  selectedFiles: Record<string, File> = {};
  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  //Handles file input, both from drag and drop and from file input change event
  handleFileInput(event: Event, fieldName: string): void {
    if (event instanceof DragEvent) {
      //handle drag and drop event
      event.preventDefault();
      const files = event.dataTransfer?.files;

      if (files && files.length > 0) {
        this.selectedFiles[fieldName] = files[0];
      }
    } else if (event instanceof Event) {
      //handle file input change event
      const element = event.currentTarget as HTMLInputElement;
      const fileList: FileList | null = element.files;

      if (fileList && fileList.length > 0) {
        this.selectedFiles[fieldName] = fileList[0];
      }
    }
  }

  //Handles file size conversion from bytes to KB or MB
  handleFileSizeConverter(fileSizeInBytes: number): string {
    let fileSizeInMB = fileSizeInBytes / (1024 * 1024);
    if (fileSizeInMB < 1) {
      return (fileSizeInBytes / 1024).toFixed(2) + ' KB';
    } else {
      return fileSizeInMB.toFixed(2) + ' MB';
    }
  }

  //tracks if user submitted the form.
  submittedClicked = false;
//On submit, check if form is valid.
  onSubmit() {
    this.submittedClicked = true;
    //Check if there are any errors in the form.
    Object.keys(this.userDataForm.controls).forEach((key) => {
      const controlErrors: ValidationErrors = this.userDataForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          console.error(keyError, controlErrors[keyError]);
        });
      }
    });
    //Ensure that the form is valid.
    if (this.userDataForm.valid) {
      const formData = new FormData();
      if (this.selectedFiles['license']) {
        formData.append('license', this.selectedFiles['license']);
      }
      if (this.selectedFiles['reviews']) {
        formData.append('reviews', this.selectedFiles['reviews']);
      }
      //Append data from the form to the FormData object
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

      //Send the form data to the backend.
      this.authService.registerUser(formData).subscribe({
        next: () => {
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
        //If there is an error, display an error message.
        error: (error) => {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: 'There was an issue with your registration. Please try again.',
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
