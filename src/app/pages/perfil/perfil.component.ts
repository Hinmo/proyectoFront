import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../core/models/usuario.model';
import { UsuariosService } from '../../services/usuarios/usuario.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ModalComponent } from "../../components/modal/modal.component";
import { AutenticacionService } from '../../services/autenticacion/autenticacion.service';

@Component({
    selector: 'app-perfil',
    standalone: true,
    templateUrl: './perfil.component.html',
    styleUrl: './perfil.component.css',
    imports: [CommonModule, FormsModule, ModalComponent, ReactiveFormsModule]
})
export class PerfilComponent implements OnInit{
  usuario: UsuarioModel | null = null;
  editMode: boolean = false;
  contrasenaForm: FormGroup = {} as FormGroup;

  modalAbierto: 'modal1' | 'modal2' | 'modal3' | null = null;

  constructor(private usuariosService: UsuariosService, private auth:AutenticacionService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString) {
      const usuario: UsuarioModel = JSON.parse(usuarioString);      
      if (usuario._id) {
        this.usuariosService.obtenerUsuario(usuario._id).subscribe({
          next: (resp: any) => {
            this.usuario = resp.usuario;
          },
          error: (error: any) => {
            console.error('Error al obtener el usuario:', error);
          }
        });
      }
    }

    this.contrasenaForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });

  }
 
  cambiarContrasena() {
    if (this.contrasenaForm.valid) {
      const password = this.contrasenaForm.get('password')?.value;
      const confirmPassword = this.contrasenaForm.get('confirmPassword')?.value;

      if (password === confirmPassword && this.usuario?._id) {
        this.usuariosService.cambiarPass(this.usuario?._id, password).subscribe({
          next: () => {
            Swal.fire({
              title: "Contraseña cambiada con éxito",
              icon: "success"
            });
            this.toggleEditMode();
          },
          error: (error) => {
            Swal.fire({
              title: "No se pudo cambiar contraseña",
              text: error.error.msg,
              icon: "error"
            });
          }
        });
        this.cerrarModal();
      } else {
        Swal.fire({
          title: "la contraseña y su confirmación no coinciden",
          icon: "warning"
        });
      }
    } else {
      Swal.fire({
        title: "los campos son obligatorios",
        icon: "error"
      });
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  capturarCambios() {
    if (this.usuario) {
      this.usuario = { ...this.usuario };
    } else {
      console.error('El usuario no existe. No se pueden capturar cambios.');
    }
  }

  guardarCambios() {
    if (this.editMode) {
      if (this.usuario) {
        this.usuariosService.editarUsuario(this.usuario).subscribe({
          next: () => {
            Swal.fire({
              title: "Cambios guardados con éxito",
              icon: "success"
            });
            this.toggleEditMode();
          },
          error: (error) => {
            Swal.fire({
              title: "No se pudo actualizar",
              text: error.error.msg,
              icon: "error"
            });
          }
        });
      }
    } else {
      this.toggleEditMode();
    }
  }

  cambiarEstadoUsuario(usuario: UsuarioModel | null): void {
    if (usuario?._id) {
        this.usuariosService.cambiarEstado(usuario._id).subscribe({
            next: () => {
              Swal.fire({
                title: "Cuenta desactivada",
                text: "Vuelve pronto",
                icon: "success"
              });
              this.cerrarModal();
            },
            error: (error) => {
              Swal.fire({
                title: "No se pudo desactivar la cuenta",
                text: error.error.msg,
                icon: "error"
              });
            },
        });
    }
  }

  eliminarUsuarioConfirmado(usuario: UsuarioModel | null): void {
    if (usuario?._id) {
        this.usuariosService.eliminarUsuario(usuario._id).subscribe({
            next: () => {
              Swal.fire({
                title: "Cuenta eliminada",
                text: "que la ley esté de tu lado",
                icon: "success"
              });
              this.cerrarModal();
              this.auth.logout();
            },
            error: (error) => {
                console.error('Error al eliminar usuario:', error);
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
  abrirModal3(): void {
    this.modalAbierto = 'modal3';
  }
  cerrarModal(): void {
    this.modalAbierto = null;
  }

}