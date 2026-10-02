import { Component, OnInit,AfterViewInit,ElementRef } from '@angular/core';
import { Producto } from 'src/app/models/Inventario_tienda';
import { Categoria } from 'src/app/models/categorias';
import { InventarioTiendaService } from 'src/services/inventario-tienda.service';
import { CambioIdiomaService } from 'src/services/cambio-idioma.service';
import Swal from 'sweetalert2';
declare var M: any;
@Component({
  selector: 'app-inventario-tienda',
  templateUrl: './inventario-tienda.component.html',
  styleUrls: ['./inventario-tienda.component.css']
})
export class InventarioTiendaComponent implements OnInit {
  productos: Producto[] = [];
  producto = new Producto;

  categorys: Categoria[] = [];
  category = new Categoria;
  modalInstance: any;
  pageSize = 4;
  p = 1;
  idioma: any;
  mensaje:any;
  constructor(private InventarioTiendaService:InventarioTiendaService, private el: ElementRef, private cambioIdiomaService: CambioIdiomaService) { 
    this.idioma = localStorage.getItem("idioma");
    if(this.idioma==1){
      this.mensaje={
        creacion_producto:'Producto creado.',
        edicion_producto:'Producto modificado.',
        error_creacion:"La categoría no existe",
        error_rcreacion:"Por favor, crea la categoría antes de agregar el producto.",
        error_existencia:"El producto ya está registrado",
        creacion_categoria:"Categoría creada.",
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        confirmButtonText: "Sí, eliminar",
        confirmation:"¡Eliminado!",
        message_producto: "El producto ha sido eliminado.",
        error: "No se pudo eliminar el producto."
    };

    }else{
      this.mensaje={
        creacion_producto: "Product created.",
        edicion_producto: "Product modified.",
        error_creacion: "The category does not exist",
        error_rcreacion: "Please create the category before adding the product.",
        error_existencia: "The product is already registered",
        creacion_categoria: "Category created",
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        confirmButtonText: "Yes, delete",
        confirmation:"Deleted!",
        message_producto: "The product has been deleted.",
        error: "The product could not be deleted."
    };
    }
    this.cambioIdiomaService.currentMsg$.subscribe(
      (msg) => {
          this.idioma = msg;
          console.log("idioma actual:", this.idioma, " aaaa");
      });
    this.InventarioTiendaService.mostrar_todos_productos().subscribe((resInventario: any) => {
      this.productos = resInventario;
      console.log(this.productos)
      this.InventarioTiendaService.mostrar_todas_categorias().subscribe((resCategoria: any) => {
        this.categorys = resCategoria;
        console.log(this.category)
      });
    });
  }

  ngOnInit(): void {
  }

    actualizarProducto(selectedProduct: any) {
      this.producto = selectedProduct;
 
      const modalElem = this.el.nativeElement.querySelector('#editarProductoModal');
      M.Modal.init(modalElem);
      const modalInstance = M.Modal.getInstance(modalElem);
      modalInstance.open();
    }

    guardarCambiosProducto(productoId: any) {
      this.producto.id = productoId;
      
      this.InventarioTiendaService.actualizar_productos(this.producto.id, this.producto).subscribe((resProducto: any) => {
      
        if (resProducto.mensaje === 'El producto fue actualizado corectamente.') {
        Swal.fire({
          title:this.mensaje.edicion_producto,
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      }else{
        Swal.fire({
          title: this.mensaje.error_creacion,
          text: this.mensaje.error_rcreacion,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
      this.InventarioTiendaService.mostrar_todos_productos().subscribe((resInventario: any) => {
        this.productos = resInventario;
      });
        const modalElem = this.el.nativeElement.querySelector('#editarProductoModal');
        M.Modal.init(modalElem);
        const modalInstance = M.Modal.getInstance(modalElem);
        modalInstance.close();
      });
    
    }

  abrirModalCrearProducto() {
    const modalElem = this.el.nativeElement.querySelector('#crearProductoModal');
    M.Modal.init(modalElem);
    const modalInstance = M.Modal.getInstance(modalElem);
    modalInstance.open();
  }


  crearProducto(producto: any) {
    console.log(producto);
    this.InventarioTiendaService.agregar_producto(producto).subscribe((resProducto: any) => {
      console.log(resProducto);
      if (resProducto.mensaje === 'Producto creado exitosamente.') {
        Swal.fire({
          title: this.mensaje.creacion_producto,
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then(() => {
        });
      } else if (resProducto.mensaje === 'El producto ya existe.') {
        Swal.fire({
          title: this.mensaje.error_existencia,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }else {
        Swal.fire({
          title: this.mensaje.error_creacion,
          text: this.mensaje.error_rcreacion,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
      this.InventarioTiendaService.mostrar_todos_productos().subscribe((resInventario: any) => {
        this.productos = resInventario;
      });
    });
  }
  

  eliminarProducto(idProducto: number) {
    this.producto.id=idProducto;
    console.log(this.producto.id)
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
        this.InventarioTiendaService.eliminar_producto(this.producto.id).subscribe((resInventario: any) =>  {
          Swal.fire(
            this.mensaje.confirmation,
            this.mensaje.message_producto,
            'success'
          );
          this.InventarioTiendaService.mostrar_todos_productos().subscribe((resInventario: any) =>{
            this.productos = resInventario;
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
    abrirModalCrearCategoria() {
      const modalElem = this.el.nativeElement.querySelector('#crearCategoriaModal');
      M.Modal.init(modalElem);
      const modalInstance = M.Modal.getInstance(modalElem);
      modalInstance.open();
    }
  
  
    crearCategoria(category:any) {
     console.log(category)
     this.InventarioTiendaService.agregar_categoria(this.category).subscribe((resCategoria: any) => {
      Swal.fire({
        title: 'Categoría creada.',
        icon: 'success',
        confirmButtonText: 'Ok'
      });
      // Cerrar el modal después de crear la categoría
      const modalElem = this.el.nativeElement.querySelector('#crearCategoriaModal');
      const modalInstance = M.Modal.getInstance(modalElem);
      modalInstance.close();
    });
  }
 

    }



