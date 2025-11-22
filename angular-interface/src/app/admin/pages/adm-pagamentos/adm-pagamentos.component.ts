import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { CommonModule } from '@angular/common';
import { RegistroPagamentoComponent } from '../../components/registro-pagamento/registro-pagamento.component';
import { FilterResultsComponent } from '../../components/filter-results/filter-results.component';
import { Component, OnInit } from '@angular/core';
import { ServiceResponse } from '../../../models/ServiceResponseModel';
import { Pagamento } from '../../../models/PagamentoModel';
// Import ReservaService to filter paid reservations
import { ReservaService } from '../../../services/reservas/reserva.service';
import { Reserva } from '../../../models/ReservaModel';

@Component({
  selector: 'app-adm-pagamentos',
  imports: [SideBarComponent, RegistroPagamentoComponent, FilterResultsComponent, CommonModule],
  templateUrl: './adm-pagamentos.component.html',
  styleUrl: './adm-pagamentos.component.scss'
})

export class AdmPagamentosComponent implements OnInit{
  pagamentos: Pagamento[] = [];
  isLoading: boolean = false;

  constructor(private reservaService: ReservaService) {}

  ngOnInit(): void {
    this.carregarPagamentos();
  }

  carregarPagamentos(): void {
    this.isLoading = true;

    // Using ReservaService to fetch all reservations and filter for "Paid" status (1)
    // Then mapping them to Pagamento model for display
    this.reservaService.getAll().subscribe(
      (response: ServiceResponse<Reserva[]>) => {
        this.isLoading = false;
        if (response.success && response.data){
          // 1. Filter for status === 1 (Paid)
          const reservasPagas = response.data.filter(r => r.status === 1);

          // 2. Map to Pagamento structure
          this.pagamentos = reservasPagas.map(r => ({
            id: r.id,
            // Use dataReserva or infer update time. Since backend doesn't give payment date in ReservaDTO,
            // we use dataReserva as the best available proxy or display blank/today if needed.
            // Ideally backend should provide this.
            dataPagamento: r.dataReserva,
            nome: r.nome,
            valorTotal: r.total
          }));

          // 3. Sort by most recent (assuming recent DataReserva implies recent activity,
          // or sorting by ID if that correlates with time, but DataReserva is safer)
          this.pagamentos.sort((a, b) => {
             const dataA = new Date(a.dataPagamento).getTime();
             const dataB = new Date(b.dataPagamento).getTime();
             return dataB - dataA;
          });

          this.pagamentosFiltrados = this.pagamentos;
        } else {
          console.error(`Erro na resposta da API: ${response.message}`);
          this.pagamentos = [];
          this.pagamentosFiltrados = this.pagamentos;
        }
      },
      error => {
        this.isLoading = false;
        console.error(`Erro ao carregar pagamentos (reservas pagas): ${error}`)
        this.pagamentos = [];
        this.pagamentosFiltrados = this.pagamentos;
      }
    )
  }

  trackByPagamentoId(index: number, pagamento: Pagamento): string {
    return pagamento.id ?? index.toString(); 
  }

  pagamentosFiltrados: Pagamento[] = this.pagamentos;

  aplicarFiltro(filtro: { nome: string; data: string }) {
    this.pagamentosFiltrados = this.pagamentos.filter(p =>
      (!filtro.nome || p.nome?.toLowerCase().includes(filtro.nome.toLowerCase())) &&
      (!filtro.data || p.dataPagamento.includes(filtro.data))
    );
  }
}
