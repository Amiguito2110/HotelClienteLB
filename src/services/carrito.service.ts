import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  constructor(private http: HttpClient) { }

  agregar_Carrito(datosJSON: any){
    return this.http.post(`${environment.API_URI}/carrito/agregar_carrito/`, datosJSON);
  }

  eliminar_del_carrito(id: any){
    return this.http.delete(`${environment.API_URI}/carrito/eliminar_carrito/${id}`);
  }

  mostrar_carrito(id: any){
    return this.http.get(`${environment.API_URI}/carrito/mostrar_carrito/${id}`);
  }

  mostrar_detalle_carrito(id: any){
    return this.http.get(`${environment.API_URI}/carrito/mostrar_detalle_carrito/${id}`);
  }

  filtrar_carrito(id: any){
    return this.http.get(`${environment.API_URI}/carrito/filtrar_carrito/${id}`);
  }

  mostrar_carrito_no_disponibles(id: any){
    return this.http.get(`${environment.API_URI}/carrito/mostrar_carrito_no_disponibles/${id}`);
  }
}
