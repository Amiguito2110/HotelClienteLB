import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  constructor(private http: HttpClient) { }

  registrarse(CorreoElectronico: any, Contrasena: any, Nombre: any, NumeroTelefono: any) {
    return this.http.put(`${environment.API_URI}/cuenta/crear_cuenta/`,
      {
        "CorreoElectronico": CorreoElectronico, "Contrasena": Contrasena, "NombreCompleto": Nombre,
        "NumeroTelefono": NumeroTelefono, "Rol": 3
      });
  }
  correoExiste2(CorreoElectronico:any){
    return this.http.get(`${environment.API_URI}/cuenta/correo_existe2/${CorreoElectronico}`)
  }
}
