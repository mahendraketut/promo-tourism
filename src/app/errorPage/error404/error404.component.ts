import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.css'],
})
export class Error404Component {
  username: string;

  constructor(
    private location: Location,
    private authService: AuthService,
    private tokenService: TokenService
  ) {}
  ngOnInit() {
   //Decode token on init to get the user's name.
   const decodedToken = this.tokenService.decodeToken();
   if (decodedToken) {
     this.username = decodedToken.name;
   } else {
     console.error('Error decoding token');
   }
  }
  //Function to go to previous page
  goBack(): void {
    this.location.back(); 
  }
}
