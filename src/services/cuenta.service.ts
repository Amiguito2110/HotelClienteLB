import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CuentaService {

  constructor(private http: HttpClient) { }

  set_foto_cero(Foto: any, IDCuenta: any){ 
    return this.http.put(`${environment.API_URI}/cuenta/set_foto_cero/${IDCuenta}`,{"Foto":Foto});
  }

  mostrar_todas_cuentas(){
    return this.http.get(`${environment.API_URI}/cuenta/mostrar_todas_cuentas/`);
  }

  mostrarCuenta(IDCuenta: any){
    return this.http.get(`${environment.API_URI}/cuenta/mostrar_cuenta/${IDCuenta}`);
  }

  validarCuenta(CorreoElectronico: any ,Contrasena: any) {
    return this.http.post(`${environment.API_URI}/cuenta/validar_cuenta/`,{"CorreoElectronico":CorreoElectronico, "Contrasena":Contrasena});
  }

  correoExiste(CorreoElectronico: any) {
    return this.http.post(`${environment.API_URI}/cuenta/correo_existe/`,{"CorreoElectronico":CorreoElectronico});
  }

  correosUsuarios(){
    return this.http.get(`${environment.API_URI}/cuenta/correos_usuarios/`);
  }

  actualizarNombre(NuevosDatos: any, IDCuenta: any){ 
    return this.http.put(`${environment.API_URI}/cuenta/actualizar_cuenta/${IDCuenta}`,{"NombreCompleto": NuevosDatos})
  }

  actualizarTelefono(NuevosDatos: any, IDCuenta: any){ 
    return this.http.put(`${environment.API_URI}/cuenta/actualizar_cuenta/${IDCuenta}`,{"NumeroTelefono": NuevosDatos})
  }

  actualizarCorreo(NuevosDatos: any, IDCuenta: any){ 
    return this.http.put(`${environment.API_URI}/cuenta/actualizar_cuenta/${IDCuenta}`,{"CorreoElectronico": NuevosDatos})
  }

  actualizarContrasena(NuevosDatos: any, IDCuenta: any){ 
    return this.http.put(`${environment.API_URI}/cuenta/actualizar_cuenta/${IDCuenta}`,{"Contrasena": NuevosDatos})
  }

  actualizar_cuenta(id: any, datosJSON: any){
    return this.http.put(`${environment.API_URI}/cuenta/actualizar_cuenta/${id}`, datosJSON)
  }

  agregarCuenta(Datos: any){
    return this.http.put(`${environment.API_URI}/cuenta/agregarCuenta/`,{"Contrasena": Datos.contrasena, 
      "NombreCompleto": Datos.NombreCompleto, "NumeroTelefono": Datos.NumeroTelefono, "CorreoElectronico": Datos.CorreoElectronico})
  }

  eliminarCuenta( IDCuenta: any){
    return this.http.delete(`${environment.API_URI}/cuenta/eliminar_cuenta/${IDCuenta}`,)
  }

  crearCuenta(datosJSON : any){
    console.log('crearcuenta',datosJSON);
    return this.http.put(`${environment.API_URI}/cuenta/crear_cuenta/`, datosJSON);
  }
  actualizarFoto(cuenta: any){
    return this.http.put(`${environment.API_URI}/cuenta/actualizarFoto/${cuenta.IDCuenta}`,cuenta);
  }
}

