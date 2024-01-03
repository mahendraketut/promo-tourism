import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-error403',
  templateUrl: './error403.component.html',
  styleUrls: ['./error403.component.css'],
})
export class Error403Component {
  username: string;

  constructor(
    private location: Location,
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
  //Function to go back
  goBack(): void {
    this.location.back();
  }
}
