import { Component } from '@angular/core';
import { BaseUsuariosComponent } from '../../components/base-usuarios/base-usuarios.component';
import { TableComponent } from "../../components/table/table.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermisosDirective } from '../../core/directives/permisos/permisos.directive';

@Component({
    selector: 'app-staff',
    standalone: true,
    templateUrl: './staff.component.html',
    styleUrl: './staff.component.css',
    imports: [TableComponent, ModalComponent, FormsModule, ReactiveFormsModule, PermisosDirective]
})

export class StaffComponent extends BaseUsuariosComponent {

  override obtenerUsuarios(): void {
    this.userServ.getUsuariosPorRol('staff').subscribe((data: any) => {
      this.usuarios = this.transformarUsuarios(data.usuario);
    });
  }

}
