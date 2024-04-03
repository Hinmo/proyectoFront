import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegistroComponent } from './auth/registro/registro.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { authGuard } from './guards/auth/auth.guard';
import { RecuperarComponent } from './auth/recuperar/recuperar.component';
import { NotfoundComponent } from './shared/notfound/notfound.component';
import { GuardmsgComponent } from './shared/guardmsg/guardmsg.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { StaffComponent } from './pages/staff/staff.component';
import { SolicitarOportunidadComponent } from './pages/solicitar-oportunidad/solicitar-oportunidad.component';
import { OportunidadesComponent } from './pages/oportunidades/oportunidades.component';
import { InteraccionesComponent } from './pages/interacciones/interacciones.component';
import { AsignarOportunidadComponent } from './pages/asignar-oportunidad/asignar-oportunidad.component';
import { ChartsComponent } from './pages/charts/charts.component';

export const routes: Routes = [
    {
        path:'',
        title:"Inicio",
        component: HomeComponent,
    },
    {
        path:'registro',
        title:"Registro",
        component: RegistroComponent,
    },
    {
        path:'recuperar',
        title:"Restablecer",
        component: RecuperarComponent,
    },
    {
        path:'notfound',
        title:"404",
        component: NotfoundComponent,
    },
    {
        path:'guardmsg',
        title:"Inaccesible",
        component: GuardmsgComponent,
    },
    {
        path:'usuarios',
        title:"Usuarios",
        component: UsuariosComponent,
        canActivate: [authGuard],
    },
    {
        path:'perfil',
        title:"Perfil",
        component: PerfilComponent,
        canActivate: [authGuard],
    },
    {
        path:'clientes',
        title:"Clientes",
        component: ClientesComponent,
        canActivate: [authGuard],
    },
    {
        path:'staff',
        title:"EquipoTabajo",
        component: StaffComponent,
        canActivate: [authGuard],
    },
    {
        path:'nServicio',
        title:"Nuevo Servicio",
        component: SolicitarOportunidadComponent,
        canActivate: [authGuard],
    },
    {
        path:'oportunidades',
        title:"Oportunidades",
        component: OportunidadesComponent,
        canActivate: [authGuard],
    },
    {
        path:'interacciones',
        title:"Interacciones",
        component: InteraccionesComponent,
        canActivate: [authGuard],
    },
    {
        path:'asignar',
        title:"Asignación",
        component: AsignarOportunidadComponent,
        canActivate: [authGuard],
    },
    {
        path:'charts',
        title:"Graficos",
        component: ChartsComponent,
        canActivate: [authGuard],
    },

    {path: '**', redirectTo: 'notfound', pathMatch: 'full'}
];
