import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';
  isError: boolean = false;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit(): Promise<void> {
    this.message = '';
    this.isError = false;
    this.isLoading = true;

    if (!this.email) {
      this.message = 'Por favor, informe seu e-mail.';
      this.isError = true;
      this.isLoading = false;
      return;
    }

    try {
      await this.authService.recoverPassword(this.email);
      this.message = 'E-mail de recuperação enviado! Verifique sua caixa de entrada.';
      this.isError = false;
      this.email = ''; // Limpar campo
    } catch (error: any) {
      console.error(error);
      this.isError = true;
      if (error.code === 'auth/user-not-found') {
        this.message = 'E-mail não encontrado.';
      } else if (error.code === 'auth/invalid-email') {
        this.message = 'E-mail inválido.';
      } else {
        this.message = 'Erro ao enviar e-mail. Tente novamente.';
      }
    } finally {
      this.isLoading = false;
    }
  }
}
