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
  subiendoImagen = false;
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

  // SEGURIDAD [IMG-HAB-01]: validar antes de crear registros en MySQL.
  // La validación definitiva del contenido sigue en imagen.ts (puerto 3002).
  async cargandoImagen(archivo: any): Promise<void> {
    if (this.subiendoImagen) return;

    this.imgHabitacion = null;
    this.liga = environment.API_URI_IMAGES;

    const idHabitacion = Number(this.room.IDHabitacion);
    if (!Number.isSafeInteger(idHabitacion) || idHabitacion <= 0) {
      await Swal.fire({ icon: 'error', title: 'Habitación inválida',
        text: 'Selecciona una habitación válida antes de agregar fotografías.' });
      return;
    }

    const archivos: File[] = Array.from(archivo?.files || []) as File[];
    if (archivos.length === 0) return;

    const formatosPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_BYTES = 5 * 1024 * 1024;

    // Validar toda la selección antes de insertar el primer registro.
    for (const imagen of archivos) {
      if (!formatosPermitidos.includes(imagen.type)) {
        await Swal.fire({ icon: 'error', title: 'Formato no permitido',
          text: 'Solo se admiten fotografías JPEG, PNG o WebP.' });
        return;
      }
      if (imagen.size === 0 || imagen.size > MAX_BYTES) {
        await Swal.fire({ icon: 'error', title: 'Tamaño no permitido',
          text: 'Cada fotografía debe tener un máximo de 5 MiB.' });
        return;
      }
    }

    this.subiendoImagen = true;
    let subidas = 0;

    try {
      // SEGURIDAD [IMG-HAB-02]: procesar secuencialmente.
      // Evita reutilizar un insertId compartido entre solicitudes simultáneas.
      for (const imagen of archivos) {
        let idFotoCreada: number | null = null;

        try {
          const contenido = await this.getFileBlob(imagen);

          // 1. Crear referencia en MySQL y capturar el ID de ESTA foto.
          const respuesta: any = await this.HabitacionesService
            .insertar_id_foto({ id: idHabitacion }).toPromise();
          const idFoto = Number(respuesta?.insertId);

          if (!Number.isSafeInteger(idFoto) || idFoto <= 0) {
            throw new Error('La API no devolvió un id_foto válido.');
          }
          idFotoCreada = idFoto;

          // 2. Guardar archivo usando el JWT agregado por AuthInterceptor.
          // imagen.ts comprueba rol Administrador, Magic Numbers y contenido real.
          await this.imagenesService
            .guardarImagen(idFoto, 'habitaciones', contenido).toPromise();

          this.imgHabitacion = contenido;
          subidas++;
        } catch (error) {
          console.error('Error al subir una fotografía de habitación:', error);

          // SEGURIDAD [IMG-HAB-03]: compensación de mejor esfuerzo.
          // Si falló el guardado, intentar limpiar el archivo y su referencia.
          // No es una transacción atómica entre MySQL y el sistema de archivos.
          if (idFotoCreada !== null) {
            try {
              await this.imagenesService
                .deleteImagen(idFotoCreada, 'habitaciones').toPromise();
            } catch (errorArchivo) {
              // Puede ser 404 cuando el archivo nunca llegó a guardarse.
              if (!(errorArchivo && (errorArchivo as any).status === 404)) {
                console.warn('No se pudo confirmar la limpieza del archivo.', errorArchivo);
              }
            }
            try {
              await this.HabitacionesService
                .eliminar_datos_foto(idFotoCreada).toPromise();
            } catch (errorBD) {
              console.error('No se pudo limpiar la referencia en MySQL.', errorBD);
            }
          }

          await Swal.fire({
            icon: 'error',
            title: 'No se pudo subir una fotografía',
            text: `Se guardaron ${subidas} de ${archivos.length} fotografías. Revisa el error y vuelve a intentarlo.`
          });
          break;
        }
      }

      if (subidas > 0) {
        // Actualizar listas solo al finalizar las operaciones.
        this.HabitacionesService.mostrar_todas_habitaciones()
          .subscribe((habitaciones: any) => { this.habitaciones = habitaciones; });
        this.HabitacionesService.id_fotos_por_habitacion(idHabitacion)
          .subscribe((fotos: any) => {
            this.lista_fotos = fotos;
            this.onePicture = this.lista_fotos.length ? this.lista_fotos[0] : null;
          });
        if (subidas === archivos.length) {
          await Swal.fire({ icon: 'success', title: 'Fotografías cargadas',
            text: `Se guardaron correctamente ${subidas} fotografía(s).` });
        }
      }
    } finally {
      this.subiendoImagen = false;
      // Permite volver a seleccionar el mismo archivo si se necesita.
      if (archivo) archivo.value = '';
    }
  }

  // SEGURIDAD [IMG-HAB-04]: convertir a data URL manejando fallos de lectura.
  getFileBlob(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Error leyendo el archivo.'));
      reader.onload = () => {
        if (typeof reader.result === 'string') resolve(reader.result);
        else reject(new Error('Contenido de imagen inválido.'));
      };
      reader.readAsDataURL(file);
    });
  }

  // IMPORTANTE: este parámetro es id_foto, NO el ID de la habitación.
  // SEGURIDAD [IMG-HAB-05]: no lanzar ambas eliminaciones a la vez
  // ni recargar la página antes de verificar los resultados.
  async eliminaImagen(idFotoRecibida: any): Promise<void> {
    const idFoto = Number(idFotoRecibida);
    if (!Number.isSafeInteger(idFoto) || idFoto <= 0) {
      await Swal.fire({ icon: 'error', title: 'Fotografía inválida' });
      return;
    }

    const confirmacion = await Swal.fire({
      title: '¿Eliminar fotografía?',
      text: 'Esta acción eliminará la imagen de la habitación.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!confirmacion.isConfirmed) return;

    try {
      // 1. Eliminar primero el archivo real (puerto 3002).
      // Si el archivo ya no existe, permitir limpiar una referencia huérfana.
      try {
        await this.imagenesService
          .deleteImagen(idFoto, 'habitaciones').toPromise();
      } catch (error) {
        if (!(error && (error as any).status === 404)) throw error;
      }

      // 2. Solo después, borrar el registro de fotos_habitaciones.
      await this.HabitacionesService.eliminar_datos_foto(idFoto).toPromise();

      this.lista_fotos = this.lista_fotos.filter(
        (foto: any) => Number(foto.id_foto) !== idFoto
      );
      this.onePicture = this.lista_fotos.length ? this.lista_fotos[0] : null;
      await Swal.fire({ icon: 'success', title: 'Fotografía eliminada' });
    } catch (error) {
      console.error('Error eliminando fotografía:', error);
      await Swal.fire({ icon: 'error', title: 'No se pudo eliminar la fotografía',
        text: 'Se detuvo la operación. Verifica el estado del archivo y de MySQL.' });
    }
  }

}
