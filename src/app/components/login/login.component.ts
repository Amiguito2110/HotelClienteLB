import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { cuenta } from 'src/app/models/cuentas';
import { CuentaService } from 'src/services/cuenta.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  cuenta = new cuenta();
  mostrarContrasena: boolean = false;
  constructor(private CuentaService: CuentaService, private router: Router) { }
  login() {
    this.CuentaService.validarCuenta(this.cuenta.CorreoElectronico, this.cuenta.Contrasena)
      .subscribe((resUsuario: any) => {
        Swal.fire({
          title: 'Bienvenido ' + resUsuario.NombreCompleto,
          icon: 'success',
          showConfirmButton: false, 
          timer: 2000 
        }).then(() => {
          localStorage.setItem('CorreoElectronico', resUsuario.CorreoElectronico);
          localStorage.setItem('IDCuenta', String(resUsuario.IDCuenta));
          localStorage.setItem('Rol', String(resUsuario.Rol));
          localStorage.setItem('NombreUsuario', resUsuario.NombreCompleto)
          localStorage.setItem('Telefono', resUsuario.NumeroTelefono)
          localStorage.setItem('Foto', resUsuario.Foto)
          this.router.navigateByUrl('/home/user_principal_ui');
        });
      },
        (error: any) => {
          if (error.status === 401 || error.status === 404) {
            Swal.fire({
              title: 'Error',
              text: 'Contraseña o usuario  incorrectos.',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          }
        });
  }
  togglePasswordVisibility(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }
  ir_a_recuperar()
  {
    this.router.navigateByUrl('/recuperar');
  }
}

/*import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { cuenta } from 'src/app/models/cuentas';
import { CuentaService } from 'src/services/cuenta.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  cuenta = new cuenta();
  mostrarContrasena: boolean = false;

  constructor(private CuentaService: CuentaService, private router: Router) { }

  login() {
    this.CuentaService.validarCuenta(this.cuenta.CorreoElectronico, this.cuenta.Contrasena)
      .subscribe((resUsuario: any) => {
        Swal.fire({
          title: 'Bienvenido ' + resUsuario.NombreCompleto,
          icon: 'success',
          showConfirmButton: false, 
          timer: 2000 
        }).then(() => {
          console.log(this.cuenta.Rol);
          localStorage.setItem('CorreoElectronico', resUsuario.CorreoElectronico);
          //localStorage.setItem('Contrasena', this.cuenta.Contrasena); no lo necesitas
          localStorage.setItem('IDCuenta', String(resUsuario.IDCuenta));
          localStorage.setItem('Rol', String(resUsuario.Rol));
          localStorage.setItem('NombreUsuario', resUsuario.NombreCompleto)
          localStorage.setItem('Telefono', resUsuario.NumeroTelefono)
          console.log("ESTAMOS CHJACNDO LOS ROELS")
          console.log(resUsuario.Rol)
          if (resUsuario.Rol == 1) {
            this.router.navigateByUrl('/administrador');
          }
          if (resUsuario.Rol == 2) {
            this.router.navigateByUrl('/recepcionista');
          }
          if (resUsuario.Rol == 3) {
            this.router.navigateByUrl('/cliente');
          }
        });
      },
        (error: any) => {
          if (error.status === 401 || error.status === 404) {
            Swal.fire({
              title: 'Error',
              text: 'Contraseña o usuario  incorrectos.',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          }
        });
  }

  togglePasswordVisibility(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }
  ir_a_recuperar()
  {
    this.router.navigateByUrl('/recuperar');
  }
}*/