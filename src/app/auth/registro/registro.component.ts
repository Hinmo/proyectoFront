import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios/usuario.service';
import { UsuarioModel } from '../../core/models/usuario.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent implements OnInit{
  password: string = '';
  showPassword: boolean = false;
  registroForm: FormGroup;

  constructor(private userService: UsuariosService, private fb: FormBuilder, private router: Router){}

  ngOnInit(): void {
    this.regisForm();
  }

  regisForm(): void {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      celular: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      tipoDocumento: ['', [Validators.required]],
      numeroDocumento: ['', [Validators.required]],
      login: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', [Validators.required, this.passValidar()]],
    });   
  };

  passValidar() {
    return (control: AbstractControl) => {
      const password = control.root.get('password');
      const confirm_password = control.value;
      if (password && password.value !== confirm_password) {
        return { confirmPassword: true };
      }
      return null;
    };
  }

  crearUsuario() {
    if (this.registroForm.valid) {
      const usuario: UsuarioModel = {
        nombre: this.registroForm.value.nombre,
        direccion: this.registroForm.value.direccion,
        celular: this.registroForm.value.celular,
        email: this.registroForm.value.email,
        tipoDocumento: this.registroForm.value.tipoDocumento,
        numeroDocumento: this.registroForm.value.numeroDocumento,
        login: this.registroForm.value.login,
        password: this.registroForm.value.password,
      };
      this.userService.crearUsuario(usuario).subscribe({
        next: () => {
          Swal.fire({
            title: "Usuario creado con exito",
            icon: "success"
          });;
          this.registroForm.reset();
          this.router.navigate(['']);
        },
        error: (error) => {
          Swal.fire({
            title: "Error al crear usuario",
            text: error.error.msg,
            icon: "error"
          });
        }
      });
    } else {
      Swal.fire({
        title: "Por favor rellene los datos del formulario de manera adecuada",
        icon: "warning"
      });
    }
  }

  mostrarPass() {
    this.showPassword = !this.showPassword;
  }
}
