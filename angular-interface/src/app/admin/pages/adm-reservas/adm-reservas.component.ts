import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material Modules
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

// Componentes
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { FilterResultsComponent } from '../../components/filter-results/filter-results.component';
import { RegistroReservaV2Component } from '../../components/registro-reserva-v2/registro-reserva-v2.component';

// Services e Models
import { ReservaService } from '../../../services/reservas/reserva.service';
import { Reserva } from '../../../models/ReservaModel';
import { ServiceResponse } from '../../../models/ServiceResponseModel';

@Component({
  selector: 'app-adm-reservas',
  standalone: true,
  imports: [
    CommonModule,
    SideBarComponent,
    FilterResultsComponent,
    RegistroReservaV2Component,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './adm-reservas.component.html',
  styleUrl: './adm-reservas.component.scss'
})
export class AdmReservasComponent implements OnInit {
  reservas: Reserva[] = [];
  reservasFiltradas: Reserva[] = [];
  isLoading: boolean = false;
  
  reservaParaExcluirId: string | null = null;
  mostrarConfirmacaoExclusao: boolean = false;

  constructor(private reservaService: ReservaService) { }

  ngOnInit(): void {
    this.carregarReservas();
  }

  carregarReservas(): void {
    this.isLoading = true;
    this.reservaService.getAll().subscribe({
      next: (response: ServiceResponse<Reserva[]>) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.reservas = response.data;
          this.reservasFiltradas = [...this.reservas];
        } else {
          console.error(`Erro na resposta da API: ${response.message}`);
          this.reservas = [];
          this.reservasFiltradas = [];
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`Erro ao carregar reservas:`, err);
        this.reservas = [];
        this.reservasFiltradas = [];
      }
    });
  }

  aplicarFiltro(filtro: { nome: string; data: string | null }) {
    if (!filtro.nome && !filtro.data) {
      this.reservasFiltradas = this.reservas;
      return;
    }

    const termoNome = filtro.nome.toLowerCase();
    const termoData = filtro.data;

    this.reservasFiltradas = this.reservas.filter(reserva => {
      const matchNome = !termoNome || (reserva.nome && reserva.nome.toLowerCase().includes(termoNome));
      const matchData = !termoData || (reserva.dataReserva && reserva.dataReserva.includes(termoData));
      return matchNome && matchData;
    });
  }

  trackByReservaId(index: number, reserva: Reserva): string {
    return reserva.id ?? index.toString();
  }

  // --- Lógica de Atualização e Exclusão (Mantida) ---

  onReservaAtualizada(reservaAtualizada: Reserva): void {
    this.isLoading = true;
    this.reservaService.update(reservaAtualizada).subscribe({
      next: (response) => {
        if (response.success) {
          this.carregarReservas();
        } else {
          this.isLoading = false;
          alert(`Erro ao atualizar: ${response.message}`);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onSolicitarExclusao(id: string): void {
    this.reservaParaExcluirId = id;
    this.mostrarConfirmacaoExclusao = true;
  }

  confirmarExclusao(): void {
    if (!this.reservaParaExcluirId) return;
    this.isLoading = true;
    this.reservaService.delete(this.reservaParaExcluirId).subscribe({
      next: () => {
        this.carregarReservas();
        this.fecharConfirmacao();
      },
      error: (err) => {
        this.isLoading = false;
        this.fecharConfirmacao();
        console.error(err);
      }
    });
  }

  fecharConfirmacao(): void {
    this.reservaParaExcluirId = null;
    this.mostrarConfirmacaoExclusao = false;
  }

  exportarRelatorio(): void {
    if (this.reservasFiltradas.length === 0) {
      alert("Sem dados para exportar.");
      return;
    }
    const linhas = this.reservasFiltradas.map(r => [
      `"${r.nome}"`,
      r.dataReserva,
      r.quantidade,
      `"${r.nomesConvidados?.join('; ') || ''}"`
    ].join(','));
    
    linhas.unshift('Responsável,Data,Quantidade,Convidados');
    const csvContent = '\uFEFF' + linhas.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reservas_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }
}