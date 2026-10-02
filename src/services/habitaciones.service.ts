import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {

  constructor(private http: HttpClient) { }

  total_habitacion(){
    return this.http.get(`${environment.API_URI}/habitaciones/total_habitaciones/`);
  }
  buscar_habitacion_id(id:any)
  {
    return this.http.get(`${environment.API_URI}/habitaciones/mostrar_habitacion/${id}`);
  }
  mostrar_todas_habitaciones(){
    return this.http.get(`${environment.API_URI}/habitaciones/mostrar_todas_habitaciones/`);
  }

  actualizar_habitacion(id: any, datosJSON: any){
    return this.http.put(`${environment.API_URI}/habitaciones/actualizar_habitacion/${id}`, datosJSON);
  }

  crear_habitacion(datosJSON: any){
    return this.http.post(`${environment.API_URI}/habitaciones/crear_habitacion/`, datosJSON);
  }

  eliminar_habitacion(id: any){
    return this.http.delete(`${environment.API_URI}/habitaciones/eliminar_habitacion/${id}`);
  }

  insertar_id_foto(id: any){
    return this.http.post(`${environment.API_URI}/habitaciones/insertar_datos_foto/`,id);
  }

  id_fotos_por_habitacion(id: any){
    return this.http.get(`${environment.API_URI}/habitaciones/id_fotos_por_habitacion/${id}`);
  }

  id_foto_principal_por_Idhabitacion(id: any){
    return this.http.get(`${environment.API_URI}/habitaciones/fotoPrincipal_por_Idhabitacion/${id}`);
  }

  eliminar_datos_foto(id: any){
    return this.http.delete(`${environment.API_URI}/habitaciones/eliminar_datos_foto/${id}`);
  }
}
