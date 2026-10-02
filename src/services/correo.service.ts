import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CorreoService {

  constructor(private http: HttpClient) { }
  enviarCorreoRecuperarContrasenya(body: any) {
    return this.http.post(`${environment.API_URI_CORREOS}/enviarCorreoRecuperarContrasenya/`,  {"CorreoElectronico": body});
  }
  decodificarMail(token: any,Contrasena : any) {
    return this.http.post(`${environment.API_URI_CORREOS}/decodificarMail`, {"token": token, "Contrasena": Contrasena});
  }
  enviarPromocion(mensaje: string, correos: string[]): Observable<any> {
    return this.http.post(`${environment.API_URI_CORREOS}/enviarPromociones`, { mensaje, correos });
  }
}
