import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PromocionesService {

  constructor(private http: HttpClient) { }


  mostrarTodasPromociones() {
    return this.http.get(`${environment.API_URI}/promociones/mostrarTodasPromociones/`);
  }

  agregarPromociones(habitacionesSeleccionadas: any[], fechin: Date, fechout: Date, porcentaje:any): Observable<any> {
    const datosJSON = {
      habitacionesSeleccionadas: habitacionesSeleccionadas,
      fechin: fechin,
      fechout: fechout,
      porcentaje: porcentaje
    };
    console.log(this.http.post(`${environment.API_URI}/promociones/agregarPromociones/`, datosJSON));
    return this.http.post(`${environment.API_URI}/promociones/agregarPromociones/`, datosJSON);
  }
  

  eliminarPromocion(id: any){
    return this.http.delete(`${environment.API_URI}/promociones/eliminarPromocion/${id}`);
  }


}