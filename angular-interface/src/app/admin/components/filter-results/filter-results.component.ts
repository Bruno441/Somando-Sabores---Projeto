import { Component, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-filter-results',
  standalone: true,
  imports: [
    MatIconModule,
    MatExpansionModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './filter-results.component.html',
  styleUrl: './filter-results.component.scss'
})
export class FilterResultsComponent {
  nome: string = '';
  data: Date | null = null;

  @Output() filtroChange = new EventEmitter<{ nome: string; data: string }>();

  emitirFiltro() {
    let dataFormatada = '';
    if (this.data) {
      // Formata para YYYY-MM-DD para manter compatibilidade com o filtro existente
      const ano = this.data.getFullYear();
      const mes = String(this.data.getMonth() + 1).padStart(2, '0');
      const dia = String(this.data.getDate()).padStart(2, '0');
      dataFormatada = `${ano}-${mes}-${dia}`;
    }

    this.filtroChange.emit({ nome: this.nome, data: dataFormatada });
  }

  limparFiltro() {
    this.nome = '';
    this.data = null;
    this.emitirFiltro();
  }
}
