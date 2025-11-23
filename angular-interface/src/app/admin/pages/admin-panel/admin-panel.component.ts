import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon, 
    MatInputModule, 
    MatFormFieldModule, 
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent implements OnInit {
  username: string = ''; // Agora usado para e-mail
  password: string = '';
  errorMessage: string = '';
  returnUrl: string = '/admin-panel/reservas';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Se já estiver autenticado, redireciona
    // Monitoramos o observable para garantir que o estado esteja carregado
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.router.navigate([this.returnUrl]);
      }
    });

    // Pega a URL de retorno dos query params
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin-panel/reservas';
  }

  async onSubmit(): Promise<void> {
    this.errorMessage = '';
    this.isLoading = true;

    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos';
      this.isLoading = false;
      return;
    }

    try {
      await this.authService.login(this.username, this.password);
      // Login bem-sucedido, o redirecionamento ocorre no authService ou no subscribe do ngOnInit
      this.router.navigate([this.returnUrl]);
    } catch (error: any) {
      // Login falhou
      console.error(error);
      this.isLoading = false;

      if (error.code === 'auth/invalid-email') {
        this.errorMessage = 'E-mail inválido.';
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        this.errorMessage = 'Usuário ou senha incorretos.';
      } else if (error.code === 'auth/too-many-requests') {
        this.errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
      } else {
        this.errorMessage = 'Erro ao realizar login. Tente novamente.';
      }

      this.password = ''; // Limpa a senha
    }
  }
}
