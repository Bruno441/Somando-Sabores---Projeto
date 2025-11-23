import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { CommonModule } from '@angular/common';
import { RegistroPagamentoComponent } from '../../components/registro-pagamento/registro-pagamento.component';
import { Component, OnInit } from '@angular/core';
import { ServiceResponse } from '../../../models/ServiceResponseModel';
import { Pagamento } from '../../../models/PagamentoModel';
import { ReservaService } from '../../../services/reservas/reserva.service';
import { Reserva } from '../../../models/ReservaModel';

@Component({
  selector: 'app-adm-pagamentos',
  imports: [SideBarComponent, RegistroPagamentoComponent, CommonModule],
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

    // Buscamos todas as reservas e filtramos apenas as pagas (status === 1)
    // Usamos a data da reserva como referência de data de pagamento conforme solicitado
    this.reservaService.getAll().subscribe(
      (response: ServiceResponse<Reserva[]>) => {
        this.isLoading = false;
        if (response.success && response.data){
          // 1. Filtrar reservas pagas
          const reservasPagas = response.data.filter(r => r.status === 1);

          // 2. Mapear para o modelo de visualização de Pagamento
          this.pagamentos = reservasPagas.map(r => ({
            id: r.id,
            nome: r.nome,
            valorTotal: r.total,
            dataPagamento: r.dataReserva // Usando DataReserva como proxy
          }));

          // 3. Ordenar por data (mais recente primeiro)
          this.pagamentos.sort((a, b) => {
             const dataA = new Date(a.dataPagamento).getTime();
             const dataB = new Date(b.dataPagamento).getTime();
             return dataB - dataA;
          });

        } else {
          console.error(`Erro na resposta da API: ${response.message}`);
          this.pagamentos = [];
        }
      },
      error => {
        this.isLoading = false;
        console.error(`Erro ao carregar pagamentos: ${error}`)
        this.pagamentos = [];
      }
    )
  }

  trackByPagamentoId(index: number, pagamento: Pagamento): string {
    return pagamento.id ?? index.toString(); 
  }
}
