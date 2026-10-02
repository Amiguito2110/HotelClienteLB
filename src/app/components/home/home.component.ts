import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
declare var M: any;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  modalImage: string = ''; // Variable para la imagen del modal
  cards: { image: string, description: string }[] = [ // Array de tarjetas
    { image: '../../../assets/images/carusel_cabana_1.webp', description: 'Descripción corta 1' },
    { image: '../../../assets/images/carusel_cabana_3.webp', description: 'Descripción corta 2' },
    // Agrega el resto de las tarjetas aquí
  ];
  //variables
  Rol: any;

  constructor(private el: ElementRef,private translate: TranslateService) {
    this.Rol = Number(localStorage.getItem('Rol'));
  }
  ngAfterViewInit(): void {
    const carouselElem = this.el.nativeElement.querySelector('#Carrusel');
    M.Carousel.init(carouselElem, {
    });

    
  }
  showImageModal(image: string) {
    this.modalImage = image;
    const modalInstance = document.querySelector('.modal1');
    const modal = M.Modal.getInstance(modalInstance);
    modal.open();
  }

}