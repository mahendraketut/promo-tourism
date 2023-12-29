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
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    const decodedToken = this.tokenService.decodeToken();
    if (decodedToken) {
      console.log(decodedToken); // Log the decoded token
      this.username = decodedToken.name;
    } else {
      console.log('Token is not valid or not present');
    }
  }

  goBack(): void {
    this.location.back(); // Navigates to the previous URL in the browser's history
  }
}
