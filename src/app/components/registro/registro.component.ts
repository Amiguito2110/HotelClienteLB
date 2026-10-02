import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { cuenta } from 'src/app/models/cuentas';
import { RegistroService } from 'src/services/registro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})

export class RegistroComponent {
  CuentaNueva = new cuenta();
  Confirmando_Contrasena: any;
  mostrarContrasena: boolean = false;
  mostrarContrasenaconfirmacion: boolean = false;


  constructor(private RegistroService: RegistroService, private router: Router){ 
    console.log(this.CuentaNueva);
  }
  
  registrarse() {
    /*Verificar que los campos no esten vacios*/
    if (this.CuentaNueva.CorreoElectronico == "" || this.CuentaNueva.Contrasena == "" ||
      this.CuentaNueva.NombreCompleto == "" || this.CuentaNueva.NumeroTelefono == "" || this.Confirmando_Contrasena == "") {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Llene todos los campos',
        showConfirmButton: false, // Deshabilitar el botón "OK"
        timer: 4000 // Ocultar después de 5 segundos (5000 milisegundos)
      });
    } else /*Los capos no estan vacios, hacer el alta del nuevo usuario*/ {
      /*Aqui hay que confirmar que el correo no este en la base de datos*/
      this.RegistroService.correoExiste2(this.CuentaNueva.CorreoElectronico).subscribe((resService: any) => {
        if (resService.isCorreoElectronico == '1')//El correo ya existe
        {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El correo ya ha sido registrado',
            showConfirmButton: false, // Deshabilitar el botón "OK"
            timer: 4000 // Ocultar después de 5 segundos (5000 milisegundos)
          });
        } else //El correo no existe en la base de datos, proseguimos con el alta
        {
          /*Aqui hay que verificar que las contraseñas coincidan */
          if (this.CuentaNueva.Contrasena != this.Confirmando_Contrasena)//las contraseñas no coinciden
          {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Las contraseñas no coinciden',
              showConfirmButton: false, // Deshabilitar el botón "OK"
              timer: 3000 // Ocultar después de 5 segundos (5000 milisegundos)
            });
          } else/*Ya pasamos todos los filtros, hacemos la inserccion */ {
            this.RegistroService.registrarse(this.CuentaNueva.CorreoElectronico, this.CuentaNueva.Contrasena,
              this.CuentaNueva.NombreCompleto, this.CuentaNueva.NumeroTelefono)
              .subscribe((resusuario: any) => {
                if (resusuario.affectedRows == 1) {
                  /*Se agrego correctamnte*/
                  Swal.fire({
                    title: 'Ahora, ya estas registrado ' + this.CuentaNueva.NombreCompleto,
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 5000
                  }).then(() => {
                    this.router.navigateByUrl('/login');
                  });
                }
                else {
                  /*Error del servidor*/
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error del servidor, llame a servicio técnico',
                    showConfirmButton: false, // Deshabilitar el botón "OK"
                    timer: 4000 // Ocultar después de 5 segundos (5000 milisegundos)
                  });
                }
              });
          }
        }
      });
    }
  }
  togglePasswordVisibility(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }
  togglePasswordVisibilityConfirmacion(): void {
    this.mostrarContrasenaconfirmacion = !this.mostrarContrasenaconfirmacion;
  }
}
    