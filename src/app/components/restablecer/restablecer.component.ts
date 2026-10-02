import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CorreoService } from 'src/services/correo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.component.html',
  styleUrls: ['./restablecer.component.css']
})
export class RestablecerComponent {
 
  constructor(private route: ActivatedRoute, private correoService: CorreoService) { }
  nuevacontrasena: any;
  confirmacion: any;

  restableceContrasena(nuevacontrasena: any, confirmacion: any) {
    this.route.paramMap.subscribe(params => {
      let token = params.get('token');
      if (nuevacontrasena === confirmacion) {
        this.correoService.decodificarMail(token, nuevacontrasena).subscribe((resUsuario: any) => {
          if(resUsuario){
            Swal.fire({
              icon: 'success',
              title: 'Contraseña cambiada con éxito!',
              showConfirmButton: false,
              timer: 1500
            });

          }else{
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ocurrió un fallo al cambiar la contraseña!',
            });
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Las contraseñas no coinciden!',
        });
      }
    });
  }
}

