import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
declare var M: any;
import { habitacion } from 'src/app/models/habitaciones';
import { HabitacionesService } from 'src/services/habitaciones.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from "@ngx-translate/core";
import { CambioIdiomaService } from 'src/services/cambio-idioma.service';
import { fotos_habitacion } from 'src/app/models/fotos_habitacion';
declare var M: any;
declare var $: any;


@Component({
  selector: 'app-user-principal-ui',
  templateUrl: './user-principal-ui.component.html',
  styleUrls: ['./user-principal-ui.component.css']

})
export class UserPrincipalUIComponent implements OnInit {
  Rol: any;
  habitaciones: habitacion[] = []; // Asumiendo que habitacion es un tipo de datos que contiene las habitaciones
  liga = '';
  idioma: any;
  lista_fotos: fotos_habitacion[] = [];
  onePicture: any;
  arrayImagenes: any=["../../../assets/images/carusel_cabana_1.webp","../../../assets/images/carusel_cabana_2.webp","../../../assets/images/carusel_cabana_3.webp"]

  constructor(private cambioIdiomaService: CambioIdiomaService, private Router: Router, private el: ElementRef, private HabitacionesService: HabitacionesService, private translate: TranslateService) {
    this.Rol = Number(localStorage.getItem('Rol'));
    
    this.liga = environment.API_URI_IMAGES;
   
    this.idioma = localStorage.getItem("idioma");
    if (this.idioma == 1) {
      this.translate.setDefaultLang("es");
    }
    if (this.idioma == 2) {
      this.translate.setDefaultLang("en");
    }
  }

  ngOnInit(): void {
    console.log("oninit de principal")
    this.obtenerHabitaciones();
  
  }


  obtenerHabitaciones() {
    this.HabitacionesService.mostrar_todas_habitaciones().subscribe((resHabitaciones: any) => {
      this.habitaciones = resHabitaciones;
      this.habitaciones.forEach(habitacion => {
        this.mostrarFotoPrincipal(habitacion);
      });
    });
  }

  mostrarFotoPrincipal(habitacion: habitacion) {
    this.HabitacionesService.id_foto_principal_por_Idhabitacion(habitacion.IDHabitacion).subscribe((resId: any) => {
      habitacion.idFotoPrincipal = resId.id_foto;
    }, err => console.error(err));
  }
  enviarMensajeIdioma(idioma: any) {
    this.cambioIdiomaService.sendMsg(idioma);
  }
  mostrar_todas_fotos(id: any) {
    
    this.lista_fotos = [];
    this.HabitacionesService.id_fotos_por_habitacion(id).subscribe((resLista: any) => {
      this.lista_fotos = resLista;
      console.log("se cargaron la lista de fotos: ",this.lista_fotos);
      this.onePicture = this.lista_fotos[0];
  
      console.log("cargamos el modal");
      // Asegúrate de que el código de inicialización del modal y del carousel se ejecute después de que el DOM esté completamente cargado
      $(document).ready(() => {
        $('#Mostrar_fotos').modal();
        $("#Mostrar_fotos").modal("open");
        this.actualizarIndicadores();
        // Inicializar el carrusel con las nuevas opciones
        $('.carousel.carousel-slider').carousel({
          fullWidth: true,
          indicators: true
        });
    
      });
      
    }, err => console.error(err));
  }

  actualizarIndicadores() {
    // Obtener el número de imágenes en el carrusel
    var numImagenes = $('.carousel.carousel-slider .carousel-item').length;
  
    // Actualizar el número de indicadores
    $('.carousel.carousel-slider .indicators').empty(); // Vaciar los indicadores existentes
    for (var i = 0; i < numImagenes; i++) {
      $('.carousel.carousel-slider .indicators').append('<li></li>'); // Agregar un indicador por cada imagen
    }
  }

  cerrar()
  {
    $("#Mostrar_fotos").modal("close");
  }

}
