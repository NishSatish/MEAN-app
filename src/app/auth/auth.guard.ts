import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private aS: AuthService, private router: Router) {}
// tslint:disable-next-line: max-line-length
  canActivate(route: import ('@angular/router').ActivatedRouteSnapshot, state: import ('@angular/router').RouterStateSnapshot): boolean | import ('@angular/router').UrlTree | import ('rxjs').Observable<boolean | import ('@angular/router').UrlTree> | Promise<boolean | import ('@angular/router').UrlTree> {
    const isAuth = this.aS.getIsAuth();
    if (!isAuth) {
      this.router.navigate(['/login']);
    }
    return isAuth;
  }
}
