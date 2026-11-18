
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

// SEGURIDAD [JWT-FRONT-01]:
// Tipado de la respuesta recibida del backend.
export interface RespuestaLogin {
  IDCuenta: number;
  NombreCompleto: string;
  CorreoElectronico: string;
  Rol: number;
  NumeroTelefono?: string;
  Foto?: number | string | null;
  token: string;
  tokenType: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class CuentaService {

  // SEGURIDAD [JWT-FRONT-02]:
  // Nombre único para la credencial de sesión.
  private readonly TOKEN_KEY = 'hotel_access_token';

  constructor(private http: HttpClient) { }

  // ==========================================
  // GESTIÓN DE JWT
  // ==========================================

  // SEGURIDAD [JWT-FRONT-01]:
  // Guardar la credencial para la sesión
  // actual del navegador.
  guardarToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  // SEGURIDAD [JWT-FRONT-02]:
  // Obtener el token sin imprimirlo.
  obtenerToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  // SEGURIDAD [JWT-FRONT-02]:
  // Eliminar el token al cerrar sesión.
  eliminarToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

// SEGURIDAD [JWT-TEST]:
// El interceptor debe agregar Authorization automáticamente.
verificarTokenTemporal() {
  return this.http.get<{
    mensaje: string;
    idCuenta: number;
  }>(
    `${environment.API_URI}/cuenta/verificar-token/`
  );
}
  // ==========================================
  // OPERACIONES DE CUENTAS
  // ==========================================

  set_foto_cero(Foto: any, IDCuenta: any) {
    return this.http.put(
      `${environment.API_URI}/cuenta/set_foto_cero/${IDCuenta}`,
      { Foto: Foto }
    );
  }

  mostrar_todas_cuentas() {
    return this.http.get(
      `${environment.API_URI}/cuenta/mostrar_todas_cuentas/`
    );
  }

  mostrarCuenta(IDCuenta: any) {
    return this.http.get(
      `${environment.API_URI}/cuenta/mostrar_cuenta/${IDCuenta}`
    );
  }

  validarCuenta(
    CorreoElectronico: string,
    Contrasena: string
  ): Observable<RespuestaLogin> {

    return this.http.post<RespuestaLogin>(
      `${environment.API_URI}/cuenta/validar_cuenta/`,
      {
        CorreoElectronico,
        Contrasena
      }
    );
  }

  correoExiste(CorreoElectronico: any) {
    return this.http.post(
      `${environment.API_URI}/cuenta/correo_existe/`,
      { CorreoElectronico }
    );
  }

  correosUsuarios() {
    return this.http.get(
      `${environment.API_URI}/cuenta/correos_usuarios/`
    );
  }

  actualizarNombre(NuevosDatos: any, IDCuenta: any) {
    return this.http.put(
      `${environment.API_URI}/cuenta/actualizar_cuenta/${IDCuenta}`,
      { NombreCompleto: NuevosDatos }
    );
  }

  actualizarTelefono(NuevosDatos: any, IDCuenta: any) {
    return this.http.put(
      `${environment.API_URI}/cuenta/actualizar_cuenta/${IDCuenta}`,
      { NumeroTelefono: NuevosDatos }
    );
  }

  actualizarCorreo(NuevosDatos: any, IDCuenta: any) {
    return this.http.put(
      `${environment.API_URI}/cuenta/actualizar_cuenta/${IDCuenta}`,
      { CorreoElectronico: NuevosDatos }
    );
  }

  actualizarContrasena(NuevosDatos: any, IDCuenta: any) {
    return this.http.put(
      `${environment.API_URI}/cuenta/actualizar_cuenta/${IDCuenta}`,
      { Contrasena: NuevosDatos }
    );
  }

  actualizar_cuenta(id: any, datosJSON: any) {
    return this.http.put(
      `${environment.API_URI}/cuenta/actualizar_cuenta/${id}`,
      datosJSON
    );
  }

  agregarCuenta(Datos: any) {
    return this.http.put(
      `${environment.API_URI}/cuenta/agregarCuenta/`,
      {
        Contrasena: Datos.contrasena,
        NombreCompleto: Datos.NombreCompleto,
        NumeroTelefono: Datos.NumeroTelefono,
        CorreoElectronico: Datos.CorreoElectronico
      }
    );
  }

  eliminarCuenta(IDCuenta: any) {
    return this.http.delete(
      `${environment.API_URI}/cuenta/eliminar_cuenta/${IDCuenta}`
    );
  }

  crearCuenta(datosJSON: any) {

    // SEGURIDAD [LOG-FRONT-01]:
    // Se elimina console.log(datosJSON),
    // porque puede incluir contraseñas y datos personales.

    return this.http.put(
      `${environment.API_URI}/cuenta/crear_cuenta/`,
      datosJSON
    );
  }

  actualizarFoto(cuenta: any) {
    return this.http.put(
      `${environment.API_URI}/cuenta/actualizarFoto/${cuenta.IDCuenta}`,
      cuenta
    );
  }
}
