import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

// Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';

// RxJS
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'app-filter-results',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './filter-results.component.html',
  styleUrl: './filter-results.component.scss'
})
export class FilterResultsComponent implements OnInit, OnDestroy {
  @Output() filtroChange = new EventEmitter<{ nome: string; data: string | null }>();

  filterForm = new FormGroup({
    nome: new FormControl(''),
    data: new FormControl<Date | null>(null)
  });

  private sub!: Subscription;

  ngOnInit() {
    // Monitora mudanças com debounce para evitar chamadas excessivas
    this.sub = this.filterForm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
      )
      .subscribe(() => {
        this.emitirFiltro();
      });
  }

  emitirFiltro() {
    const val = this.filterForm.value;
    
    let dataFormatada: string | null = null;
    if (val.data) {
      const d = new Date(val.data);
      // Ajuste de fuso horário simples para garantir a data correta
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      dataFormatada = d.toISOString().split('T')[0];
    }

    this.filtroChange.emit({
      nome: val.nome || '',
      data: dataFormatada
    });
  }

  limparFiltros() {
    this.filterForm.reset();
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}