
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { cuenta } from 'src/app/models/cuentas';
import {
  CuentaService,
  RespuestaLogin
} from 'src/services/cuenta.service';

import Swal from 'sweetalert2';

// SEGURIDAD [CODE-FRONT-01]:
// Se elimina ColdObservable porque no se utiliza.

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  cuenta = new cuenta();
  mostrarContrasena: boolean = false;

  constructor(
    private CuentaService: CuentaService,
    private router: Router
  ) { }

  login(): void {

    this.CuentaService.validarCuenta(
      this.cuenta.CorreoElectronico,
      this.cuenta.Contrasena
    ).subscribe({

      next: (resUsuario: RespuestaLogin) => {

        // SEGURIDAD [JWT-FRONT-01]:
        // Comprobar que la respuesta incluya un JWT.
        if (
          typeof resUsuario.token !== 'string' ||
          resUsuario.token.length === 0 ||
          resUsuario.tokenType !== 'Bearer'
        ) {
          Swal.fire({
            titleText: 'Error de autenticación',
            text: 'El servidor no devolvió una sesión válida.',
            icon: 'error'
          });
          return;
        }

        // SEGURIDAD [JWT-FRONT-01]:
        // Guardar el token mediante CuentaService.
        // No imprimirlo en consola ni en la interfaz.
        this.CuentaService.guardarToken(resUsuario.token);

        // ELIMINAR: prueba temporal ya completada.
        this.CuentaService.verificarTokenTemporal().subscribe({
          next: (resultado) => {
            console.log(
              'JWT validado desde Angular. ID:',
              resultado.idCuenta
            );
          },
          error: (error) => {
            console.warn(
              'Error en verificación JWT. HTTP:',
              error.status
            );
          }
        });

        Swal.fire({
          titleText: 'Bienvenido ' + resUsuario.NombreCompleto,
          icon: 'success',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {

          // COMPATIBILIDAD [ANG-01]:
          // Conservar los datos utilizados actualmente
          // por los componentes Angular y los *ngIf.
          localStorage.setItem(
            'CorreoElectronico',
            resUsuario.CorreoElectronico
          );

          localStorage.setItem(
            'IDCuenta',
            String(resUsuario.IDCuenta)
          );

          localStorage.setItem(
            'Rol',
            String(resUsuario.Rol)
          );

          localStorage.setItem(
            'NombreUsuario',
            resUsuario.NombreCompleto
          );

          localStorage.setItem(
            'Telefono',
            String(resUsuario.NumeroTelefono ?? '')
          );

          localStorage.setItem(
            'Foto',
            String(resUsuario.Foto ?? 0)
          );

          // COMPATIBILIDAD [ANG-01]:
          // Se conserva la navegación original.
          this.router.navigateByUrl(
            '/home/user_principal_ui'
          );
        });
      },

      // SEGURIDAD [ERR-FRONT-01]:
      // Manejo controlado de errores HTTP.
      error: (error: HttpErrorResponse) => {

        if (error.status === 401 || error.status === 404) {
          Swal.fire({
            titleText: 'Error',
            text: 'Correo o contraseña incorrectos.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });

        } else {
          Swal.fire({
            titleText: 'Error de conexión',
            text: 'No fue posible iniciar sesión. Inténtalo nuevamente.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      }
    });
  }

  togglePasswordVisibility(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  ir_a_recuperar(): void {
    this.router.navigateByUrl('/recuperar');
  }
}
