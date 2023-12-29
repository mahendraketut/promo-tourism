import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LandingPageComponent } from 'src/app/landing-page/landing-page.component';

@Component({
  selector: 'app-navbar-merchant',
  templateUrl: './navbar-merchant.component.html',
  styleUrls: ['./navbar-merchant.component.css'],
})
export class NavbarMerchantComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService
  ) {}
  dropdownOpen: boolean = false;
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  onLogout() {
    try {
      this.authService.logoutUser();
      this.router.navigateByUrl('/');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Unexpected error!',
      });
    }
  }
}
