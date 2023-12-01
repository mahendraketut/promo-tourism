import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  
//
  logo: any;

  constructor() {
    this.logo = '/assets/img/logo-landscape.png';
  }


  userLoginForm = new FormGroup({
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    userPass: new FormControl('', [
      Validators.required,
    ]),
  });


  loginValidator(formGroup: FormGroup) {
    const email = formGroup.get('userEmail').value;
    const password = formGroup.get('userPass').value;
  }


  loginClicked = false;
  onSubmit() {
    this.loginClicked = true;
    console.log("test");
    if (this.userLoginForm.valid) {
      //login validation
    }
  }
}
