import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";
@Injectable({
  providedIn: 'root',
})
export class TokenService {
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  decodeToken(): any {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }
}
