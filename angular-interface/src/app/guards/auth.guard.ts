import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Usa o Observable para garantir que esperamos a inicialização do Firebase
    return this.authService.isAuthenticated$.pipe(
      take(1), // Pega o valor atual e completa
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true;
        }

        // Redireciona para a página de login se não estiver autenticado
        return this.router.createUrlTree(['/admin-panel'], {
          queryParams: { returnUrl: state.url }
        });
      })
    );
  }
}
