import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// SEGURIDAD [JWT-FRONT-03]:
// Se agrega HTTP_INTERCEPTORS para registrar el interceptor.
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { ReservacionesComponent } from './components/reservaciones/reservaciones.component';
import { UserPrincipalUIComponent } from './components/user-principal-ui/user-principal-ui.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ClienteConfigComponent } from './components/cliente-config/cliente-config.component';
import { BookingsMenuComponent } from './components/bookings-menu/bookings-menu.component';
import { AdminConfigComponent } from './components/admin-config/admin-config.component';
import { ClienteBookingsComponent } from './components/cliente-bookings/cliente-bookings.component';
import { AdminReportsComponent } from './components/admin-reports/admin-reports.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { HabitacionesConfigComponent } from './components/habitaciones-config/habitaciones-config.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { RecuperarComponent } from './components/recuperar/recuperar.component';
import { RestablecerComponent } from './components/restablecer/restablecer.component';
import { PromocionesComponent } from './components/promociones/promociones.component';
import { AdministradorComponent } from './components/administrador/administrador.component';
import { RecepcionistaComponent } from './components/recepcionista/recepcionista.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { InventarioTiendaComponent } from './components/inventario-tienda/inventario-tienda.component';
import { PromocionesEnvioComponent } from './components/promociones-envio/promociones-envio.component';
import { ListaPromocionesComponent } from './components/lista-promociones/lista-promociones.component';
import { OfertasclienteComponent } from './components/ofertascliente/ofertascliente.component';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  TranslateModule,
  TranslateLoader
} from '@ngx-translate/core';

import { CambioIdiomaService } from 'src/services/cambio-idioma.service';

// SEGURIDAD [JWT-FRONT-03]:
// Interceptor encargado de adjuntar el JWT a la API.
import { AuthInterceptor } from './interceptors/auth.interceptor';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    './assets/i18n/',
    '.json'
  );
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ReservacionesComponent,
    UserPrincipalUIComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    RegistroComponent,
    ClienteConfigComponent,
    BookingsMenuComponent,
    AdminConfigComponent,
    ClienteBookingsComponent,
    AdminReportsComponent,
    CarritoComponent,
    HabitacionesConfigComponent,
    RecuperarComponent,
    RestablecerComponent,
    PromocionesComponent,
    PromocionesEnvioComponent,
    ListaPromocionesComponent,
    AdministradorComponent,
    RecepcionistaComponent,
    ClienteComponent,
    InventarioTiendaComponent,
    OfertasclienteComponent
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgxPaginationModule,

    // HTTP_INTERCEPTORS no debe colocarse aquí.

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],

  providers: [
    CambioIdiomaService,

    // SEGURIDAD [JWT-FRONT-03]:
    // Registrar el interceptor de autenticación JWT.
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
