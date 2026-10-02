import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ReservacionesComponent } from './components/reservaciones/reservaciones.component';
import { UserPrincipalUIComponent } from './components/user-principal-ui/user-principal-ui.component';
import { HomeComponent } from './components/home/home.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ClienteConfigComponent } from './components/cliente-config/cliente-config.component';
import { BookingsMenuComponent } from './components/bookings-menu/bookings-menu.component';
import { AdminConfigComponent } from './components/admin-config/admin-config.component';
import { ClienteBookingsComponent } from './components/cliente-bookings/cliente-bookings.component';
import { AdminReportsComponent } from './components/admin-reports/admin-reports.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { HabitacionesConfigComponent } from './components/habitaciones-config/habitaciones-config.component';
import { RecuperarComponent } from './components/recuperar/recuperar.component';
import { RestablecerComponent } from './components/restablecer/restablecer.component';
import { PromocionesComponent } from './components/promociones/promociones.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { AdministradorComponent } from './components/administrador/administrador.component';
import { RecepcionistaComponent } from './components/recepcionista/recepcionista.component';
import { InventarioTiendaComponent } from './components/inventario-tienda/inventario-tienda.component';
import { ListaPromocionesComponent } from './components/lista-promociones/lista-promociones.component';
import { PromocionesEnvioComponent } from './components/promociones-envio/promociones-envio.component';
import { OfertasclienteComponent } from './components/ofertascliente/ofertascliente.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full"
    },

    {
      path: 'login',
      component: LoginComponent,
    },

    {
      path: 'recuperar',
      component: RecuperarComponent,
    },
    {
      path: 'restablecer/:token',
      component: RestablecerComponent,
    },

    {
      path: 'registro',
      component: RegistroComponent
    },

    {
      path: 'promociones',
      component: PromocionesComponent
    },
    {
      path: 'promociones-envio',
      component: PromocionesEnvioComponent
      
    },
    {
      path: 'lista-promociones',
      component: ListaPromocionesComponent
      
    },

    {
      path: 'home',
      component: HomeComponent,
      children: [
        {
          path: 'user_principal_ui',
          component: UserPrincipalUIComponent
        },

        {
          path: 'reservaciones',
          component: ReservacionesComponent
        },

        {
          path: 'cliente_config',
          component: ClienteConfigComponent
        },
        
        {
          path: 'booking_menu',
          component: BookingsMenuComponent
        },
        
        {
          path: 'admin_config',
          component : AdminConfigComponent
        },

        {
          path: 'cliente_bookings',
          component: ClienteBookingsComponent
        },
      
        {
          path: 'admin_reports',
          component: AdminReportsComponent
        },

        {
          path: 'carrito',
          component: CarritoComponent
        },

        {
          path: 'habitaciones_config',
          component: HabitacionesConfigComponent
        },{
          path: 'inventario_tienda',
          component: InventarioTiendaComponent
        }
      ]
    },
    {
      path: 'cliente',
      component: ClienteComponent,
    },
    {
      path: 'administrador',
      component: AdministradorComponent,
    },
    {
      path: 'recepcionista',
      component: RecepcionistaComponent,
    },
    {
      path: 'ofertascliente',
      component: OfertasclienteComponent,
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }