import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TableComponent } from "../../components/table/table.component";
import { OportunidadModel } from '../../core/models/oportunidad.model';
import { OportunidadService } from '../../services/oportunidad/oportunidad.service';
import { format } from 'date-fns';
import { InteraccionModel } from '../../core/models/interaccion.model';
import { ModalComponent } from "../../components/modal/modal.component";
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioModel } from '../../core/models/usuario.model';
import { UsuariosService } from '../../services/usuarios/usuario.service';
import { PermisosDirective } from '../../core/directives/permisos/permisos.directive';

@Component({
    selector: 'app-oportunidades',
    standalone: true,
    templateUrl: './oportunidades.component.html',
    styleUrl: './oportunidades.component.css',
    imports: [TableComponent, ModalComponent, FormsModule, PermisosDirective]
})
export class OportunidadesComponent implements OnInit {
  @ViewChild('newOpor') opor: ElementRef<HTMLFormElement>;
  @ViewChild('oporEdit') form: ElementRef<HTMLFormElement>;
  usuarios: UsuarioModel[] = [];
  oportunidades: OportunidadModel[]=[];
  oportunidad: OportunidadModel | null = null;
  nuevaOportunidad:  OportunidadModel = new OportunidadModel('', '', 'Sin gestor', '', null, '');
  interacciones: InteraccionModel[]=[];
  interaccion: InteraccionModel = { refOportunity: '', descriptionInteraction: '', actionInteraction: ''};
  nuevoEstadoOpor: string= "";
  refOportunityOriginal: string = '';
  mostrarInteracciones: boolean = false;
  editar: boolean = false;
  modalAbierto: 'modal1' | 'modal2' | 'modal3' | 'modal4' | 'modal5' | 'modal6' | null = null;

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
    { nombre: 'Editar', evento: 'editar' },
    { nombre: 'Crear interacción', evento: 'crearInteraccion' },
    { nombre: 'Consultar interacciónes', evento: 'consInteraccion' },
    { nombre: 'Cambiar estado', evento: 'cEstado' },
    { nombre: 'Eliminar', evento: 'eliminar' }
  ];

  ejecutarAccion(evento: any) {
    const accion = evento.accion;
    const fila = evento.fila;  
    switch (accion) {
      case 'editar':
        this.oportunidad = fila;
        this.abrirModal2();
        break;
      case 'crearInteraccion':
        this.oportunidad = fila;
        this.abrirModal1();
        break;
      case 'consInteraccion':
        this.oportunidad = fila;
        if (this.oportunidad?._id) {
        this.obtenerInteraccionesDeOportunidadSeleccionada(this.oportunidad._id);
        }
        break;
      case 'eliminar':
        this.oportunidad = fila;
        this.abrirModal4();
        break;
      case 'cEstado':
        this.oportunidad = fila;
        this.abrirModal3();
        break;
      default:
        break;
    }
  }

  ngOnInit(): void {
    this.obtenerUsuarios();
    this.obtenerOportunidades();
  }

  obtenerUsuarios(): void {
    this.userServ.getUsuarios().subscribe((data: any) => {
      this.usuarios = data.usuarios;
    });
  }

  obtenerOportunidades() {
    this.getOpor.getOportunidad().subscribe({
      next: (resp: any) => {
        if (resp.ok) {
          this.oportunidades = this.transformarOportunidades(resp.oportunidad);
        } else {
          console.error('Error al obtener las oportunidades:', resp.msg);
          // mostrar un mensaje de error al usuario
        }
      },
      error: (error) => {
        console.error('Error al obtener las oportunidades:', error);
        //mostrar un mensaje de error al usuario o tomar otras acciones según sea necesario
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

  eliminarOportunidad(oportunidad: OportunidadModel | null): void {
    if (oportunidad?._id) {
        this.getOpor.eliminarOportunidad(oportunidad._id).subscribe({
            next: () => {
                this.obtenerOportunidades();
                this.cerrarModal();
            },
            error: (error) => {
                console.error('Error al eliminar oportunidad:', error);
            },
        });
      }
  }

  cambiarEstadoOpor(oportunidad: OportunidadModel | null, stateOportunity: string){
    if(oportunidad && oportunidad._id){
      this.getOpor.editarEstadoOpor(oportunidad?._id, stateOportunity).subscribe({
        next: () => {
          this.obtenerOportunidades();
          this.cerrarModal();
        },
        error: (error) => {
          console.error('Error al cambiar estado a la oportunidad:', error);
          },
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return format(date, 'yyyy-MM-dd HH:mm:ss');
  }



  headNamesInt: string[] = [
    'userGestor',
    'refOportunity',
    'descriptionInteraction',
    'actionInteraction',
    'createdAt',
    'updatedAt',
  ];

  headMapInt: { [key: string]: string } = {
    userGestor: 'Asesor encargado',
    refOportunity: 'Oportunidad relacionada',
    descriptionInteraction: 'Descripción',
    actionInteraction: 'Acción',
    createdAt: 'F. Creacion',
    updatedAt: 'F. Modificado',
  };

  accionesInt: { nombre: string, evento: string }[] = [
    { nombre: 'Editar', evento: 'editarInt' },
    { nombre: 'Eliminar', evento: 'eliminarInt' }
  ];

  ejecutarAccionInt(evento: any) {
    const accion = evento.accion;
    const fila = evento.fila;  
    switch (accion) {
      case 'editarInt':
        this.interaccion = fila;
        this.abrirModal1();
        this.editar=true;
        break;
      case 'eliminarInt':
        this.interaccion = fila;
        this.abrirModal6();
        break;
      default:
        break;
    }
  }

  obtenerInteraccionesDeOportunidadSeleccionada(oportunidadId: string) {
    this.getOpor.getInteraccionOpor(oportunidadId).subscribe({
      next: (resp: any) => {
        if (resp.ok) {
            this.interacciones = this.transformarInteracciones(resp.interactions);
            this.mostrarInteracciones = true;
        } else {
          console.error('Error al obtener las interacciones:', resp.msg);
          // mostrar un mensaje de error al usuario
        }
      },
      error: (error) => {
        console.error('Error al obtener las interacciones:', error);
        // mostrar un mensaje de error al usuario o tomar otras acciones según sea necesario
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

  guardarCambiosOpor(): void {
    if (this.oportunidad && this.oportunidad._id) {
      const cambios: any = {
        nameOportunity: this.oportunidad.nameOportunity,
        descriptionOportunity: this.oportunidad.descriptionOportunity,
        stateOportunity: this.oportunidad.stateOportunity
      };  
      this.getOpor.editarOportunidad(cambios, this.oportunidad._id).subscribe({
        next: (resp: any) => {
          this.obtenerOportunidades();
          this.form.nativeElement.reset();
          this.cerrarModal();
          Swal.fire({
            title: "Cambios guardados exitosamente",
            text: resp.msg,
            icon: "success"
          });
        },
        error: (error) => {
          Swal.fire({
            title: "No se pudo guardar los cambios",
            text: error.error.msg,
            icon: "error"
          });
        }
      });
    }
  }

  crearInteraccion(interaccion: InteraccionModel): void {
    if (this.oportunidad && this.oportunidad._id) {
        const idOportunidad: string = this.oportunidad._id;
        // Completar los datos del formulario con el ID de la oportunidad
        const datosFormulario: InteraccionModel = {
            refOportunity: idOportunidad,
            actionInteraction: interaccion.actionInteraction,
            descriptionInteraction: interaccion.descriptionInteraction
        };

        // Llamar al servicio para crear la interacción con los datos completos del formulario
        this.getOpor.crearInteraccion(datosFormulario).subscribe({
            next: (resp: any) => {
                this.obtenerOportunidades();
                this.form.nativeElement.reset();
                this.cerrarModal();
                Swal.fire({
                    title: "Interaccion creada exitosamente",
                    text: resp.msg,
                    icon: "success"
                });
            },
            error: (error) => {
              Swal.fire({
                title: "No se pudo crear la interacción",
                text: error.error.msg,
                icon: "error"
            });
            }
        });
    } else {
        console.error('La oportunidad no tiene un ID definido.');
    }
  }

  nuevaOpor() {
    // este es el mensaje de carga
    Swal.fire({
      title: 'Creando oportunidad...',
      allowOutsideClick: false,  
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(); // Mostrar el indicador de carga
      }
    });
  
    if (this.nuevaOportunidad) {
      this.getOpor.crearOportunidad(this.nuevaOportunidad).subscribe({
        next: (resp: any) => {
          // Cerrar mensaje de carga
          Swal.close();
  
          Swal.fire({
            title: 'Oportunidad creada exitosamente',
            text: resp.msg,
            icon: 'success'
          });
  
          this.obtenerOportunidades();
          this.opor.nativeElement.reset();
          this.cerrarModal();
        },
        error: (error) => {
          // Cerrar mensaje de carga
          Swal.close();
  
          Swal.fire({
            title: 'No se pudo crear la oportunidad',
            text: error.error.msg,
            icon: 'error'
          });
        }
      });
    }
  }

  guardarCambiosInt() {
    if (this.interaccion && this.interaccion._id) {
        const cambios: any = {
            refOportunity: this.refOportunityOriginal,
            descriptionInteraction: this.interaccion.descriptionInteraction,
            actionInteraction: this.interaccion.actionInteraction
        };
        this.getOpor.editarInteraccion(cambios, this.interaccion._id).subscribe({
            next: (resp: any) => {
                this.obtenerOportunidades();
                this.cerrarModal();
                this.mostrarInteracciones=false;
                this.form.nativeElement.reset();
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
        this.getOpor.eliminarInteraccion(interaccion._id).subscribe({
            next: (resp: any) => {
                this.obtenerOportunidades();
                this.cerrarModal();
                this.mostrarInteracciones=false;
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

  onCancel(): void {
    this.cerrarModal();
    this.opor.nativeElement.reset();
    this.editar=false;
  }

  abrirModal1(): void {
    this.modalAbierto = 'modal1';
  }
  abrirModal2(): void {
    this.modalAbierto = 'modal2';
  }
  abrirModal3(): void {
    this.modalAbierto = 'modal3';
  }
  abrirModal4(): void {
    this.modalAbierto = 'modal4';
  }
  abrirModal5(): void {
    this.modalAbierto = 'modal5';
  }
  abrirModal6(): void {
    this.modalAbierto = 'modal6';
  }
  cerrarModal(): void {
    this.modalAbierto = null;
  }

}