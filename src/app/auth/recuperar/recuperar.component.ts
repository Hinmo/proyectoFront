import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AutenticacionService } from '../../services/autenticacion/autenticacion.service';
import { ModalComponent } from '../../components/modal/modal.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  templateUrl: './recuperar.component.html',
  styleUrl: './recuperar.component.css',
  imports: [ReactiveFormsModule, ModalComponent],
})
export class RecuperarComponent implements OnInit, OnDestroy {
  formularioRecuperacion: FormGroup;
  newPassForm: FormGroup;
  tiempoExpiracion: number = 0;
  contador: any;

  constructor(
    private formBuilder: FormBuilder,
    private autenticacionService: AutenticacionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.recuperacionForm();
    this.cambioForm();
  }

  ngOnDestroy() {
    localStorage.removeItem('x-token-pass');
  }

  recuperacionForm() {
    this.formularioRecuperacion = this.formBuilder.group({
      email: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.formularioRecuperacion.valid) {
      const { email, numeroDocumento } = this.formularioRecuperacion.value;
      this.autenticacionService
        .recuperarContraseña(email, numeroDocumento)
        .subscribe({
          next: (resp: any) => {
            if (resp.token) {
              localStorage.setItem('x-token-pass', resp.token);
              const tiempoExpiracion = resp.tiempoExpiracion; // Tiempo de expiración del token en segundos
              this.iniciarContador(tiempoExpiracion);
              this.openModal();
              console.log('Token de recuperación generado:', resp.token);
            } else {
              console.error(
                'Error al recuperar la contraseña. Por favor, inténtalo de nuevo.'
              );
            }
          },
          error: (error: any) => {
            Swal.fire({
              title: "Error en la solicitud",
              text: error.error.msg,
              icon: "error"
            });
          },
        });
    } else {
      Swal.fire({
        title: "formulario invalido, por favor rellene bien los campos",
        icon: "warning"
      });
    }
  }

  iniciarContador(tiempoExpiracion: number) {
    this.contador = setInterval(() => {
      if (tiempoExpiracion > 0) {
        tiempoExpiracion--;
        this.tiempoExpiracion = tiempoExpiracion; 
      } else {
        clearInterval(this.contador);
        console.log('El tiempo de expiración del token ha llegado a cero.');
      }
    }, 1000); 
  }

  formatoTiempo(tiempo: number): string {
    const minutos = Math.floor(tiempo / 60);
    const segundos = tiempo % 60;
    return `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
  }

  cambioForm() {
    this.newPassForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', Validators.required],
    });
  }

  onSubmitNewPassForm() {
    if (this.newPassForm.valid) {
      const nuevaContrasena = this.newPassForm.get('password')?.value; // Cambiado a 'password'
      const confirmarContrasena = this.newPassForm.get(
        'confirmarContrasena'
      )?.value;
      if (nuevaContrasena === confirmarContrasena) {
        this.autenticacionService.cambiarContraseña(nuevaContrasena).subscribe({
          next: () => {
            Swal.fire({
              title: "Nueva contraseña establecida",
              icon: "success"
            });
            this.onModalClose();
            this.router.navigate(['']);
            localStorage.removeItem('x-token-pass');
          },
          error: (error: any) => {
            Swal.fire({
              title: "No se pudo ingresar la nueva contraseña",
              text: error.error.msg,
              icon: "error"
            });
          },
        });
      } else {
        Swal.fire({
          title: "las contraseñas deben coincidir",
          icon: "warning"
        });
      }
    } else {
      Swal.fire({
        title: "completa el formulario adecuadamente",
        icon: "error"
      });
    }
  }

  //modalReutilizable
  isModalOpen: boolean = false;
  openModal() {
    this.isModalOpen = true;
  }
  onModalClose() {
    this.isModalOpen = false;
    clearInterval(this.contador);
    localStorage.removeItem('x-token-pass');
  }
}
