import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { cuenta } from 'src/app/models/cuentas';
import { CuentaService } from 'src/services/cuenta.service';
import { CorreoService } from 'src/services/correo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent {
  cuenta = new cuenta();

  constructor(private CuentaService: CuentaService, private router: Router, private CorreoService: CorreoService) { }

  recuperar() {
    this.CuentaService.correoExiste(this.cuenta.CorreoElectronico).subscribe((res: any) => {
      if (res.CorreoElectronico != -1) {
        //Si el correo esta en la base, se puede enviar el correo de Recuperacion
        this.CorreoService.enviarCorreoRecuperarContrasenya(this.cuenta.CorreoElectronico).subscribe((resCorreo: any) => {
          // Mostrar un mensaje de éxito al usuario
          Swal.fire({
            title: 'Correo enviado',
            text: 'Se ha enviado un correo para recuperar la contraseña.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        }, errCorreo => console.error(errCorreo));
      } else {
        // El correo no está registrado, mostrar un mensaje de error al usuario
        Swal.fire({
          title: 'Error',
          text: 'Correo no registrado en el hotel.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    }, err => console.error(err));
  }
}
