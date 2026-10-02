import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { cuenta } from 'src/app/models/cuentas';
import { CuentaService } from 'src/services/cuenta.service';
import { ReservacionService } from 'src/services/reservacion.service';
import { reservacion } from 'src/app/models/reservaciones';
import { habitacion } from 'src/app/models/habitaciones';
import { DatoTabla } from 'src/app/models/datosTabla';
import { nuevaReservacion } from 'src/app/models/nuevaReservacion';
import { HabitacionesService } from 'src/services/habitaciones.service';
import { zip } from 'rxjs';
import { TranslateService } from "@ngx-translate/core";
import { EstadoReserva } from 'src/app/models/EstadoReserva';
import { EstadoPago } from 'src/app/models/EstadoPago';
import { CambioIdiomaService } from 'src/services/cambio-idioma.service';

declare var M: any;

@Component({
  selector: 'app-bookings-menu',
  templateUrl: './bookings-menu.component.html',
  styleUrls: ['./bookings-menu.component.css']
})

export class BookingsMenuComponent implements AfterViewInit {
  Reservacion: DatoTabla[] = []
  Prueba: EstadoReserva = new EstadoReserva;
  Pago: EstadoPago = new EstadoPago;
  CuentasCliente: cuenta[] = [];
  TotalHabitaciones: any;
  FechaReservas: any;
  DatosTabla: DatoTabla[] = [];
  ID_aux = 0;
  booking_details: any;
  idioma:any;
  calendario:any;
  constructor(private CuentaService: CuentaService, private ReservacionService: ReservacionService,
    private HabitacionesService: HabitacionesService, private translate: TranslateService, private el: ElementRef, private cambioIdiomaService: CambioIdiomaService) {
    
    this.idioma = localStorage.getItem("idioma");
   
      
      this.cambioIdiomaService.currentMsg$.subscribe(
        (msg) => {
            this.idioma = msg;
            console.log("idioma actual:", this.idioma, " aaaa");
        });
    this.HabitacionesService.total_habitacion().subscribe((resTotal: any) => {
      this.TotalHabitaciones = resTotal.TotalHabitaciones;
      console.log(this.TotalHabitaciones);
    });
    this.FechaReservas = '';
  }

  ngAfterViewInit(): void {
    this.idioma = localStorage.getItem('idioma');
  }

  calendarioEn(){
    const elems = this.el.nativeElement.querySelectorAll('.datepicker');
    M.Datepicker.init(elems, {
      format: 'yyyy-mm-dd',
    });
    const elem = this.el.nativeElement.querySelector('#datepicker');
    const instance = M.Datepicker.init(elem, {
      format: 'yyyy-mm-dd',
      defaultDate: new Date(),
      onSelect: (date: Date) => {
        this.FechaReservas = date;
        this.FechaReservas = this.FechaReservas.toISOString().split('T')[0];
        console.log(this.FechaReservas);
      }
    });
    instance.open();
  }

  calendarioEs(){
    const elems = this.el.nativeElement.querySelectorAll('.datepicker');
   
    M.Datepicker.init(elems, {
      format: 'yyyy-mm-dd',
      i18n: {
        cancel: 'Cancelar',
        clear: 'Limpiar',
        done: 'Listo',
        previousMonth: '‹',
        nextMonth: '›',
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        weekdaysAbbrev: ['D', 'L', 'M', 'M', 'J', 'V', 'S']
      }
    });
  
    const elem = this.el.nativeElement.querySelector('#datepicker');
  
    const instance = M.Datepicker.init(elem, {
      format: 'yyyy-mm-dd',
      defaultDate: new Date(),
      i18n: {
        cancel: 'Cancelar',
        clear: 'Limpiar',
        done: 'Listo',
        previousMonth: '‹',
        nextMonth: '›',
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        weekdaysAbbrev: ['D', 'L', 'M', 'M', 'J', 'V', 'S']
      },
      onSelect: (date: Date) => {
        this.FechaReservas = date;
        this.FechaReservas = this.FechaReservas.toISOString().split('T')[0];
        console.log(this.FechaReservas);
      }
    });
    
    instance.open();
  }
  setFechaReserva( ) {
    console.log("Valor de la variable idioma:", this.idioma);
    if(this.idioma==1){
      console.log("h")
      this.calendarioEs();

    } else if(this.idioma==2){
    console.log("k")    
    this.calendarioEn();
    }
  }
  
  MostrarReservas() {
    this.ReservacionService.tabla_reservas(this.FechaReservas)
      .subscribe((resReserva: any) => {
        this.DatosTabla = resReserva;
        console.log(this.DatosTabla);
    });
  }

  cambiarEstadoReserva(dato: any) {
    console.log(dato);
    console.log('Cambiar estado de reserva para:', dato);
    console.log('Nuevo estado de reserva:', dato.EstadoReserva);
  }

  modalActualizarDatos(datos: any) {
    // this.Prueba.EstadoReserva = 'Confirmada';
    this.ID_aux = datos;
    const modalElem = this.el.nativeElement.querySelector('#modalActualizarReservacion');
    M.Modal.init(modalElem);
    const modalInstance = M.Modal.getInstance(modalElem);
    modalInstance.open();
    const selectHora = this.el.nativeElement.querySelectorAll('select');
    M.FormSelect.init(selectHora);
    const selectHoraInstance = M.Modal.getInstance(selectHora);

  }

  setEstadoReserva(Estado: any) {
    this.Prueba.EstadoReserva = Estado;
  }

  setEstadoPago(Estado: any) {
    this.Pago = Estado;
  }

  guardarCambios(){
    console.log('EN FUNCION GUARDAR CAMBIOS');
    console.log(this.Prueba.EstadoReserva);
    console.log(this.Pago);
    const estadoReservaJSON = {
      EstadoReserva: this.Prueba.EstadoReserva
    };

    const estadoPagoJSON = {
      EstadoPago: this.Pago
    };

    if(estadoReservaJSON.EstadoReserva != ''){
      this.ReservacionService.modificar_estado_reserva(this.ID_aux, estadoReservaJSON).subscribe((res: any) =>{
        console.log(res);
    });
    }

    if(estadoPagoJSON.EstadoPago != null){
      this.ReservacionService.modificar_estado_reserva(this.ID_aux, estadoPagoJSON).subscribe((res: any) =>{
        console.log(res);
      }); 
    }

    this.MostrarReservas();

    this.ReservacionService.tabla_reservas(this.FechaReservas).subscribe((resReserva: any) => {
      this.DatosTabla = resReserva;
      console.log('Datos tabla actualizados...');
      console.log(this.DatosTabla);
    });
  }

  setBookingDetails(id_reserva: any) {
    this.ReservacionService.mostrar_detalles_reservacion(id_reserva).subscribe((resDetails: any) => {
      this.booking_details = resDetails;
    });
    this.modalAbrirDetalles()
  }

  modalAbrirDetalles() {
    const modalElem = this.el.nativeElement.querySelector('#MostrarDetalles');
    M.Modal.init(modalElem);
    const modalInstance = M.Modal.getInstance(modalElem);
    modalInstance.open();
  }
  
  
}