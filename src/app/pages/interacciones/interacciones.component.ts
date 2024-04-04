import { Component, ElementRef, ViewChild } from '@angular/core';
import { TableComponent } from "../../components/table/table.component";
import { format } from 'date-fns';
import { InteraccionModel } from '../../core/models/interaccion.model';
import { OportunidadService } from '../../services/oportunidad/oportunidad.service';
import Swal from 'sweetalert2';
import { ModalComponent } from "../../components/modal/modal.component";
import { FormsModule } from '@angular/forms';
import { PermisosDirective } from '../../core/directives/permisos/permisos.directive';

@Component({
    selector: 'app-interacciones',
    standalone: true,
    templateUrl: './interacciones.component.html',
    styleUrl: './interacciones.component.css',
    imports: [TableComponent, ModalComponent, FormsModule, PermisosDirective]
})
export class InteraccionesComponent {
  @ViewChild('oporEdit') form: ElementRef<HTMLFormElement>;
  interacciones: InteraccionModel[]=[];
  interaccion: InteraccionModel | null = null;
  refOportunityOriginal: string = '';
  modalAbierto: 'modal1' | 'modal2' | null = null;

  constructor(private getInter: OportunidadService){}

  headNames: string[] = [
    'userGestor',
    'refOportunity',
    'descriptionInteraction',
    'actionInteraction',
    'createdAt',
    'updatedAt',
  ];

  headMap: { [key: string]: string } = {
    userGestor: 'Asesor encargado',
    refOportunity: 'Oportunidad relacionada',
    descriptionInteraction: 'Descripción',
    actionInteraction: 'Acción',
    createdAt: 'F. Creacion',
    updatedAt: 'F. Modificado',
  };

  acciones: { nombre: string, evento: string }[] = [
    { nombre: 'Editar', evento: 'editar' },
    { nombre: 'Eliminar', evento: 'eliminar' }
  ];

  ejecutarAccion(evento: any) {
    const accion = evento.accion;
    const fila = evento.fila;  
    switch (accion) {
      case 'editar':
        this.abrirModal1();
        this.interaccion = fila;
        break;
      case 'eliminar':
        this.interaccion = fila;
        this.abrirModal2();
        break;
      default:
        break;
    }
  }

  ngOnInit(): void {
    this.obtenerInteracciones();
  }

  obtenerInteracciones() {
    this.getInter.getInteraccion().subscribe({
      next: (resp: any) => {
        if (resp.ok) {
          /* this.interacciones = resp.interacciones; */
          this.interacciones = this.transformarInteracciones(resp.interaccion);
        } else {
          console.error('Error al obtener las interacciones:', resp.msg);
          // mostrar un mensaje de error al usuario
        }
      },
      error: (error) => {
        console.error('Error al obtener las interacciones:', error);
        //mostrar un mensaje de error al usuario o tomar otras acciones según sea necesario
      }
    });
  }

  transformarInteracciones(interacciones: any[]): any[] {
    return interacciones.map((interaccion) => {
      this.refOportunityOriginal = interaccion.refOportunity;
      const transformedInteraccion = {
        ...interaccion,
        refOportunity: interaccion.refOportunity ? interaccion.refOportunity.nameOportunity : '',
        userGestor: interaccion.refOportunity && interaccion.refOportunity.userGestor ? interaccion.refOportunity.userGestor.nombre : '',
        createdAt: interaccion.createdAt ? this.formatDate(interaccion.createdAt.toString()) : '',
        updatedAt: interaccion.updateAt ? this.formatDate(interaccion.updateAt.toString()) : '',
      };
      return transformedInteraccion;
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return format(date, 'yyyy-MM-dd HH:mm:ss');
  }

  guardarCambiosInt() {
    if (this.interaccion && this.interaccion._id) {
        const cambios: any = {
            refOportunity: this.refOportunityOriginal,
            descriptionInteraction: this.interaccion.descriptionInteraction,
            actionInteraction: this.interaccion.actionInteraction
        };
        this.getInter.editarInteraccion(cambios, this.interaccion._id).subscribe({
            next: (resp: any) => {
                this.cerrarModal();
                Swal.fire({
                    title: "Interaccion guardada exitosamente",
                    text: resp.msg,
                    icon: "success"
                });
            },
            error: (error) => {
                Swal.fire({
                    title: "No se pudo editar la interaccion",
                    text: error.error.msg,
                    icon: "error"
                });
            }
        });
    } 
  }

  eliminarInteraccion(interaccion: InteraccionModel | null): void {
    if (interaccion?._id) {
        this.getInter.eliminarInteraccion(interaccion._id).subscribe({
            next: (resp: any) => {
                this.obtenerInteracciones();
                this.cerrarModal();
                Swal.fire({
                  title: "Interaccion eliminada exitosamente",
                  text: resp.msg,
                  icon: "success"
              });
            },
            error: (error) => {
              Swal.fire({
                title: "No se pudo eliminar la interaccion",
                text: error.error.msg,
                icon: "error"
              });
            },
        });
      }
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

}
