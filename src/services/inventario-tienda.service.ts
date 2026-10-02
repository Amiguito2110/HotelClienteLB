import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventarioTiendaService {

  constructor(private http: HttpClient) { }

  mostrar_todos_productos(){
    return this.http.get(`${environment.API_URI}/inventario/mostrar_todos_productos/`);
  }

  mostrar_todas_categorias(){
    return this.http.get(`${environment.API_URI}/inventario/mostrar_categorias/`);
  }

  actualizar_productos(id: any, datosJSON: any){
    
    return this.http.put(`${environment.API_URI}/inventario/actualizar_tienda/${id}`, datosJSON);
  }

  agregar_producto(datosJSON: any){
    return this.http.post(`${environment.API_URI}/inventario/agregar_producto/`, datosJSON);
  }

  agregar_categoria(datosJSON: any){
    return this.http.post(`${environment.API_URI}/inventario/crear_categoria/`, datosJSON);
  }


  eliminar_producto(id: any){
   
    return this.http.delete(`${environment.API_URI}/inventario/eliminar_producto/${id}`);
  }
}
