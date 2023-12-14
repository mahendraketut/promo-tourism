import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/token.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidenav-merchant',
  templateUrl: './sidenav-merchant.component.html',
  styleUrls: ['./sidenav-merchant.component.css'],
})
export class SidenavMerchantComponent {
  logo: any;
  name: string;
  email: string;
  role: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService
  ) {
    this.logo = 'assets/images/logo.png';
    this.name = this.tokenService.decodeToken().name;
    this.email = this.tokenService.decodeToken().email;
    this.role = this.tokenService.decodeToken().roles;
  }
  sidenavOpen: boolean = true;

  toggleSidenav() {
    this.sidenavOpen = !this.sidenavOpen;
  }

  onInit() {}

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
