import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from '../../components/table/table.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { BaseUsuariosComponent } from '../../components/base-usuarios/base-usuarios.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
  imports: [TableComponent, ReactiveFormsModule, ModalComponent, FormsModule],
})

export class UsuariosComponent extends BaseUsuariosComponent{

  override obtenerUsuarios(): void {
    this.userServ.getUsuarios().subscribe((data: any) => {
      this.usuarios = this.transformarUsuarios(data.usuarios);
    });
  }

}
