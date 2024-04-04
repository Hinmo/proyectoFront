import { Component, OnInit } from '@angular/core';
import { TableComponent } from "../../components/table/table.component";
import { OportunidadModel } from '../../core/models/oportunidad.model';
import { OportunidadService } from '../../services/oportunidad/oportunidad.service';
import { format } from 'date-fns';
import { ModalComponent } from "../../components/modal/modal.component";
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios/usuario.service';
import { UsuarioModel } from '../../core/models/usuario.model';
import Swal from 'sweetalert2';
import { PermisosDirective } from '../../core/directives/permisos/permisos.directive';

@Component({
    selector: 'app-asignar-oportunidad',
    standalone: true,
    templateUrl: './asignar-oportunidad.component.html',
    styleUrl: './asignar-oportunidad.component.css',
    imports: [TableComponent, ModalComponent, FormsModule, PermisosDirective]
})
export class AsignarOportunidadComponent implements OnInit {
  usuarios: UsuarioModel[] = [];
  oportunidades: OportunidadModel[]=[];
  oportunidad: OportunidadModel | null = null;
  nuevoGestor: string = '';
  modalAbierto: 'modal1' | 'modal2' | null = null;

  constructor(private getOpor: OportunidadService, private userServ: UsuariosService){}

  headNames: string[] = [
    'nameOportunity',
    'descriptionOportunity',
    'stateOportunity',
    'userCreate',
    'userGestor',
    'userCliente',
    'createdAt',
    'updatedAt',
  ];

  headMap: { [key: string]: string } = {
    nameOportunity: 'Nombre',
    descriptionOportunity: 'Descripción',
    stateOportunity: 'Estado',
    userCreate: 'Creado por',
    userGestor: 'Asesor encargado',
    userCliente: 'Cliente',
    createdAt: 'F. Creacion',
    updatedAt: 'F. Modificado',
  };

  acciones: { nombre: string, evento: string }[] = [
    { nombre: 'Asignar Asesor', evento: 'asignar' },
    { nombre: 'Eliminar', evento: 'eliminar' }
  ];

  ejecutarAccion(evento: any) {
    const accion = evento.accion;
    const fila = evento.fila;  
    switch (accion) {
      case 'asignar':
        this.oportunidad = fila;
        this.abrirModal1();
        break;
      case 'eliminar':
        this.oportunidad = fila;
        this.abrirModal2();
        break;
      default:
        break;
    }
  }

  ngOnInit(): void {
    this.obtenerOportunidades();
    this.obtenerStaff();
  }

  obtenerOportunidades() {
    this.getOpor.getSinGestor().subscribe({
      next: (resp: any) => {
        if (resp.ok) {
          this.oportunidades = this.transformarOportunidades(resp.oportunidad);
        } else {
          console.error('Error al obtener las oportunidades:', resp.msg);
          Swal.fire({
            title: "Error al obtener las oportunidades",
            icon: "error"
          });
        }
      },
      error: (error) => {
        Swal.fire({
          title: "Error al obtener oportunidades",
          text: error.error.msg,
          icon: "error"
        });
      }
    });
  }

  transformarOportunidades(oportunidades: any[]): any[] {
    return oportunidades.map((oportunidad) => ({
      ...oportunidad,
      userCreate: oportunidad.userCreate.nombre || '',
      userGestor: oportunidad.userGestor ? (oportunidad.userGestor.nombre || '') : 'Sin gestor',
      userCliente: oportunidad.userCliente.nombre || '',
      createdAt: oportunidad.createdAt ? this.formatDate(oportunidad.createdAt.toString()) : '',
      updatedAt: oportunidad.updateAt ? this.formatDate(oportunidad.updateAt.toString()) : '',
    })).sort((a, b) => a.nameOportunity.localeCompare(b.nameOportunity));
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return format(date, 'yyyy-MM-dd HH:mm:ss');
  }

  abrirModal1(): void {
    this.modalAbierto = 'modal1';
  }
  abrirModal2(): void {
    this.modalAbierto = 'modal2';
  }
  cerrarModal(): void {
    this.modalAbierto = null;
  }

  asignarGestor(oportunidad: OportunidadModel | null, nuevoGestor: string){
    if(oportunidad && oportunidad._id){
      this.getOpor.asignarGestor(oportunidad?._id, nuevoGestor).subscribe({
        next: () => {
          this.obtenerOportunidades();
          this.cerrarModal();
        },
        error: (error) => {
          Swal.fire({
            title: "No se pudo asignar la oportunidad",
            text: error.error.msg,
            icon: "error"
          });
          },
      });
    }
  }

  obtenerStaff(): void {
    this.userServ.getUsuariosPorRol('staff').subscribe((data: any) => {
      this.usuarios = data.usuario.filter((usuario: any) => usuario.rol !== 'Supervisor');
    });
  }
  
  eliminarOportunidad(oportunidad: OportunidadModel | null): void {
    if (oportunidad?._id) {
        this.getOpor.eliminarOportunidad(oportunidad._id).subscribe({
            next: () => {
                this.obtenerOportunidades();
                this.cerrarModal();
            },
            error: (error) => {
              Swal.fire({
                title: "Error al eliminar oportunidad",
                text: error.error.msg,
                icon: "error"
              });
            },
        });
      }
  }

}
