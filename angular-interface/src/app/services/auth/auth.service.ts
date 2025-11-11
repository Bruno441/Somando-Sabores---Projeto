import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  // Credenciais hardcoded para o MVP (posteriormente integrar com backend)
  private readonly ADMIN_USERNAME = 'admin';
  private readonly ADMIN_PASSWORD = 'admin123';
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private router: Router) {}

  /**
   * Realiza o login do usuário
   */
  login(username: string, password: string): boolean {
    // Validação simples (MVP)
    if (username === this.ADMIN_USERNAME && password === this.ADMIN_PASSWORD) {
      // Gera um token simples (posteriormente usar JWT do backend)
      const token = btoa(`${username}:${Date.now()}`);
      localStorage.setItem(this.TOKEN_KEY, token);
      this.isAuthenticatedSubject.next(true);
      return true;
    }
    return false;
  }

  /**
   * Realiza o logout do usuário
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/admin-panel']);
  }

  /**
   * Verifica se existe token no localStorage
   */
  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    return this.hasToken();
  }

  /**
   * Obtém o token atual
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
