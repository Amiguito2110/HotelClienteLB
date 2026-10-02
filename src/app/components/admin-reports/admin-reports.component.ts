import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { data } from 'jquery';
import { habitacion } from 'src/app/models/habitaciones';
import { nuevaReservacion } from 'src/app/models/nuevaReservacion';
import { porcentajeMensual } from 'src/app/models/porcentajeMensual';
import { ReservacionService } from 'src/services/reservacion.service';
import { CambioIdiomaService } from 'src/services/cambio-idioma.service';
import Swal from 'sweetalert2'

declare var M: any;

@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.css']
})
export class AdminReportsComponent implements AfterViewInit{
  anio: any;
  mes: any;
  // porcentaje: porcentajeMensual = new porcentajeMensual;
  porcentajes: any;
  ventas: any;
  meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  idioma: any;
  constructor( private ReservacionService: ReservacionService, private el: ElementRef, private cambioIdiomaService: CambioIdiomaService){
    this.idioma = localStorage.getItem("idioma");
    this.anio = new Date().getFullYear();
  }

  ngAfterViewInit(): void {
    const selectAnio = this.el.nativeElement.querySelectorAll('select');
    M.FormSelect.init(selectAnio);
    const instanceAnio = M.Modal.getInstance(selectAnio)
    var year = document.getElementById('setAnio');

    const selectMes = this.el.nativeElement.querySelectorAll('select');
    M.FormSelect.init(selectMes);
    const instanceMes = M.Modal.getInstance(selectMes)
    var month = document.getElementById('setMes');
  }

  selectAnio(selectAnio: any){
    this.anio = selectAnio;
    console.log(this.anio);
  }

  selectMes(month: any){
    this.mes = month;
    console.log(this.mes);

  }

  mostrarPorcentaje(){
    const datoJson = {
      mes: this.mes,
      ano: this.anio
    }
    console.log(datoJson);  
    this.ReservacionService.porcentaje_ocupacion_mensual(datoJson).subscribe((res: any) => {
      this.porcentajes = res;
      console.log('PORCENTAJE:', this.porcentajes);
    });
  }

  mostrarVentas(){
    const datoJson = {
      mes: this.mes,
      ano: this.anio
    }
    console.log(datoJson);  
    this.ReservacionService.reporte_ventas_mensual(datoJson).subscribe((res: any) => {
      this.ventas = res;
      console.log('VENTAS :', this.ventas);
    });
  }
}
