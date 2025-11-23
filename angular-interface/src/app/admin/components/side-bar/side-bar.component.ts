import { MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [MatSidenavModule, MatToolbarModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  constructor(
    private route: Router,
    private authService: AuthService
  ) { }

  mudaPagina(rota: any){
    this.route.navigate([`/${rota}`])
  }

  async logout(): Promise<void> {
    if (confirm('Deseja realmente sair?')) {
      await this.authService.logout();
    }
  }
}
