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
  cargandoImagen(archivo: any) {
    this.imgUsuario = null;
    this.liga = environment.API_URI_IMAGES;

    this.fileToUpload = archivo.files.item(0);
    let imgPromise = this.getFileBlob(this.fileToUpload);
    imgPromise.then(blob => {
      console.log("convirtiendo imagen")

      this.imagenesService.guardarImagen(this.cuenta.IDCuenta, "usuarios", blob).subscribe(
        (res: any) => {
          this.imgUsuario = blob;
          console.log("Usuario id: ", this.cuenta.IDCuenta);

          //this.liga = "";
          // Actualizar la variable 'liga' después de cargar la imagen
          //this.liga = environment.API_URI_IMAGES + "/usuarios/" + this.cuenta.IDCuenta + ".jpg";
          console.log(this.cuenta.IDCuenta);

          console.log(this.liga);

          this.CuentaService.mostrarCuenta(this.cuenta.IDCuenta).subscribe((resCuenta: any) => {
            this.cuenta = resCuenta;
          }, err => console.error(err));
        }, err => console.error(err));
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
  eliminaImagen(IDCuenta: any) {
    if(this.cuenta.Foto==1){
      this.imagenesService.deleteImagen(IDCuenta, 'usuarios').subscribe((res) => {
      }, err => console.error(err));
  
      this.CuentaService.set_foto_cero(0, IDCuenta).subscribe((resFoto: any) => {
        Swal.fire({
          title: this.mensaje.imagen2,
          text: this.mensaje.text2,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            // Aquí colocas el código que quieres que se ejecute después de hacer clic en el botón "OK"
            console.log('Se ha hecho clic en OK');
            localStorage.setItem('Foto', '0');
            location.reload();
            // Puedes agregar más código aquí según lo que desees hacer después de hacer clic en OK
          }
        });
      }, err => console.error(err));
    }else{
      Swal.fire({
        title: this.mensaje.imagen3,
        text: this.mensaje.text3,
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  }


}
   