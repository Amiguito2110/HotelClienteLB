import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { cuentaNueva } from 'src/app/models/cuentaNueva';
import { cuenta } from 'src/app/models/cuentas';
import { CuentaService } from 'src/services/cuenta.service';
import { CambioIdiomaService } from 'src/services/cambio-idioma.service';
import Swal from 'sweetalert2';

declare var M: any;

@Component({
  selector: 'app-admin-config',
  templateUrl: './admin-config.component.html',
  styleUrls: ['./admin-config.component.css']
})

export class AdminConfigComponent implements AfterViewInit, OnInit {
  listaCuentas: any;
  cuenta = new cuentaNueva();
  cuenta2 = new cuenta();
  idioma: any;
  mensaje:any;
  ///idioma: any;
  constructor(private CuentaService : CuentaService, private Router : Router, private el : ElementRef, private cambioIdiomaService: CambioIdiomaService) {
    //this.idioma = 2;
    this.idioma = localStorage.getItem("idioma");
            if(this.idioma==1){
              this.mensaje={
                creacion:'Cuenta creada.',
                edicion:'Cuenta modificada.',
                title: "¿Estás seguro?",
                text: "¡No podrás revertir esto!",
                confirmButtonText: "Sí, eliminar",
                confirmation:"¡Eliminado!",
                message: "La cuenta del recepcionista ha sido eliminada.",
                error: "No se pudo eliminar la cuenta Recepcionista."
            };
        
            }else{
              this.mensaje={
                creacion:'Account created.',
                edicion:'Account modified.',
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                confirmButtonText: "Yes, delete",
                confirmation: "Deleted!",
                message: "The receptionist's account has been deleted.",
                error: "The receptionist's account could not be deleted."
            };
            }
    this.CuentaService.mostrar_todas_cuentas().subscribe((resCuentas) => {
      this.listaCuentas = resCuentas;
      console.log(this.listaCuentas);
    });
  }
  ngOnInit(): void {
    this.idioma = localStorage.getItem('idioma'); 
  }

  ngAfterViewInit(): void {
      
  }

  abrirModalCrearRecep() {
    this.cuenta= new cuentaNueva()
    const modalElem = this.el.nativeElement.querySelector('#agregarRecepcionista');
    M.Modal.init(modalElem);
    const modalInstance = M.Modal.getInstance(modalElem);
    modalInstance.open();
  }
crear_recepcionista() {

  this.CuentaService.crearRecepcionista(this.cuenta).subscribe({

    next: (resCuenta: any) => {

      // 1. Cerrar el modal de crear recepcionista
      const modalElem = this.el.nativeElement.querySelector(
        '#agregarRecepcionista'
      );

      const modalInstance = M.Modal.getInstance(modalElem);

      if (modalInstance) {
        modalInstance.close();
      }

      // 2. Limpiar el formulario
      this.cuenta = new cuentaNueva();

      // 3. Actualizar la lista de recepcionistas
      this.CuentaService.mostrar_todas_cuentas().subscribe({
        next: (resCuentas: any) => {
          this.listaCuentas = resCuentas;
        },
        error: (error) => {
          console.error('Error al actualizar recepcionistas:', error);
        }
      });

      // 4. Mostrar mensaje de éxito
      Swal.fire({
        title: this.mensaje.creacion,
        icon: 'success',
        confirmButtonText: 'Ok'
      });

    },

    error: (error) => {

      console.error('Error al crear recepcionista:', error);

      Swal.fire({
        title: 'Error',
        text: error.error?.mensaje ||
              'No se pudo crear el recepcionista.',
        icon: 'error'
      });

    }

  });

}

  actualizarcuenta(selectedcuenta2: any) {
    this.cuenta2 = selectedcuenta2;
    console.log(this.cuenta2)
    const modalElem = this.el.nativeElement.querySelector('#editPersonalModal');
    M.Modal.init(modalElem);
    const modalInstance = M.Modal.getInstance(modalElem);
    modalInstance.open();
  }

  guardar_cambios(cuenta2_id: any) {
    this.cuenta2.IDCuenta = cuenta2_id;
    this.CuentaService.actualizar_cuenta(this.cuenta2.IDCuenta, this.cuenta2).subscribe((resCuenta: any) => {
      console.log(resCuenta);
      Swal.fire({
        title: this.mensaje.edicion,
        icon: 'success',
        confirmButtonText: 'Ok'
      });
      this.CuentaService.mostrar_todas_cuentas().subscribe((resCuentas: any) => {
        this.listaCuentas = resCuentas;
      });

      const modalElem = this.el.nativeElement.querySelector('#editPersonalModal');
      M.Modal.init(modalElem);
      const modalInstance = M.Modal.getInstance(modalElem);
      modalInstance.close();
    });
  }


  agregar_recepcionista(){
    const modalElem = this.el.nativeElement.querySelector('#editPersonalModal');
    M.Modal.init(modalElem);
    const modalInstance = M.Modal.getInstance(modalElem);
    this.CuentaService.agregarCuenta(this.cuenta).subscribe((resCuenta : any) =>{
      console.log(resCuenta);
    });
    modalInstance.open();
  }

  eliminar_recepcionista(IDCuenta: number) {
    Swal.fire({
      title: this.mensaje.title,
      text: this.mensaje.text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.mensaje.confirmButtonText
    }).then((result) => {
      if (result.isConfirmed) {
        this.CuentaService.eliminarCuenta(IDCuenta).subscribe(() => {
          Swal.fire(
            this.mensaje.confirmation,
            this.mensaje.message,
            'success'
          );
          this.CuentaService.mostrar_todas_cuentas().subscribe((resCuentas: any) => {
            this.listaCuentas = resCuentas;
          });
        }, error => {
          Swal.fire(
            'Error',
            this.mensaje.error,
            'error'
          );
        });
      }
    });
  }



}