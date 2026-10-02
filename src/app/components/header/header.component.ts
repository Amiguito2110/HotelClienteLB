import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
import { CambioIdiomaService } from 'src/services/cambio-idioma.service';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  Rol: any;
  NombreUsuario: any;
  NombreRecepcionista: any;
  NombreCliente: any;
  NombreAdmin: any;
  idioma: any;

  constructor(private cambioIdiomaService: CambioIdiomaService, private Router: Router, private translate: TranslateService) {
    this.translate.addLangs(["es", "en"]);
    console.log("estoy en el constructor de navigation")
    this.idioma = localStorage.getItem("idioma");
    if (this.idioma == 1) {
      this.translate.setDefaultLang("es");
    }
    if (this.idioma == 2) {
      this.translate.setDefaultLang("en");
    }
    console.log(this.idioma);
    this.NombreUsuario = localStorage.getItem('NombreUsuario');
    this.Rol = Number(localStorage.getItem('Rol'))
  }
  ngOnInit(): void {
    console.log("estoy en oninit de navigation")
    $(document).ready(function () { $(".dropdown-trigger").dropdown(); });
  }

  logout() {
    localStorage.removeItem('CorreoElectronico')
    localStorage.removeItem('Contrasena')
    localStorage.removeItem('IDCuenta')
    localStorage.removeItem('Rol')
    localStorage.removeItem('NombreUsuario')
    localStorage.removeItem('Telefono')
    localStorage.removeItem("idioma")
    this.Router.navigateByUrl('/login');
    location.reload(); // Aquí recargamos la página después de navegar a /login
  }

  enviarMensajeIdioma(idioma: any) {
    this.cambioIdiomaService.sendMsg(idioma);
  }

  setIdioma(idioma: any) {
    localStorage.removeItem('idioma');
    if (idioma == 1) {
      this.translate.use("es");
      this.enviarMensajeIdioma(1);
      localStorage.setItem("idioma", "1");
      console.log("Seleccionaste español y se modifico el idioma a 1")
    }
    if (idioma == 2) {
      this.translate.use("en");
      this.enviarMensajeIdioma(2);
      localStorage.setItem("idioma", "2");
      console.log("Seleccionaste Ingles")
    }
    location.reload(); // Aquí recargamos la página después de cambiar el idioma
  }
 
}
