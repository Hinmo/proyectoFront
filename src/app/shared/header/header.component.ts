import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ModalComponent } from '../../components/modal/modal.component';
import { LoginComponent } from '../../auth/login/login.component';
import { PermisosDirective } from '../../core/directives/permisos/permisos.directive';
import { AutenticacionService } from '../../services/autenticacion/autenticacion.service';
import 'flowbite';
import { CommonModule } from '@angular/common';
import { UsuarioModel } from '../../core/models/usuario.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  imports: [RouterLink, ModalComponent, LoginComponent, PermisosDirective, CommonModule],
})

export class HeaderComponent implements OnInit {
  mostrarMenu: boolean[] = [false, false, false];
  usuario: UsuarioModel | null = null;
  private unsubscribe$ = new Subject<void>();

  abrirCerrarMenuIzq(index: number): void {
    this.mostrarMenu[index] = !this.mostrarMenu[index];
  }

  cargarUsuario(): void {
    const userData = localStorage.getItem('usuario');
    if (userData) {
      this.usuario = JSON.parse(userData);
    }
  }
  
  constructor(private auth: AutenticacionService) {}

  ngOnInit(): void {
    this.auth.logoutExpiredSession();
    this.cargarUsuario();

    this.auth.onLogin.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.cargarUsuario();
    });

    this.auth.onLogout.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.usuario = null;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  iconos: string[] = [
    './assets/avatar/cat.png',
    './assets/avatar/cow.png',
    './assets/avatar/dog.png',
    './assets/avatar/elep.png',
    './assets/avatar/fish.png',
    './assets/avatar/giraffe.png',
    './assets/avatar/monkey.png',
    './assets/avatar/pig.png',
    './assets/avatar/snake.png',
    './assets/avatar/toucan.png',
  ];
  randomIndex = Math.floor(Math.random() * this.iconos.length);

  // Funcion para los el bg de los botones del navbar
  isButtonActivePerson: boolean = false;
  toggleButtonPerson() {
    this.isButtonActivePerson = !this.isButtonActivePerson;
  }

  //modalReutilizable
  isModalOpen: boolean = false;
  openModal() {
    this.isModalOpen = true;
  }
  onModalClose() {
    this.isModalOpen = false;
  }

  onLoginSuccess() {
    this.isModalOpen = false;
  }

  cerrarSesion(){
    this.auth.logout();
    this.toggleButtonPerson();
  }
}