import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../features/auth/services/auth.service'; // Asegúrate de importar tu AuthService

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Usa el método correcto del AuthService
    if (this.authService.isAuthenticated()) {
      return true; // Permitir acceso si está autenticado
    } else {
      // Redirigir a la página de autenticación si no está autenticado
      this.router.navigate(['/auth']);
      return false;
    }
  }

}
