import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PermisosDirective } from '../../core/directives/permisos/permisos.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, PermisosDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
}