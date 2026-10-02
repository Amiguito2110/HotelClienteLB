import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ReservacionService {

  constructor(private http: HttpClient) { }

  rellenar_tabla(FechaUno: any){
    return this.http.get(`${environment.API_URI}/habitaciones/rellenar_datos_tabla/${FechaUno}`);
  }

  mostrar_habitacion(IDHabitacion: any) {
    return this.http.get(`${environment.API_URI}/habitaciones/mostrar_habitacion/${IDHabitacion}`);
  }

  mostrar_reservaciones_por_fecha(FechaEntrada: any) {
    return this.http.get(`${environment.API_URI}/reservaciones/mostrar_reservaciones_por_fecha/${FechaEntrada}`);
  }

  mostrar_habitaciones_disponibles_rango_fecha(rango: any){
    return this.http.post(`${environment.API_URI}/reservaciones/mostrar_habitaciones_disponibles_rango_fecha/`, rango);
  }

  hacer_reservacion(datos_reservacion: any){
    return this.http.post(`${environment.API_URI}/reservaciones/hacer_reservacion/`, datos_reservacion);
  }

  mostrar_habitaciones_num_disponibilidad(rango: any){
    return this.http.post(`${environment.API_URI}/reservaciones/mostrar_habitaciones_num_disponibilidad/`, rango);
  }

  hacer_reservacion_2(datosJSON: any){
    return this.http.post(`${environment.API_URI}/reservaciones/hacer_reservacion_2/`, datosJSON);
  }

  tabla_reservas(fecha: any){
    return this.http.get(`${environment.API_URI}/reservaciones/tabla_reservas/${fecha}`);
  }

  modificar_estado_reserva(id: any, body: any){
    return this.http.put(`${environment.API_URI}/reservaciones/modificar_estado_reserva/${id}`, body);
  }
  
  reservas_idUsuario(id: any){
    return this.http.get(`${environment.API_URI}/reservaciones/reservas_idUsuario/${id}`);
  }

  mostrar_reservaciones_por_IDCuenta(id: any){
    return this.http.get(`${environment.API_URI}/reservaciones/mostrar_reservaciones_por_IDCuenta/${id}`)
  }

  mostrar_detalles_reservacion(id: any){
    return this.http.get(`${environment.API_URI}/reservaciones/mostrar_detalles_reservacion/${id}`)
  }
  
  actualizar_despues_de_cancelacion(datosJSON: any){
    return this.http.post(`${environment.API_URI}/reservaciones/actualizar_despues_de_cancelacion/`, datosJSON)
  }

  mostrar_detallesReservacion(id: any){
    return this.http.get(`${environment.API_URI}/reservaciones/mostrar_detallesReservacion/${id}`)
  }

  porcentaje_ocupacion_mensual(datosJSON: any){
    return this.http.post(`${environment.API_URI}/reservaciones/porcentaje_ocupacion_mensual/`,datosJSON);
  }

  reporte_ventas_mensual(datosJSON: any){
    return this.http.post(`${environment.API_URI}/reservaciones/reporte_ventas_mensual/`,datosJSON);
  }

  setearCostoTotal(datosJSON: any){
    return this.http.post(`${environment.API_URI}/reservaciones/setearCostoTotal/`,datosJSON);
  }


}
