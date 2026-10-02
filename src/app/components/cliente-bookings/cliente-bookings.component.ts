import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router'
import { cuentaNueva } from 'src/app/models/cuentaNueva';
import { cuenta } from 'src/app/models/cuentas';
import { reservacion } from 'src/app/models/reservaciones';
import { CuentaService } from 'src/services/cuenta.service';
import { ReservacionService } from 'src/services/reservacion.service';
import { detallesReserva } from 'src/app/models/detallesReserva';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { update_disponibilidad } from 'src/app/models/updateDisponibilidad';
import { CambioIdiomaService } from 'src/services/cambio-idioma.service';
declare var M: any;

@Component({
  selector: 'app-cliente-bookings',
  templateUrl: './cliente-bookings.component.html',
  styleUrls: ['./cliente-bookings.component.css']
})

export class ClienteBookingsComponent implements AfterViewInit {
  id_user = 0;
  booking_list: reservacion[] = [];
  booking_details: any;
  booking_option: any;
  bookings_selected: reservacion[] = [];
  fechaActual: any;
  datosJSON: detallesReserva[] = [];
  update: update_disponibilidad [] = [];
  idioma:any;
  constructor(private ReservacionService: ReservacionService, private CuentaService: CuentaService, private Router: Router, private el: ElementRef, private cambioIdiomaService: CambioIdiomaService) {
    this.idioma = localStorage.getItem("idioma");
    this.cambioIdiomaService.currentMsg$.subscribe(
      (msg) => {
          this.idioma = msg;
          console.log("idioma actual:", this.idioma, " aaaa");
      });
    this.id_user = Number(localStorage.getItem('IDCuenta'))
    console.log(this.id_user);
    this.setReservaciones()
    this.setBookingsSelected()
  }

  setBookingsSelected() {
    this.bookings_selected = []
    this.fechaActual = formatDate(new Date(), 'yyyy-MM-dd', 'en-US')
    // this.fechaActual = formatDate(new Date(), 'dd-MM-yyyy', 'en-US')
    const fechaFormateada = this.fechaActual.replace(/-/g, '');
    console.log(fechaFormateada);

    console.log(this.booking_option == 'activas');
    console.log(this.fechaActual);

    if (this.booking_option == 'pasadas') {
      this.booking_list.forEach(reservacion => {
        if (Number(reservacion.FechaSalida.replace(/-/g, '')) < Number(fechaFormateada)) {
          this.bookings_selected.push(reservacion)
        }
      });
    } else if (this.booking_option == 'futuras') {
      this.booking_list.forEach(reservacion => {
        if (Number(reservacion.FechaEntrada.replace(/-/g, '')) > Number(fechaFormateada)) {
          this.bookings_selected.push(reservacion)
        }
      });

    } else if (this.booking_option == 'activas') {
      this.booking_list.forEach(reservacion => {
        if (Number(reservacion.FechaEntrada.replace(/-/g, '')) <= Number(fechaFormateada) && Number(reservacion.FechaSalida.replace(/-/g, '')) > Number(fechaFormateada)) {
          this.bookings_selected.push(reservacion)
        }
      });
    }
  }

  setReservaciones() {
    this.ReservacionService.mostrar_reservaciones_por_IDCuenta(this.id_user).subscribe((resReservaciones: any) => {
      console.log('resReservaciones', resReservaciones);
      this.booking_list = resReservaciones;
    });
    console.log('Reservaciones: ', this.booking_list);
    this.setBookingsSelected();
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

  ngAfterViewInit(): void {
    const filtroReservaciones = this.el.nativeElement.querySelectorAll('select');
    M.FormSelect.init(filtroReservaciones);
    const selectHoraInstance = M.Modal.getInstance(filtroReservaciones)
    var selectReservaciones = document.getElementById('filtroReservaciones');
    console.log(selectReservaciones);
    this.setBookingsSelected();
  }

  setBookingOption(Option: any) {
    this.booking_option = Option;
    console.log('Booking_option:', this.booking_option);
    this.setBookingsSelected()
  }

  cancelarReservacion(id: any, FechaEntrada: string, FechaSalida: string) {

    const estadoReservaJSON = {
      EstadoReserva: 'Cancelado',
      EstadoPago: 'Cancelado'
    };

    const update_aux = {
      CantidadHabitaciones: 0,
      fechaInicio: '',
      fechaFin: '',
      IDHabitacion: 0
    };

    this.ReservacionService.mostrar_detallesReservacion(id).subscribe((resDetails: any) => {
      console.log(resDetails);
      this.datosJSON = resDetails;
    });

    Swal.fire({
      title: "¿Seguro que deseas cancelar esta reservación?",
      text: "¡No es posible revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, quiero cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.ReservacionService.modificar_estado_reserva(id, estadoReservaJSON).subscribe((res: any) => {
          console.log(res);
        });

        this.datosJSON.forEach(dato =>  {
          update_aux.CantidadHabitaciones = dato.CantidadHabitaciones;
          update_aux.IDHabitacion = dato.IDHabitacion;
          update_aux.fechaInicio = FechaEntrada;
          update_aux.fechaFin = FechaSalida;
          console.log('SE VA A INGRESAR:', update_aux);
          this.ReservacionService.actualizar_despues_de_cancelacion(update_aux).subscribe((res: any)  => {
            console.log(res);
          });
          this.update.push(update_aux);
        });
    
        Swal.fire({
          title: 'Reservación cancelada',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      }

      this.ReservacionService.actualizar_despues_de_cancelacion(this.update).subscribe((res: any)  => {
        console.log(res);
      });

      this.setReservaciones();
      this.setBookingsSelected();
    });
  }

}
