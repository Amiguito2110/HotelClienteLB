import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
import { CambioIdiomaService } from 'src/services/cambio-idioma.service';
declare var $: any;

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent implements OnInit {
  NombreAdmin:any;
  idioma: any;

  constructor(private Router: Router,private translate: TranslateService, private cambioIdiomaService: CambioIdiomaService) { 
    //this.idioma = 2;
    this.cambioIdiomaService.currentMsg$.subscribe(
      (msg) => {
          this.idioma = msg;
          console.log("idioma actual:", this.idioma, " aaaa");
      });
  }

  ngOnInit(): void {
    this.NombreAdmin=localStorage.getItem('NombreUsuario');
    $(document).ready(function () { $(".dropdown-trigger").dropdown(); });
  }
  logout(){
    localStorage.removeItem('CorreoElectronico')
    localStorage.removeItem('Contrasena')
    localStorage.removeItem('IDCuenta')
    localStorage.removeItem('Rol')
    localStorage.removeItem('NombreUsuario')
    localStorage.removeItem('Telefono')
    this.Router.navigateByUrl('/login')
  }
  enviarMensajeIdioma(idioma: any) {
    this.cambioIdiomaService.sendMsg(idioma);
  }
  setIdioma(idioma: any) {
    localStorage.removeItem('idioma');
    if (idioma == 1)
      this.translate.use("es");
      this.enviarMensajeIdioma(1);
      localStorage.setItem("idioma","1");
    if (idioma == 2)
      this.translate.use("en");
      this.enviarMensajeIdioma(1);
      localStorage.setItem("idioma","2");
  }

}
