import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiURL + 'users/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthefied = false;
  private tokenTimer: any;
  private userId: string;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthefied;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
// tslint:disable-next-line: object-literal-shorthand
    const authData: AuthData = {email: email, password: password};
    this.http.post(BACKEND_URL + 'hsignup', authData)
      .subscribe((respaanse) => {
        this.router.navigate(['/']);
      }, (error) => {
        this.authStatusListener.next(false);
      });
  }

  login(email: string, password: string) {
// tslint:disable-next-line: object-literal-shorthand
    const authData: AuthData = {email: email, password: password};
    this.http.post< {token: string, expiresIn: number, userId: string} >(BACKEND_URL + 'login', authData)
      .subscribe(res => {
        const token = res.token;
        this.token = token;
        console.log(this.token);
        if (token) {
          const tokenExpiry = res.expiresIn;
          this.setAuthTimer(tokenExpiry);
          this.isAuthefied = true;
          this.userId = res.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + tokenExpiry * 3600);
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  autoAuthUser() {
    const info = this.getAuthData();
    if (!info) {
      return;
    }
    const now  = new Date();
    const isInFuture = info.expirationDate.getTime() - now.getTime();
    if (isInFuture > 0) {
      this.token = info.token;
      this.isAuthefied = true;
      this.userId = info.userId;
      this.setAuthTimer(isInFuture / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthefied = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expDate.toISOString());
    localStorage.setItem('userId', userId)
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
// tslint:disable-next-line: object-literal-shorthand
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }

  getUserId() {
    return this.userId;
  }
}
