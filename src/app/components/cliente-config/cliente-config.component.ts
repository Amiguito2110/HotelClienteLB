import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CuentaService } from 'src/services/cuenta.service';
import { ReservacionService } from 'src/services/reservacion.service';
import { cuenta } from 'src/app/models/cuentas';
import { environment } from 'src/environments/environment';
import { ImagenesService } from 'src/services/imagenes.service';
import { CambioIdiomaService } from 'src/services/cambio-idioma.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
declare var $: any;
declare var M: any; // Esto es para acceder a las funciones de Materialize directamente


@Component({
  selector: 'app-cliente-config',
  templateUrl: './cliente-config.component.html',
  styleUrls: ['./cliente-config.component.css']
})

export class ClienteConfigComponent implements AfterViewInit, OnInit {
  cuenta = new cuenta();
  password: any;
  datosNuevos = new cuenta();
  checkPass: string;
  //Parte para subir imagen
  liga = '';
  imgUsuario: any;
  fileToUpload: any;
  idioma: any;
  mensaje: any;

  nuevacontrasena: any;
  confirmacion: any;
  constructor(private imagenesService: ImagenesService, private CuentaService: CuentaService, ReservacionService: ReservacionService, private router: Router, private el: ElementRef, private cambioIdiomaService: CambioIdiomaService, private translate: TranslateService) {
    this.idioma = localStorage.getItem("idioma");
    if (this.idioma == 1) {
      this.mensaje = {
        title: "Datos actualizados...",
        imagen: "¡Imagen Actualizada!",
        text: "Se ha actualizado la imagen correctamente",
        title2: "Imagen Eliminada...",
        imagen2:"¡Imagen eliminada!",
        text2: "Se ha eliminado la imagen correctamente",
        imagen3:"¡No hay Imagen a Eliminar!",
        text3: "No hay foto de perfil"
      };

    } else {
      this.mensaje = {
        title: "Data updated",
        imagen: "Image Updated!",
        text: "The image has been updated successfully",

        title2: "Image deleted...",
        imagen2:"¡Image Deleted!",
        text2: "Image deleted sucessfully",
        imagen3:"¡There is no Image!",
        text3: "There is no Profile Image"
      };
    }
    console.log("idioma", this.idioma)
    this.cambioIdiomaService.currentMsg$.subscribe(
      (msg) => {
        if (msg != '') {
          this.idioma = msg;
        }
        console.log("idioma actual:", this.idioma, " aaaa");
      });
    this.cuenta.IDCuenta = Number(localStorage.getItem('IDCuenta'));
    this.cuenta.CorreoElectronico = String(localStorage.getItem('CorreoElectronico'));
    this.password = String(localStorage.getItem('Contrasena'));
    this.cuenta.NombreCompleto = String(localStorage.getItem('NombreUsuario'));
    this.cuenta.NumeroTelefono = String(localStorage.getItem('Telefono'));
    this.cuenta.Foto = Number(localStorage.getItem('Foto'));
    this.checkPass = '';
    this.imgUsuario = null;
    this.fileToUpload = null;
    this.liga = environment.API_URI_IMAGES;

  }
  ngOnInit(): void {
    this.idioma = localStorage.getItem('idioma');
  }

  ngAfterViewInit(): void {


  }

  modificar_nombreModal() {
    const modalElem = this.el.nativeElement.querySelector('#editNombreModal');
    M.Modal.init(modalElem);
    const modalInstance = M.Modal.getInstance(modalElem);
    modalInstance.open();
  }

  modificar_numeroModal() {
    const modalElem = this.el.nativeElement.querySelector('#editNumberModal');
    M.Modal.init(modalElem);
    const modalInstance = M.Modal.getInstance(modalElem);
    modalInstance.open();
  }

  modificar_correoModal() {
    const modalElem = this.el.nativeElement.querySelector('#modificarCorreoModal');
    M.Modal.init(modalElem);
    const modalInstance = M.Modal.getInstance(modalElem);
    modalInstance.open();
  }

  modificar_contrasenaModal() {
    const modalElem = this.el.nativeElement.querySelector('#modificarContrasenaModal');
    M.Modal.init(modalElem);
    const modalInstance = M.Modal.getInstance(modalElem);
    modalInstance.open();
  }

  mostrarImagen(IDCuenta: any) {
    this.CuentaService.mostrarCuenta(this.cuenta.IDCuenta).subscribe((resCuenta: any) => {
      this.cuenta = resCuenta;
      console.log(this.cuenta)
      $('#Imagen').modal();
      $("#Imagen").modal("open");
    }, err => console.error(err));
  }
  // SEGURIDAD [IMG-FRONT-01]: validación temprana en Angular.
  // La validación definitiva se ejecuta en el servidor de imágenes.
  cargandoImagen(archivo: any): void {
    this.imgUsuario = null;
    this.liga = environment.API_URI_IMAGES;

    const seleccionada: File | null = archivo?.files?.item(0) ?? null;
    if (!seleccionada) return;

    const formatos = ['image/jpeg', 'image/png', 'image/webp'];
    if (!formatos.includes(seleccionada.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Formato no permitido',
        text: 'Selecciona una fotografía JPEG, PNG o WebP.'
      });
      return;
    }

    const maxBytes = 5 * 1024 * 1024;
    if (seleccionada.size === 0 || seleccionada.size > maxBytes) {
      Swal.fire({
        icon: 'error',
        title: 'Tamaño no permitido',
        text: 'La fotografía debe tener un tamaño máximo de 5 MB.'
      });
      return;
    }

    this.fileToUpload = seleccionada;
    this.getFileBlob(seleccionada)
      .then((src: string) => {
        this.imagenesService.guardarImagen(this.cuenta.IDCuenta, 'usuarios', src)
          .subscribe({
            next: () => {
              this.imgUsuario = src;
              this.CuentaService.mostrarCuenta(this.cuenta.IDCuenta)
                .subscribe((resCuenta: any) => {
                  this.cuenta = resCuenta;
                });
            },
            error: () => {
              Swal.fire({
                icon: 'error',
                title: 'No se pudo subir la fotografía',
                text: 'El servidor rechazó la imagen o no fue posible guardarla.'
              });
            }
          });
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Error de lectura',
          text: 'No fue posible leer el archivo seleccionado.'
        });
      });
  }

  modificar_datos_Nombre() {
    this.CuentaService.actualizarNombre(this.cuenta.NombreCompleto, this.cuenta.IDCuenta)
      .subscribe((resConsulta: any) => {
        console.log(resConsulta);
        Swal.fire({
          title: this.mensaje.title,
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      });
  }

  modificar_datos_Imagen() {
    this.cuenta.Foto = 1;
    localStorage.setItem('Foto', '1');
    this.CuentaService.actualizarFoto(this.cuenta)
      .subscribe((resConsulta: any) => {
        console.log(resConsulta);
        Swal.fire({
          title: this.mensaje.imagen,
          text: this.mensaje.text,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            // Aquí colocas el código que quieres que se ejecute después de hacer clic en el botón "OK"
            console.log('Se ha hecho clic en OK');
            location.reload();
            // Puedes agregar más código aquí según lo que desees hacer después de hacer clic en OK
          }
        });
      });
  }

  modificar_datos_Telefono() {
    this.CuentaService.actualizarTelefono(this.cuenta.NumeroTelefono, this.cuenta.IDCuenta)
      .subscribe((resConsulta: any) => {
        console.log(resConsulta);
        Swal.fire({
          title: this.mensaje.title,
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      });
  }

  modificar_datos_Correo() {
    this.CuentaService.actualizarCorreo(this.cuenta.CorreoElectronico, this.cuenta.IDCuenta)
      .subscribe((resConsulta: any) => {
        console.log(resConsulta);
        Swal.fire({
          title: this.mensaje.title,
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      });
  }

  modificar_datos_Contrasena(nuevacontrasena: any, confirmacion: any) {
    if (nuevacontrasena === confirmacion) {
      this.CuentaService.actualizarContrasena(nuevacontrasena, this.cuenta.IDCuenta)
        .subscribe((resConsulta: any) => {
          console.log(resConsulta);
          Swal.fire({
            icon: 'success',
            title: '¡Contraseña cambiada con éxito!',
            showConfirmButton: true, // Mostramos el botón de confirmación
            allowOutsideClick: false // Evita que el usuario cierre el cuadro de diálogo haciendo clic fuera de él
          }).then((result) => {
            if (result.isConfirmed) {
              console.log('Se ha hecho clic en OK');
              location.reload();
            }
          });
        },
        error => {
          console.error('Ocurrió un fallo al cambiar la contraseña:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ocurrió un fallo al cambiar la contraseña!',
          });
        });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: '¡Las contraseñas no coinciden!',
      });
    }
  }
  
  
  getFileBlob(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('El archivo no produjo una URL Base64 válida.'));
        }
      };
      reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
      reader.readAsDataURL(file);
    });
  }

  // SEGURIDAD [IMG-FRONT-02]: no modificar Foto en MySQL si falló
  // la eliminación física de la fotografía.
  eliminaImagen(IDCuenta: any): void {
    if (this.cuenta.Foto !== 1) {
      Swal.fire({
        title: this.mensaje.imagen3,
        text: this.mensaje.text3,
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }

    this.imagenesService.deleteImagen(IDCuenta, 'usuarios').subscribe({
      next: () => {
        this.CuentaService.set_foto_cero(0, IDCuenta).subscribe({
          next: () => {
            localStorage.setItem('Foto', '0');
            Swal.fire({
              title: this.mensaje.imagen2,
              text: this.mensaje.text2,
              icon: 'success',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.isConfirmed) location.reload();
            });
          },
          error: () => {
            Swal.fire({icon: 'error', title: 'No se pudo actualizar la cuenta'});
          }
        });
      },
      error: () => {
        Swal.fire({icon: 'error', title: 'No se pudo eliminar la fotografía'});
      }
    });
  }


}
   