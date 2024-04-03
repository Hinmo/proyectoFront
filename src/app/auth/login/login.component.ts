import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutenticacionService } from '../../services/autenticacion/autenticacion.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  @Output() loginSuccess = new EventEmitter<void>();
  @Output() registro = new EventEmitter<void>();
  
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, 
    private autenticacionService: AutenticacionService,
    private router: Router
    ){ }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      login: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });    
  }

  get login(){
    return this.loginForm.get(`login`);
  }
  get password(){
    return this.loginForm.get(`password`);
  }

  realizoLogin(){
    if(this.loginForm.invalid){
      return;
    }

    const data = this.loginForm.value;

    this.autenticacionService.login(data).subscribe({
      next: (resp: any) => {
        if (resp && resp.usuario) {
          this.router.navigateByUrl('');
          this.loginSuccess.emit();
          this.loginForm.reset();
          Swal.fire({
            icon: "success",
            title: resp.usuario.login,
            text: "Bienvenido",
          });
        }
      },
      error: (error: any) => {
        console.error(error.error.msg);
        Swal.fire({
          icon: "error",
          title: "Algo salió mal",
          text: error.error.msg,
        });
      },
    });
  }

  registrarse(){
    this.registro.emit();
    this.loginForm.reset();
  }
}