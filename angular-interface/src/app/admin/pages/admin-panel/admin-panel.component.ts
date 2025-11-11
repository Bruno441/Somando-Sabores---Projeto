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
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  returnUrl: string = '/admin-panel/reservas';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Se já estiver autenticado, redireciona
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }

    // Pega a URL de retorno dos query params
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin-panel/reservas';
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos';
      return;
    }

    const loginSuccess = this.authService.login(this.username, this.password);

    if (loginSuccess) {
      // Login bem-sucedido, redireciona para a página desejada
      this.router.navigate([this.returnUrl]);
    } else {
      // Login falhou
      this.errorMessage = 'Usuário ou senha incorretos';
      this.password = ''; // Limpa a senha
    }
  }
}
