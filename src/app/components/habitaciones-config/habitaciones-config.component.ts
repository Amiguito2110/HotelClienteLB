import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { habitacion } from 'src/app/models/habitaciones';
import { HabitacionesService } from 'src/services/habitaciones.service';
import { ImagenesService } from 'src/services/imagenes.service';
import { environment } from 'src/environments/environment';
import { fotos_habitacion } from 'src/app/models/fotos_habitacion';
import Swal from 'sweetalert2';
import { CambioIdiomaService } from 'src/services/cambio-idioma.service';

declare var M: any;
declare var $: any;

@Component({
  selector: 'app-habitaciones-config',
  templateUrl: './habitaciones-config.component.html',
  styleUrls: ['./habitaciones-config.component.css']
})
export class HabitacionesConfigComponent implements AfterViewInit {
  habitaciones: habitacion[] = [];
  room = new habitacion;
  modalInstance: any;
  flag_foto = 0;
  imgHabitacion: any;
  liga = '';
  fileToUpload: any;
  insertedID: any;
  lista_fotos: fotos_habitacion[] = [];
  onePicture: any;
  idioma: any;
  mensaje: any;
  constructor(private imagenesService: ImagenesService, private HabitacionesService: HabitacionesService, private el: ElementRef, private cambioIdiomaService: CambioIdiomaService) {
    this.idioma = localStorage.getItem("idioma");
    console.log("idioma", this.idioma)
    this.cambioIdiomaService.currentMsg$.subscribe(
      (msg) => {
        if (msg != '') {
          this.idioma = msg;
        }
        console.log("idioma actual:", this.idioma, " aaaa");
      });
    if (this.idioma == 1) {
      this.mensaje = {
        creacion: 'Habitacion creada.',
        edicion: 'Habitacion modificada.',
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        confirmButtonText: "Sí, eliminar",
        confirmation: "¡Eliminado!",
        message: "La habitación ha sido eliminada.",
        error: "No se pudo eliminar la habitación"
      };

    } else {
      this.mensaje = {
        creacion: 'Room created.',
        edicion: 'Room modified.',
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        confirmButtonText: "Yes, delete",
        confirmation: "Deleted!",
        message: "The room has been deleted.",
        error: "The room could not be deleted."
      };
    }
    this.HabitacionesService.mostrar_todas_habitaciones().subscribe((resHabitaciones: any) => {
      this.habitaciones = resHabitaciones;
    });
    this.liga = environment.API_URI_IMAGES;
  }

  ngAfterViewInit(): void {

  }

  actualizarHabitacion(selectedRoom: any) {
    this.room = selectedRoom;
    console.log(this.room)
    const modalElem = this.el.nativeElement.querySelector('#editPersonalModal');
    M.Modal.init(modalElem);
    const modalInstance = M.Modal.getInstance(modalElem);
    modalInstance.open();
  }

  guardar_cambios(room_id: any) {
    this.room.IDHabitacion = room_id;
    this.HabitacionesService.actualizar_habitacion(this.room.IDHabitacion, this.room).subscribe((resHabitacion: any) => {
      console.log(resHabitacion);
      Swal.fire({
        title: this.mensaje.edicion,
        icon: 'success',
        confirmButtonText: 'Ok'
      });
      //}
      this.HabitacionesService.mostrar_todas_habitaciones().subscribe((resHabitaciones: any) => {
        this.habitaciones = resHabitaciones;
      });

      const modalElem = this.el.nativeElement.querySelector('#editPersonalModal');
      M.Modal.init(modalElem);
      const modalInstance = M.Modal.getInstance(modalElem);
      modalInstance.close();
    });
  }


  abrirModalCrearHabitacion() {
    const modalElem = this.el.nativeElement.querySelector('#crearHabitacionModal');
    M.Modal.init(modalElem);
    const modalInstance = M.Modal.getInstance(modalElem);
    modalInstance.open();
  }

  crearHabitacion() {
    this.HabitacionesService.crear_habitacion(this.room).subscribe((resHabitacion: any) => {
      console.log(resHabitacion);
      Swal.fire({
        title: this.mensaje.creacion,
        icon: 'success',
        confirmButtonText: 'Ok'
      });
      this.HabitacionesService.mostrar_todas_habitaciones().subscribe((resHabitaciones: any) => {
        this.habitaciones = resHabitaciones;
      });
    });
  }

  eliminarHabitacion(idHabitacion: number) {

    Swal.fire({
      title: this.mensaje.title,
      text: this.mensaje.text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.mensaje.confirmButtonText
    }).then((result) => {
      if (result.isConfirmed) {
        this.HabitacionesService.eliminar_habitacion(idHabitacion).subscribe(() => {
          Swal.fire(
            this.mensaje.confirmation,
            this.mensaje.message,
            'success'
          );
          this.HabitacionesService.mostrar_todas_habitaciones().subscribe((resHabitaciones: any) => {
            this.habitaciones = resHabitaciones;
          });
        }, error => {
          Swal.fire(
            'Error',
            this.mensaje.error,
            'error'
          );
        });
      }
    });

    this.HabitacionesService.mostrar_todas_habitaciones().subscribe((resHabitaciones: any) => {
      this.habitaciones = resHabitaciones;
    });
  }


  mostrar_todas_fotos(id: any) {
    this.HabitacionesService.id_fotos_por_habitacion(id).subscribe((resLista: any) => {
      this.lista_fotos = resLista;
      console.log("lista_fotoooooos: ", this.lista_fotos);
      this.onePicture = this.lista_fotos[0];
      $('#Mostrar_fotos').modal();
      $("#Mostrar_fotos").modal("open");
    }, err => console.error(err));
  }

  cargandoImagen(archivo: any) {
    this.imgHabitacion = null;
    this.liga = environment.API_URI_IMAGES;

    for (let i = 0; i < archivo.files.length; i++) {
      console.log("Enviando foto numero: ", i);
      this.fileToUpload = archivo.files.item(i);
      let imgPromise = this.getFileBlob(this.fileToUpload);
      imgPromise.then(blob => {
        console.log("convirtiendo imagen")

        const id = {
          id: this.room.IDHabitacion
        }

        this.HabitacionesService.insertar_id_foto(id).subscribe((resDatos: any) => {
          console.log(resDatos);
          this.insertedID = resDatos.insertId;
          console.log("Tupla ", this.insertedID);
          this.imagenesService.guardarImagen(this.insertedID, "habitaciones", blob).subscribe(
            (res: any) => {
              this.imgHabitacion = blob;
              this.HabitacionesService.mostrar_todas_habitaciones().subscribe((resHabitaciones: any) => {
                this.habitaciones = resHabitaciones;
              }, err => console.error(err));
            },
            err => console.error(err));
        });
      });
    }
  }

  getFileBlob(file: any) {
    var reader = new FileReader();
    return new Promise(function (resolve, reject) { //Espera a que se cargue la img
      reader.onload = (function (thefile) {
        return function (e) {
          // console.log(e.target?.result)
          resolve(e.target?.result);
        };

      })(file);
      reader.readAsDataURL(file);
    });
  }

  eliminaImagen(IDHabitacion: any) {
    console.log("entrando con: ",IDHabitacion);
    
    this.HabitacionesService.eliminar_datos_foto(IDHabitacion).subscribe((resEliminar: any) => {
    }, err => console.error(err));

    this.imagenesService.deleteImagen(IDHabitacion, 'habitaciones').subscribe((res) => {
    }, err => console.error(err));

    location.reload();
  }

}




// import { AfterViewInit, Component, ElementRef } from '@angular/core';
// import { habitacion } from 'src/app/models/habitaciones';
// import { HabitacionesService } from 'src/services/habitaciones.service';
// import Swal from 'sweetalert2';

// declare var M: any;

// @Component({
//   selector: 'app-habitaciones-config',
//   templateUrl: './habitaciones-config.component.html',
//   styleUrls: ['./habitaciones-config.component.css']
// })
// export class HabitacionesConfigComponent implements AfterViewInit {
//   habitaciones: habitacion[] = [];
//   room = new habitacion;
//   modalInstance: any;

//   constructor(private HabitacionesService: HabitacionesService, private el: ElementRef) {
//     this.HabitacionesService.mostrar_todas_habitaciones().subscribe((resHabitaciones: any) => {
//       this.habitaciones = resHabitaciones;
//     });
//   }

//   ngAfterViewInit(): void {

//   }

//   actualizarHabitacion(selectedRoom: any) {
//     this.room = selectedRoom;
//     console.log(this.room)
//     const modalElem = this.el.nativeElement.querySelector('#editPersonalModal');
//     M.Modal.init(modalElem);
//     const modalInstance = M.Modal.getInstance(modalElem);
//     modalInstance.open();
//   }

//   guardar_cambios(room_id: any) {
//     this.room.IDHabitacion = room_id;
//     this.HabitacionesService.actualizar_habitacion(this.room.IDHabitacion, this.room).subscribe((resHabitacion: any) => {
//       console.log(resHabitacion);
//       Swal.fire({
//         title: 'Habitación modificada.',
//         icon: 'success',
//         confirmButtonText: 'Ok'
//       });
//       this.HabitacionesService.mostrar_todas_habitaciones().subscribe((resHabitaciones: any) => {
//         this.habitaciones = resHabitaciones;
//       });

//       const modalElem = this.el.nativeElement.querySelector('#editPersonalModal');
//       M.Modal.init(modalElem);
//       const modalInstance = M.Modal.getInstance(modalElem);
//       modalInstance.close();
//     });
//   }

//   abrirModalCrearHabitacion() {
//     const modalElem = this.el.nativeElement.querySelector('#crearHabitacionModal');
//     M.Modal.init(modalElem);
//     const modalInstance = M.Modal.getInstance(modalElem);
//     modalInstance.open();
//   }

//   crearHabitacion() {
//     this.HabitacionesService.crear_habitacion(this.room).subscribe((resHabitacion: any) => {
//       console.log(resHabitacion);
//       Swal.fire({
//         title: 'Habitación creada.',
//         icon: 'success',
//         confirmButtonText: 'Ok'
//       });
//       this.HabitacionesService.mostrar_todas_habitaciones().subscribe((resHabitaciones: any) => {
//         this.habitaciones = resHabitaciones;
//       });
//     });
//   }

//   eliminarHabitacion(idHabitacion: number) {
//     Swal.fire({
//       title: '¿Estás seguro?',
//       text: '¡No podrás revertir esto!',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Sí, eliminar'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this.HabitacionesService.eliminar_habitacion(idHabitacion).subscribe(() => {
//           Swal.fire(
//             '¡Eliminado!',
//             'La habitación ha sido eliminada.',
//             'success'
//           );
//           this.HabitacionesService.mostrar_todas_habitaciones().subscribe((resHabitaciones: any) => {
//             this.habitaciones = resHabitaciones;
//           });
//         }, error => {
//           Swal.fire(
//             'Error',
//             'No se pudo eliminar la habitación.',
//             'error'
//           );
//         });
//       }
//     });

//     this.HabitacionesService.mostrar_todas_habitaciones().subscribe((resHabitaciones: any) => {
//       this.habitaciones = resHabitaciones;
//     });
//   }


// }


