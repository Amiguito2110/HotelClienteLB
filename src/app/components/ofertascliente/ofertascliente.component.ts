import { Component, OnInit } from '@angular/core';
import { PromocionesService } from 'src/services/promociones.service';
import { HabitacionesService } from 'src/services/habitaciones.service';
import { TranslateService } from "@ngx-translate/core";
import { CambioIdiomaService } from 'src/services/cambio-idioma.service';
declare var $: any;
@Component({
  selector: 'app-ofertascliente',
  templateUrl: './ofertascliente.component.html',
  styleUrls: ['./ofertascliente.component.css']
})
export class OfertasclienteComponent implements OnInit {
  Rol: any;
  NombreCliente: any;
  hayOfertas: boolean = false;
  arregloPromociones: any[];
  promocion: any
  habitacion: any
  idioma: any;
  constructor(private promocionesService: PromocionesService, private translate: TranslateService, private habitacionesService: HabitacionesService,private cambioIdiomaService: CambioIdiomaService) { 
    this.idioma = localStorage.getItem("idioma");
    this.Rol = Number(localStorage.getItem('Rol'));
    this.arregloPromociones = []; 
  }


  ngOnInit(): void {
    this.NombreCliente = localStorage.getItem('NombreUsuario');
    this.cargar_promociones()
    $(document).ready(function () { $(".dropdown-trigger").dropdown(); });
  }
  ir_a_reservar() {
    this.NombreCliente = localStorage.getItem('NombreUsuario');
  }
  cargar_promociones() {
    this.promocionesService.mostrarTodasPromociones().subscribe(
      (resPromocion: any) => { // Específica el tipo de respuesta como un arreglo de cualquier tipo
        if (resPromocion && resPromocion.length > 0) { // Verifica si hay datos en el arreglo
          this.hayOfertas = true;
          this.arregloPromociones = resPromocion;
          this.arregloPromociones.forEach(promocion => {
            this.obtenerDescripcion(promocion.IDHabitacion);
          });

        } else {
          this.hayOfertas = false;
        }
      },
      error => { // Maneja los errores si hubiera alguno
        console.error("Error al cargar promociones:", error);
        this.hayOfertas = false;
      }
    );
  }
  obtenerDescripcion(idHabitacion: any) {
    this.habitacionesService.buscar_habitacion_id(idHabitacion).subscribe(
      (resHabitacion: any) => {
        this.habitacion = resHabitacion;
        console.log("Habitacion",this.habitacion);
      },
      error => { // Maneja los errores si hubiera alguno
        console.error("Error al buscar la habitacion:", error);
      }
    );
  }

  setIdioma(idioma: any) {
    if (idioma == 1)
      this.translate.use("en");
    
    if (idioma == 2)
      this.translate.use("es");
      
  }

}
