export class Producto {
    id: number;
    nombre_producto: string;
    precio_venta: number;
    precio_compra: number;
    cantidad_disponible: number;
    nombre_categoria: string;

    constructor() {
        this.id = 0;
        this.nombre_producto = '';
        this.precio_venta = 0;
        this.precio_compra = 0;
        this.cantidad_disponible = 0;
        this.nombre_categoria = '';
    }
}
