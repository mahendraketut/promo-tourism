import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuardService implements CanActivate {
  token: any;

  constructor(private router: Router, private tokenService: TokenService) {
    this.token = tokenService.decodeToken();
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    this.token = this.tokenService.decodeToken();
    const expectedRole = route.data['expectedRole'];
    const userRoles = this.token.roles; // Assuming token.roles is an array of roles

    // Check if the user has the expected role
    if (!userRoles || !userRoles.includes(expectedRole)) {
      alert(`You don't have permission to view this page.`);
      // Navigate to a default route if the user does not have the expected role
      this.router.navigate(['/error/403']);
      return false;
    }
    return true;
  }
}
