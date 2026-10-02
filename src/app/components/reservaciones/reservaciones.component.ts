import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { habitacion } from 'src/app/models/habitaciones';
import { nuevaReservacion } from 'src/app/models/nuevaReservacion';
import { ReservacionService } from 'src/services/reservacion.service';
import { CarritoService } from 'src/services/carrito.service';
import Swal from 'sweetalert2';
import { nuevocarrito } from 'src/app/models/NuevoCarrito';
import { data } from 'jquery';
import { CambioIdiomaService } from 'src/services/cambio-idioma.service';

declare var M: any;

@Component({
  selector: 'app-reservaciones',
  templateUrl: './reservaciones.component.html',
  styleUrls: ['./reservaciones.component.css'],
})

export class ReservacionesComponent implements AfterViewInit {
  flagCarrito: boolean = false
  habitacionesSeleccionadas: any[] = [];
  reservaciones: any;
  habitaciones = new habitacion();
  fechaInicio: string;
  fechaFinal: string;
  habitacionesDisponibles: any[] = []
  jsonRoom: any;
  room = new habitacion();
  booking = new nuevaReservacion();
  name: string;
  HoraElegida: string;
  url: any;
  CostoTotal: any;
  carrito: nuevocarrito = new nuevocarrito;
  numNoches: any;
  IDCarrito: any;
  prueba: any;
  idioma: any;
  rango = {
    FechaUno:'',
    FechaDos:'',
  }
  mensaje:any;
  constructor(private ReservacionService: ReservacionService, private CarritoService: CarritoService ,private Router: Router, private el: ElementRef, private cambioIdiomaService: CambioIdiomaService) {
    this.idioma = localStorage.getItem("idioma");
    if(this.idioma==1){
      this.mensaje={
        title: 'Reservación hecha',
        text: 'Gracias por su preferencia. Le esperamos.',
    };

    }else{
      this.mensaje={
        title: "Reservation made",
        text: "Thank you for your preference. We look forward to welcoming you."
      };
    }
    this.cambioIdiomaService.currentMsg$.subscribe(
      (msg) => {
          this.idioma = msg;
          console.log("idioma actual:", this.idioma, " aaaa");
      });
    this.fechaInicio = "";
    this.fechaFinal = "";
    this.name = '';  
    this.HoraElegida = '';
    this.url = this.Router.url;
    console.log(this.Router.url);
    this.prueba = new Date();
  }

  setHora(time: any){
    this.booking.HoraLlegada = time
    console.log(this.HoraElegida);
  }

  modalHacerReservacion(){
    const modalElem = this.el.nativeElement.querySelector('#modalReservacion');
    M.Modal.init(modalElem);
    const modalInstance = M.Modal.getInstance(modalElem);
    const selectHora = this.el.nativeElement.querySelectorAll('select');
    M.FormSelect.init(selectHora);
    const selectHoraInstance = M.Modal.getInstance(selectHora);
    modalInstance.open();
  }

  hacer_reservacion_2(){
    console.log(this.booking.HoraLlegada);
    this.booking.IDCuenta = Number(localStorage.getItem('IDCuenta'))
    this.booking.FechaEntrada = this.rango.FechaUno;
    this.booking.FechaSalida = this.rango.FechaDos;
    //HACER FILTRADO DE HABITACIONES SELECCIONADAS
    this.habitacionesSeleccionadas = this.habitacionesSeleccionadas.filter(json => json.CantidadHabitaciones !== 0);
    this.booking.detallesReserva = this.habitacionesSeleccionadas;
    this.booking.CostoTotal = this.CostoTotal;
    console.log('La reservacion con datos: ', this.booking);
    this.ReservacionService.hacer_reservacion_2(this.booking)
      .subscribe((resReserva: any) => {
        console.log(resReserva);
        Swal.fire({
          title: this.mensaje.title,
          text: this.mensaje.text,
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        this.CarritoService.eliminar_del_carrito(this.IDCarrito).subscribe((resEliminar: any) =>{
          console.log('Carrito eliminado con ID:', this.IDCarrito);
        })
        this.Router.navigateByUrl('/home/cliente_bookings');
      }  
    )
  }

  guardar_en_carrito(){
    console.log('habitaciones seleccionadas al entrar en guardar carrito', this.habitacionesSeleccionadas);
    
    this.ReservacionService.setearCostoTotal(this.habitacionesSeleccionadas).subscribe((resCosto: any) => {
      console.log(resCosto);
      this.CostoTotal = resCosto;
      console.log('numero de noches antes de multiplicar', this.numNoches);
      
      this.CostoTotal = this.CostoTotal.costoTotal * this.numNoches;
      console.log('costo total actualizado', this.CostoTotal);
      this.habitacionesSeleccionadas = this.habitacionesSeleccionadas.filter(json => json.CantidadHabitaciones !== 0);
      this.carrito.IDCuenta = Number(localStorage.getItem('IDCuenta'));
      this.carrito.FechaEntrada = this.rango.FechaUno;
      this.carrito.FechaSalida = this.rango.FechaDos;
      this.carrito.CostoTotal = this.CostoTotal;
      console.log('costo total enviado', this.CostoTotal);
      this.carrito.DetalleCarrito = this.habitacionesSeleccionadas;
      this.CarritoService.agregar_Carrito(this.carrito).subscribe((resCarrito: any) => {
        this.IDCarrito = resCarrito.IDCarrito;
        console.log(resCarrito);
      });
      this.flagCarrito = true;
    });
  }

  realizarConsulta() {
    // Llama a tu función de consulta con las fechas actualizadas
    this.rango.FechaUno = this.fechaInicio;
    this.rango.FechaDos = this.fechaFinal;
    this.numNoches = this.calcularNumeroNoches(this.fechaInicio, this.fechaFinal);
    console.log('NUMERO DE NOCHEE', this.numNoches);
    console.log(this.rango);

    this.ReservacionService.mostrar_habitaciones_num_disponibilidad (this.rango)
    .subscribe((resConsulta: any) => {
        resConsulta.forEach((json: any) => {
          console.log('Elemento del arreglo:', json);
        });
        console.log(resConsulta);
        this.habitacionesDisponibles = resConsulta;
      },
      (error) => {
        console.error('Error en la solicitud HTTP:', error);
      }
      
    );

  }

  seleccionarHabitacion(habitacion: any, cantidad: number) {
    const habitacionSeleccionadaIndex = this.habitacionesSeleccionadas
      .findIndex(h => h.IDHabitacion === habitacion.IDHabitacion);
    if (habitacionSeleccionadaIndex !== -1) {
      this.habitacionesSeleccionadas[habitacionSeleccionadaIndex].CantidadHabitaciones = cantidad;
    } else { 
      this.habitacionesSeleccionadas.push({
        IDHabitacion: habitacion.IDHabitacion,
        CantidadHabitaciones: cantidad,
        TipoHabitacion: habitacion.TipoHabitacion,
        CostoUnitario: habitacion.Costo
      });
    }
    console.log(this.habitacionesSeleccionadas);
  }

  ngAfterViewInit(): void {
    this.idioma = localStorage.getItem("idioma");
    this.initModal();
    this.initDatepicker();
    this.initDatepickerIni();
  }
 calendarioEs(){
  const elems = this.el.nativeElement.querySelectorAll('.datepicker');
  M.Datepicker.init(elems, {
    format: 'yyyy-mm-dd',
    i18n: {
      months: [
        'Enero', 'Febrero', 'Marzo', 'Abril',
        'Mayo', 'Junio', 'Julio', 'Agosto',
        'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ],
      monthsShort: [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
      ],
      weekdays: [
        'Domingo', 'Lunes', 'Martes', 'Miércoles',
        'Jueves', 'Viernes', 'Sábado'
      ],
      weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      weekdaysAbbrev: ['D', 'L', 'M', 'M', 'J', 'V', 'S']
    }
  });
 }
 calendarioEn(){
  const elems = this.el.nativeElement.querySelectorAll('.datepicker');
  M.Datepicker.init(elems, {
    format: 'yyyy-mm-dd',
  });
 }

  initDatepicker() {
    console.log("Valor de idioma en calendarioEn:", this.idioma);
    if (this.idioma == 1) {
      this.calendarioEs();
    } else {
      this.calendarioEn();
    }
    
  }

  initModal() {
    const modalElem = this.el.nativeElement.querySelector('#miModal');
    M.Modal.init(modalElem);
  }

  abrirModal() {
    const modalInstance = M.Modal.getInstance(this.el.nativeElement.querySelector('#miModal'));
    modalInstance.open();
  }

  cerrarModal() {
    const modalInstance = M.Modal.getInstance(this.el.nativeElement.querySelector('#miModal'));
    modalInstance.close();
  }

  calendarioEs_inicio(){
    const elemIni = this.el.nativeElement.querySelector('#fechaIni');
    const instanceIni = M.Datepicker.init(elemIni, {
      format: 'yyyy-mm-dd',
      defaultDate: new Date(this.fechaInicio),
      onSelect: (date: Date) => {
        this.actualizarFechaIni(date);
        this.initDatepickerFin();
        instanceIni.close();
      },
      minDate: new Date(),
      i18n: {
        months: [
          'Enero', 'Febrero', 'Marzo', 'Abril',
          'Mayo', 'Junio', 'Julio', 'Agosto',
          'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ],
        monthsShort: [
          'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
          'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
        ],
        weekdays: [
          'Domingo', 'Lunes', 'Martes', 'Miércoles',
          'Jueves', 'Viernes', 'Sábado'
        ],
        weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        weekdaysAbbrev: ['D', 'L', 'M', 'M', 'J', 'V', 'S']
      }
    });

    const elemFin = this.el.nativeElement.querySelector('#fechaFin');
    const instanceFin = M.Datepicker.init(elemFin, {
      format: 'yyyy-mm-dd',
      defaultDate: new Date(this.fechaFinal),
      onSelect: (date: Date) => {
        this.actualizarFechaFin(date);
        instanceFin.close();
      },
      minDate: new Date(this.fechaInicio),
      i18n: {
        months: [
          'Enero', 'Febrero', 'Marzo', 'Abril',
          'Mayo', 'Junio', 'Julio', 'Agosto',
          'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ],
        monthsShort: [
          'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
          'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
        ],
        weekdays: [
          'Domingo', 'Lunes', 'Martes', 'Miércoles',
          'Jueves', 'Viernes', 'Sábado'
        ],
        weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        weekdaysAbbrev: ['D', 'L', 'M', 'M', 'J', 'V', 'S']
      }
    });
  }

  calendarioEn_inicio(){
    const elem = this.el.nativeElement.querySelector('#fechaIni');
    const instance = M.Datepicker.init(elem, {
      format: 'yyyy-mm-dd',
      defaultDate: new Date(this.fechaInicio),
      onSelect: (date: Date) => {
        this.prueba.setDate(date.getDate() + 1);
        this.actualizarFechaIni(date);
        this.initDatepickerFin();
        instance.close();
      },
      minDate: new Date()
    });
  }

  initDatepickerIni() {
    console.log("Valor de idioma en calendarioEn:", this.idioma);
    if (this.idioma == 1) {
      this.calendarioEs_inicio();
    } else {
      this.calendarioEn_inicio();
    }
  
 }
  
  calendarioEn_fin(){
    console.log("En initpicker fin", this.prueba);
    
    const elem = this.el.nativeElement.querySelector('#fechaFin');
    const instance = M.Datepicker.init(elem, {
      format: 'yyyy-mm-dd',
      defaultDate: new Date(this.fechaFinal),
      onSelect: (date: Date) => {
        this.actualizarFechaFin(date);
        instance.close();
      },
      minDate: this.prueba
    }); 
  }

  calendarioEs_fin(){
    const elem = this.el.nativeElement.querySelector('#fechaFin');
    const minDate = new Date(this.fechaInicio);
    minDate.setDate(minDate.getDate() + 1); // Añade un día a la fecha de inicio
    const instance = M.Datepicker.init(elem, {
      format: 'yyyy-mm-dd',
      defaultDate: new Date(this.fechaFinal),
      onSelect: (date: Date) => {
        // Comprueba si la fecha seleccionada es igual o anterior a la fecha de inicio
        if (date <= new Date(this.fechaInicio)) {
          // Muestra un mensaje de error o realiza la acción que consideres apropiada
          console.error("La fecha final debe ser posterior a la fecha de inicio");
          // Puedes mostrar un mensaje de error o deshabilitar el botón de reserva
          return;
        }
  
        // Actualiza la fecha de fin solo si es válida
        this.actualizarFechaFin(date);
        instance.close();
      },
      minDate: minDate, // Establece la fecha mínima como un día después de la fecha de inicio
      setDefaultDate: true, // Esto asegura que la fecha mínima se aplique al abrir el calendario
      i18n: {
        // Configuración de traducción en español
        months: [
          'Enero', 'Febrero', 'Marzo', 'Abril',
          'Mayo', 'Junio', 'Julio', 'Agosto',
          'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ],
        monthsShort: [
          'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
          'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
        ],
        weekdays: [
          'Domingo', 'Lunes', 'Martes', 'Miércoles',
          'Jueves', 'Viernes', 'Sábado'
        ],
        weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        weekdaysAbbrev: ['D', 'L', 'M', 'M', 'J', 'V', 'S']
      }
    }); 
  }
  
  
  initDatepickerFin() {
    console.log("Valor de idioma en calendarioEn:", this.idioma);
    if (this.idioma == 1) {
      this.calendarioEs_fin();
    } else {
      this.calendarioEn_fin();
    }
  }

  actualizarFechaIni(date: Date) {
    this.fechaInicio = date.toISOString().split('T')[0];
    console.log(this.fechaInicio);
  }

  actualizarFechaFin(date: Date) {
    this.fechaFinal = date.toISOString().split('T')[0];
    console.log(this.fechaFinal);
  }

  calcularNumeroNoches(fechaInicio: string, fechaFin: string): number {
    const fechaInicioObj = new Date(fechaInicio);
    const fechaFinObj = new Date(fechaFin);
    const diferencia = fechaFinObj.getTime() - fechaInicioObj.getTime();
    const dias = diferencia / (1000 * 3600 * 24);
    return Math.round(dias);
  }

}