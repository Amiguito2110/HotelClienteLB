import { Component, OnInit } from '@angular/core';
import { CorreoE } from 'src/app/models/CorreoE';
import { CorreoService } from 'src/services/correo.service';
import { CuentaService } from 'src/services/cuenta.service';
import { CambioIdiomaService } from 'src/services/cambio-idioma.service';
@Component({
  selector: 'app-promociones-envio',
  templateUrl: './promociones-envio.component.html',
  styleUrls: ['./promociones-envio.component.css']
})
export class PromocionesEnvioComponent implements OnInit {
  mensaje: string;
  correos : CorreoE [] = [];
  idioma: any;
  constructor(private correoService: CorreoService, private cuentaService: CuentaService, private cambioIdiomaService: CambioIdiomaService) { 
    this.cambioIdiomaService.currentMsg$.subscribe(
      (msg) => {
          this.idioma = msg;
          console.log("idioma actual:", this.idioma, " aaaa");
      });
    this.mensaje = ''; // Inicialización del mensaje en una cadena vacía
  }

  ngOnInit(): void {
    this.cuentaService.correosUsuarios().subscribe((resCorreos: any) => {
      this.correos = resCorreos;
      console.log(this.correos);
    }, err => console.error(err));
  }
  enviarCorreo() {
    const correosString = this.correos.map(correo => correo.CorreoElectronico);
    console.log(this.mensaje);
    console.log(correosString);
    if (this.mensaje && correosString.length > 0) { // Corrección aquí
      this.correoService.enviarPromocion(this.mensaje, correosString).subscribe(
        (res: any) => {
          console.log('Promoción enviada con éxito:', res);
          // Aquí puedes agregar lógica adicional si es necesario
        },
        (error) => {
          console.error('Error al enviar promoción:', error);
          // Aquí puedes agregar lógica adicional para manejar errores
        }
      );
    } else {
      console.warn('Mensaje o lista de correos vacíos. No se pudo enviar la promoción.');
    }
  }
  
}
