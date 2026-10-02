import { Component, OnInit } from '@angular/core';
import { PromocionesService } from 'src/services/promociones.service'; // Importa el servicio de promociones
import { CambioIdiomaService } from 'src/services/cambio-idioma.service';

@Component({
  selector: 'app-lista-promociones',
  templateUrl: './lista-promociones.component.html',
  styleUrls: ['./lista-promociones.component.css']
})
export class ListaPromocionesComponent implements OnInit {
  idioma: any;
  promociones: any[] = [];

  constructor(private promocionesService: PromocionesService, private cambioIdiomaService: CambioIdiomaService) { 
    this.cambioIdiomaService.currentMsg$.subscribe(
      (msg) => {
          this.idioma = msg;
          console.log("idioma actual:", this.idioma, " aaaa");
      });
  }

  ngOnInit(): void {
    this.obtenerPromociones();
  }

  obtenerPromociones() {
    this.promocionesService.mostrarTodasPromociones().subscribe((res: any) => {
      this.promociones = res;
    });
  }

  eliminarPromocion(idPromocion: number) {
    console.log("Este se va a eliminar"+idPromocion);
    
    this.promocionesService.eliminarPromocion(idPromocion).subscribe(() => {
      // Actualizar la lista de promociones después de eliminar
      this.obtenerPromociones();
    });
  }
  
}
