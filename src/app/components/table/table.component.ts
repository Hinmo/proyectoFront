import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';


@Component({
  selector: 'app-table',
  standalone: true,
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  imports: [ModalComponent, FormsModule, NgStyle],
})
export class TableComponent {
  @Input() datos: any[] = [];
  @Input() headers: string[] = [];
  @Input() columnasMapeo: { [key: string]: string } = {};
  @Input() acciones: { nombre: string, evento: string }[] = [];
  @Output() accionSeleccionada = new EventEmitter<any>();

  searchTerm: string = '';
  filteredData: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datos'] || changes['searchTerm']) {
      this.filterData();
    }
  }

  ejecutarAccion(evento: any) {
    const accion = evento.target.value;
    const index = evento.target.parentElement.parentElement.rowIndex - 1;
    const fila = this.filteredData[index];
    if (accion && fila) {
      this.accionSeleccionada.emit({ accion, fila });
    }  
    // Restablecer el valor del select a una cadena vacía
    evento.target.value = '';
  }

  isSelectElement(event: Event): boolean {
    return (event.target as HTMLElement).tagName === 'SELECT';
  }

  //Filtro-Verificamos si el campo de busqueda esta vacio
  filterData(): void {
    if (!this.searchTerm.trim()) {
      this.filteredData = [...this.datos];
      return;
    }

    //Convertimos el termino a buscar en minusculas para luego hacer el filtro.
    const searchTermLower = this.searchTerm.trim().toLowerCase();
    this.filteredData = this.datos.filter((item) => {
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          const value = item[key];
          if (
            typeof value === 'string' &&
            value.toLowerCase().includes(searchTermLower)
          ) {
            return true;
          }
        }
      }
      return false;
    });
  }
}
