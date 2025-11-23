import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { CommonModule } from '@angular/common';
import { RegistroPagamentoComponent } from '../../components/registro-pagamento/registro-pagamento.component';
import { Component, OnInit } from '@angular/core';
import { ServiceResponse } from '../../../models/ServiceResponseModel';
import { Pagamento } from '../../../models/PagamentoModel';
import { PagamentosService } from '../../../services/pagamentos/pagamentos.service';

@Component({
  selector: 'app-adm-pagamentos',
  imports: [SideBarComponent, RegistroPagamentoComponent, CommonModule],
  templateUrl: './adm-pagamentos.component.html',
  styleUrl: './adm-pagamentos.component.scss'
})

export class AdmPagamentosComponent implements OnInit{
  pagamentos: Pagamento[] = [];
  isLoading: boolean = false;

  constructor(private pagamentoService: PagamentosService) {}

  ngOnInit(): void {
    this.carregarPagamentos();
  }

  carregarPagamentos(): void {
    this.isLoading = true;

    this.pagamentoService.getAll().subscribe(
      (response: ServiceResponse<Pagamento[]>) => {
        this.isLoading = false;
        if (response.success && response.data){
          this.pagamentos = response.data;

          // Sort by most recent dataPagamento
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
