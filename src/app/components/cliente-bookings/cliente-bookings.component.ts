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
  booking_details: any[] = [];
  booking_option: string = 'todas';
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

  setBookingsSelected(): void {

    this.bookings_selected = [];

    this.fechaActual = formatDate(
      new Date(),
      'yyyy-MM-dd',
      'en-US'
    );

    // Mostrar todas las reservaciones.
    if (this.booking_option === 'todas') {
      this.bookings_selected = [...this.booking_list];
      return;
    }

    this.booking_list.forEach((reserva) => {

      const fechaEntrada = String(reserva.FechaEntrada).slice(0, 10);
      const fechaSalida = String(reserva.FechaSalida).slice(0, 10);

      if (this.booking_option === 'pasadas') {

        // Una reservación deja de estar activa
        // cuando llega su fecha de salida.
        if (fechaSalida <= this.fechaActual) {
          this.bookings_selected.push(reserva);
        }

      } else if (this.booking_option === 'futuras') {

        if (fechaEntrada > this.fechaActual) {
          this.bookings_selected.push(reserva);
        }

      } else if (this.booking_option === 'activas') {

        if (
          fechaEntrada <= this.fechaActual &&
          fechaSalida > this.fechaActual &&
          reserva.EstadoReserva !== 'Cancelado'
        ) {
          this.bookings_selected.push(reserva);
        }

      }
    });
  }

  // SEGURIDAD [RES-ANG-01]:
  // Actualizar el listado cuando finaliza
  // correctamente la consulta al backend.

  setReservaciones(): void {

    this.ReservacionService
      .mostrar_reservaciones_por_IDCuenta(this.id_user)
      .subscribe({

        next: (resReservaciones: any) => {

          this.booking_list = Array.isArray(resReservaciones)
            ? resReservaciones
            : [];

          // Filtrar después de recibir los datos.
          this.setBookingsSelected();
        },

        error: (error: any) => {

          this.booking_list = [];
          this.bookings_selected = [];

          Swal.fire({
            title: 'Error',
            text: error.status === 403
              ? 'No tienes autorización para consultar estas reservaciones.'
              : 'No se pudieron cargar tus reservaciones.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }

      });
  }

  // SEGURIDAD [RES-ANG-02]:
  // Mostrar detalles únicamente después de
  // recibir correctamente la respuesta.

  setBookingDetails(id_reserva: any): void {

    this.ReservacionService
      .mostrar_detalles_reservacion(id_reserva)
      .subscribe({

        next: (resDetails: any) => {

          this.booking_details = resDetails;

          // Abrir el modal con los datos recibidos.
          this.modalAbrirDetalles();
        },

        error: (error: any) => {

          Swal.fire({
            title: 'Error',
            text: error.status === 403
              ? 'No tienes permiso para consultar esta reservación.'
              : 'No se pudieron obtener los detalles de la reservación.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }

      });
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

  
  cancelarReservacion(
    id: number,
    _FechaEntrada: string,
    _FechaSalida: string
  ): void {

    Swal.fire({
      title: '¿Seguro que deseas cancelar esta reservación?',
      text: 'No es posible revertir esta operación.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, quiero cancelar',
      cancelButtonText: 'No'
    }).then((result) => {

      if (!result.isConfirmed) {
        return;
      }

      // SEGURIDAD [RES-CANCEL-01]:
      // Express realiza la cancelación y la devolución
      // de disponibilidad dentro de una transacción.
      this.ReservacionService
        .cancelar_reservacion_segura(id)
        .subscribe({

          next: () => {

            Swal.fire({
              title: 'Reservación cancelada',
              icon: 'success',
              confirmButtonText: 'Ok'
            });

            this.setReservaciones();
          },

          error: (error: any) => {

            Swal.fire({
              title: 'No se pudo cancelar',
              text: error.error?.mensaje ||
                'Ocurrió un error al cancelar la reservación.',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          }
        });
    });
  }


}
