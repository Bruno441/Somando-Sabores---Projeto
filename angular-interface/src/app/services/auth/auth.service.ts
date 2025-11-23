import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Auth, signInWithEmailAndPassword, signOut, authState, User, sendPasswordResetEmail } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  private userSubject = new BehaviorSubject<User | null>(null);

  constructor(
    private router: Router,
    private auth: Auth
  ) {
    // Monitora o estado da autenticação do Firebase
    authState(this.auth).subscribe((user: User | null) => {
      this.userSubject.next(user);
      this.isAuthenticatedSubject.next(!!user);
    });
  }

  /**
   * Realiza o login do usuário via Firebase
   */
  async login(username: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, username, password);
      // O authState vai atualizar automaticamente o isAuthenticatedSubject
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  /**
   * Envia um e-mail de redefinição de senha
   */
  async recoverPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      console.error('Erro ao enviar email de recuperação:', error);
      throw error;
    }
  }

  /**
   * Realiza o logout do usuário via Firebase
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/admin-panel']);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  }

  /**
   * Verifica se o usuário está autenticado (baseado no último valor emitido)
   * Para uso síncrono em Guards (embora Guards devam preferir Observables)
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Obtém o usuário atual
   */
  getUser(): User | null {
    return this.userSubject.value;
  }
}
