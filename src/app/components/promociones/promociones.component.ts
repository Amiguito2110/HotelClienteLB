import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { HabitacionesService } from 'src/services/habitaciones.service';
import { PromocionesService } from 'src/services/promociones.service';
import { CorreoE } from 'src/app/models/CorreoE';
import { CorreoService } from 'src/services/correo.service';
import { CuentaService } from 'src/services/cuenta.service';
import { CambioIdiomaService } from 'src/services/cambio-idioma.service';
declare var M: any;
import Swal from 'sweetalert2';

@Component({
  selector: 'app-promociones',
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.css']
})
export class PromocionesComponent implements OnInit, AfterViewInit {
  correos: CorreoE[] = [];
  porcentaje: any;

  mensaje: string;
  menssage:any;

  habitacionesDisponibles: any[] = [];
  habitacionesSeleccionadas: any[] = [];
  fechin: Date = new Date();
  fechout: Date = new Date();
  opcionesSelect: any[] = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' }
  ];
  idioma: any;
  constructor(private cuentaService: CuentaService, private correoService: CorreoService, private habitacionesService: HabitacionesService, private promocionesService: PromocionesService, private el: ElementRef, private cambioIdiomaService: CambioIdiomaService) {
    this.idioma = localStorage.getItem("idioma");
    if(this.idioma==1){
      this.menssage={
        title: '¡Promoción enviada con éxito!',
        text: 'Tu promoción ha sido enviada correctamente.',
        confirmButtonText: 'Aceptar',
        title2: '¡Atención!',
        text2: 'Debes seleccionar al menos una habitación antes de continuar.',
        confirmButtonText2: 'Entendido'
    };

    }else{
      this.menssage={
      title: "Promotion Sent Successfully!",
      text: "Your promotion has been sent successfully.",
      confirmButtonText: "Accept",
      title2: "Attention!",
      text2: "You must select at least one room before proceeding.",
      confirmButtonText2: "Understood"
    };
    }
    this.cambioIdiomaService.currentMsg$.subscribe(
      (msg) => {
        this.idioma = msg;
        console.log("idioma actual:", this.idioma, " aaaa");
      });
    this.mensaje = ''; // Inicialización del mensaje en una cadena vacía
  }

  ngOnInit(): void {
    this.obtenerHabitacionesDisponibles();
    this.cuentaService.correosUsuarios().subscribe((resCorreos: any) => {
      this.correos = resCorreos;
      console.log("Emails:", this.correos);
    }, err => console.error(err));

  }

  ngAfterViewInit(): void {
    this.inicializarSelectPorcentajes();
  }

  inicializarSelectPorcentajes() {
    const selectPorcentaje = this.el.nativeElement.querySelectorAll('select');
    M.FormSelect.init(selectPorcentaje);
  }

  obtenerHabitacionesDisponibles() {
    this.habitacionesService.mostrar_todas_habitaciones().subscribe((resHabitaciones: any) => {
      this.promocionesService.mostrarTodasPromociones().subscribe((resPromociones: any) => {
        const idPromociones = resPromociones.map((promocion: any) => promocion.IDHabitacion);
        this.habitacionesDisponibles = resHabitaciones.filter((habitacion: any) => !idPromociones.includes(habitacion.IDHabitacion));

        // Agregar el atributo selectedOption a cada habitación
        this.habitacionesDisponibles.forEach((habitacion: any) => {
          habitacion.selectedOption = ''; // Opción seleccionada por defecto
        });
      });
    });
  }

  seleccionarHabitacion(habitacion: any) {
    if (this.habitacionesSeleccionadas.includes(habitacion)) {
      this.habitacionesSeleccionadas = this.habitacionesSeleccionadas.filter(h => h !== habitacion);
    } else {
      this.habitacionesSeleccionadas.push(habitacion);
    }
  }

  mandarPromocion() {
    console.log("Habitaciones seleccionadas:", this.habitacionesSeleccionadas);
    console.log("Fecha inicio:", this.fechin);
    console.log("Fecha fin:", this.fechout);

    this.habitacionesSeleccionadas.forEach((habitacion, index) => {
      this.mensaje += `Habitación ${index + 1}: 
                  Tipo de habitación: ${habitacion.TipoHabitacion}, 
                  Costo: ${habitacion.Costo},
                  Descuento:${this.porcentaje}%\n`;

    });
    console.log(this.mensaje)
      this.promocionesService.agregarPromociones(this.habitacionesSeleccionadas, this.fechin, this.fechout, this.porcentaje).subscribe((res: any) => {
        console.log("Promociones agregadas:", res);
        this.habitacionesSeleccionadas = [];
        this.obtenerHabitacionesDisponibles();
        const correosString = this.correos.map(correo => correo.CorreoElectronico)

        this.correoService.enviarPromocion(this.mensaje, correosString).subscribe((res: any) => {
          Swal.fire({
            icon: 'success',
            title: this.menssage.title,
            text: this.menssage.text,
            confirmButtonText: this.menssage.confirmButtonText
          });
        },
          (error) => {
            Swal.fire({
              icon: 'warning',
              title: this.menssage.title2,
              text:  this.menssage.text2,
              confirmButtonText: this.menssage.confirmButtonText2
            });
          }
        );
      }, (error) => {
        console.error("Error al agregar promociones:", error);
      });

    }
}