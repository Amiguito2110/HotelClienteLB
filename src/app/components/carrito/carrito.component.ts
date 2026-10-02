import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { ReservacionService } from 'src/services/reservacion.service';
import { nuevaReservacion } from 'src/app/models/nuevaReservacion';
import { CarritoService } from 'src/services/carrito.service';
import { carrito } from 'src/app/models/carrito';
import { detallecarrito } from 'src/app/models/detalleCarrito';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { CambioIdiomaService } from 'src/services/cambio-idioma.service';
import Swal from 'sweetalert2';

declare var M: any;

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements AfterViewInit {
  booking = new nuevaReservacion();
  carrito_copia = new carrito();
  detalle_carrito_copia: detallecarrito[] = [];
  habitacionesSeleccionadas: any[] = [];
  reservas_carrito: carrito[] = [];
  reservas_filtrado: carrito[] = [];
  reservas_canceladas: carrito[] = [];
  reservas_carrito_show: carrito[] = [];
  IDCuenta: number;
  detallesCarrito: detallecarrito[] = [];
  detallesCarrito2: detallecarrito[] = [];
  HoraElegida: string;
  pageSize: number;
  p: number;
  flagCheck: number;
  rango = {
    FechaUno: '',
    FechaDos: '',
  };
  disponibilidad: any;
  lenght: any;
  lenght2: any;
  idioma: any;
  mensaje:any;
  constructor(private ReservacionService: ReservacionService, private CarritoService: CarritoService, private el: ElementRef, private cambioIdiomaService: CambioIdiomaService) {
    this.idioma = localStorage.getItem("idioma");
    if(this.idioma==1){
      this.mensaje={
        title: 'Reservación hecha',
        text: 'Gracias por su preferencia. Le esperamos.',
    };

    }else{
      this.mensaje={
        title: "Reservation made",
        text: "Thank you for your preference. We look forward to seeing you."
      };
    }
    this.cambioIdiomaService.currentMsg$.subscribe(
      (msg) => {
          this.idioma = msg;
          console.log("idioma actual:", this.idioma, " aaaa");
      });
    this.HoraElegida = '';
    this.flagCheck = 0;
    this.p = 1;
    this.pageSize = 3;
    let cont = 0;
    this.lenght = 0;
    this.IDCuenta = Number(localStorage.getItem('IDCuenta'));

    this.CarritoService.filtrar_carrito(this.IDCuenta).subscribe((resCarrito: any) => {
      this.reservas_carrito = resCarrito;
      this.CarritoService.mostrar_carrito(this.IDCuenta).subscribe((resFiltrado: any) => {
        this.reservas_filtrado = resFiltrado;
      });
    });

    this.CarritoService.mostrar_carrito_no_disponibles(this.IDCuenta).subscribe((resCanceladas: any) => {
      this.reservas_canceladas = resCanceladas;
    }); 


    // this.CarritoService.mostrar_carrito(this.IDCuenta).subscribe((reservas: any) => {
    //   this.reservas_carrito = reservas;
    //   this.lenght = this.reservas_carrito.length;
    //   this.CarritoService.filtrar_carrito(this.IDCuenta).subscribe((resCarrito: any) => {
    //     this.reservas_carrito2 = resCarrito;
    //     this.lenght2 = this.reservas_carrito2.length;        
    //     if (this.lenght != this.lenght2) {
    //       console.log("Se han eliminado: ", this.lenght - this.lenght2);
    //       Swal.fire({
    //         title: 'Atención',
    //         text: 'Se han eliminado ' + (this.lenght - this.lenght2) + "debido a falta de disponibilidad.",
    //         icon: 'warning',
    //         confirmButtonText: 'Ok'
    //       });
    //     }
    //   });
    // });

    // this.CarritoService.mostrar_carrito(this.IDCuenta).subscribe((resCarrito: any) => {
    //   this.reservas_carrito = resCarrito;
    //   console.log("reservas_carrito", this.reservas_carrito);
    //   for (const reserva of this.reservas_carrito) {
    //     console.log("for reservas_carrito");
    //     this.rango.FechaUno = reserva.FechaEntrada;
    //     this.rango.FechaDos = reserva.FechaSalida;
    //     console.log("Reserva: ", reserva);
    //     this.CarritoService.mostrar_detalle_carrito(reserva.IDCarrito).subscribe((resDetalles: any) => {
    //       this.detallesCarrito2 = resDetalles;
    //       console.log("Detalles", this.detallesCarrito2);
    //       this.ReservacionService.mostrar_habitaciones_num_disponibilidad(this.rango).subscribe((resDisponibilidad: any) => {
    //         this.disponibilidad = resDisponibilidad;
    //         console.log("Disponibilidad: ", this.disponibilidad);
    //         for(const detalle of this.detallesCarrito2){
    //           console.log("Mostrando un solo detalle", detalle);
    //           for(const dispo of this.disponibilidad){
    //             console.log("Mostrando una sola tupla de disponibilidad", dispo);
    //             console.log(detalle.IDHabitacion, dispo.IDHabitacion, detalle.IDHabitacion == dispo.IDHabitacion);
    //             if(detalle.IDHabitacion == dispo.IDHabitacion){
    //               console.log(!(dispo.MinDisponibles < detalle.CantidadHabitaciones));
    //               if(!(dispo.MinDisponibles >= detalle.CantidadHabitaciones)){
    //                 this.flagCheck = 1;
    //                 this.reservas_carrito_show.push(reserva);
    //                 console.log("RESERVA OK", reserva);

    //               }
    //             }
    //           }
    //         }
    //       });
    //     });
    //   }
    //   this.reservas_carrito = this.reservas_carrito_show;
    // });
  }

  ngAfterViewInit(): void { }

  hacer_reservacion_2() {
    console.log(this.booking.HoraLlegada);
    this.booking.IDCuenta = Number(localStorage.getItem('IDCuenta'))
    this.booking.FechaEntrada = this.carrito_copia.FechaEntrada;
    this.booking.FechaSalida = this.carrito_copia.FechaSalida
    //HACER FILTRADO DE HABITACIONES SELECCIONADAS
    this.habitacionesSeleccionadas = this.habitacionesSeleccionadas.filter(json => json.CantidadHabitaciones !== 0);
    this.booking.detallesReserva = this.habitacionesSeleccionadas;
    this.booking.CostoTotal = this.carrito_copia.CostoTotal;
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
        this.CarritoService.eliminar_del_carrito(this.carrito_copia.IDCarrito).subscribe((resEliminar: any) => {
          console.log('Carrito eliminado con ID:', this.carrito_copia.IDCarrito);
        })
      }
      )
  }

  setBookingDetails(id_carrito: any) {
    this.CarritoService.mostrar_detalle_carrito(id_carrito).subscribe((resDetails: any) => {
      this.detallesCarrito = resDetails;
    });
    this.modalMostrarDetalles()
  }

  modalMostrarDetalles() {
    const modalElem = this.el.nativeElement.querySelector('#MostrarDetalles');
    M.Modal.init(modalElem);
    const modalInstance = M.Modal.getInstance(modalElem);
    modalInstance.open();
  }

  modalHacerReservacion(reserva: any) {
    this.carrito_copia = reserva;
    this.CarritoService.mostrar_detalle_carrito(this.carrito_copia.IDCarrito).subscribe((resDetalle: any) => {
      this.detalle_carrito_copia = resDetalle;
      console.log("MOSTRANDO DETALLE DEL CARRITO SELECCIONADO", resDetalle);
      this.habitacionesSeleccionadas = this.detalle_carrito_copia;
      console.log('ESTE ES IMPORTANTE', this.detalle_carrito_copia);
      console.log('Este es el importante tambien', this.habitacionesSeleccionadas)
      const modalElem = this.el.nativeElement.querySelector('#modalReservacion');
      M.Modal.init(modalElem);
      const modalInstance = M.Modal.getInstance(modalElem);
      const selectHora = this.el.nativeElement.querySelectorAll('select');
      M.FormSelect.init(selectHora);
      const selectHoraInstance = M.Modal.getInstance(selectHora);
      modalInstance.open();
    });
  }

  setHora(time: any) {
    this.booking.HoraLlegada = time
    console.log(this.HoraElegida);
  }
}


// for (const reserva of resCarrito) {
//   this.rango.FechaUno = reserva.FechaEntrada;
//   this.rango.FechaDos = reserva.FechaSalida;
//   this.CarritoService.mostrar_detalle_carrito(reserva.IDCarrito).subscribe((resDetails: any) => {
//     this.detallesCarrito2 = resDetails;
//     console.log("detalle carrito 2: ", this.detallesCarrito2);
//     this.ReservacionService.mostrar_habitaciones_num_disponibilidad(this.rango).subscribe((resDetails: any) => {
//       console.log("Disponibilidad para verificar: ", resDetails);
//       for (const detalle of resDetails) {
//         this.flagCheck = 0
//         console.log("Entrando al for");
//         if (detalle.IDHabitacion == resDetails.IDHabitacion) {
//           this.flagCheck = 1;
//           if (detalle.MinDisponibles < resDetails.CantidadHabitaciones) {
//             delete resCarrito[cont]
//             console.log("No se puede hacer la reservacion:");
//           }
//         }
//         console.log("Imprimiendo una por una: ", detalle);
//       }
//       if (this.flagCheck == 0) {
//         console.log("No se puede hacer la reservacion ", resDetails.TipoHabitacion);
//         delete resCarrito[cont]
//       }
//       console.log("Contenido final: ",resCarrito);
//     });
//     this.reservas_carrito = resCarrito;
//     console.log("CONTENIDO DE CARRITO: ", this.reservas_carrito);
//   });
//   cont++;
// }
