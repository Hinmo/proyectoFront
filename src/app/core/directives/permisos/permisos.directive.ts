import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AutenticacionService } from '../../../services/autenticacion/autenticacion.service';
import { Subject, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appPermisos]',
  standalone: true,
})
export class PermisosDirective implements OnInit, OnDestroy {
  @Input('appPermisos') permisos: string[];

  private unsubscribe = new Subject<void>();

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private autenticacionService: AutenticacionService
  ) {}

  ngOnInit(): void {
    // Combinar los observables onLogin y onLogout en uno solo
    const loginLogoutObservable = merge(
      this.autenticacionService.onLogin,
      this.autenticacionService.onLogout
    );

    // Suscribirse al observable combinado
    loginLogoutObservable.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.actualizarVista();
    });

    // Actualizar la vista al inicializar la directiva
    this.actualizarVista();
  }

  ngOnDestroy(): void {
    // Desuscribirse cuando se destruye la directiva
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private actualizarVista(): void {
    const usuarioString = localStorage.getItem('usuario'); // Cambio a localStorage
    const usuario = usuarioString ? JSON.parse(usuarioString) : null;
    const rol = usuario && usuario.rol ? usuario.rol : 'INVITADO';
    if (this.validarPermisos(rol)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  private validarPermisos(rol: string): boolean {
    return this.permisos.some((permiso) => permiso === rol.toUpperCase());
  }
}