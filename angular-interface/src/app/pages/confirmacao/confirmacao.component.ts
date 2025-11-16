import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderBarComponent } from '../../components/header-bar/header-bar.component';

@Component({
  selector: 'app-confirmacao',
  standalone: true,
  imports: [HeaderBarComponent],
  templateUrl: './confirmacao.component.html',
  styleUrls: ['./confirmacao.component.scss']
})
export class ConfirmacaoComponent {

  constructor(private router: Router) {}

  voltarParaHome(): void {
    this.router.navigate(['/']);
  }

  fazerNovaReserva(): void {
    this.router.navigate(['/reservas']);
  }

}
 