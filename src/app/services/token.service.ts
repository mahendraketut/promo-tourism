//Token service.
//Used primarily for decoding the token and checking if it is expired.
//This can also be used to remove the token from local storage.
//And extract user ID from the token.
import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";
@Injectable({
  providedIn: 'root',
})
export class TokenService {
  //Retreives token from the browser's localstorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  //Removes token from local storage.
  removeToken(): void {
    localStorage.removeItem('token');
  }

  //Checks the token expiry, if its 5 seconds before expiring, we're good!
  checkTokenExpiry(): boolean {
    const token = this.getToken();
    if (token) {
      const decodedToken = jwtDecode(token);
      const expiryDate = decodedToken.exp;
      if (expiryDate) {
        return 1000 * expiryDate - new Date().getTime() < 5000;
      }
    }
    return true;
  }

  //Decodes the token if it exists.
  //But, checks if the token is expired first. If it is, remove it.
  //Hence, no token will be decoded.
  decodeToken(): any {
    const token = this.getToken();
    if(this.checkTokenExpiry()){
      this.removeToken();
      return null;
    }
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

  //Extracts the user ID from the token.
  getUserId(): string | null {
    const decodedToken = this.decodeToken();
    if (decodedToken) {
      return decodedToken.id;
    }
    return null;
  }

}
