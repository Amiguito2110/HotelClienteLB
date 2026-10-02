export class carrito{
    IDCarrito: number;
    IDCuenta: number;
    FechaEntrada: string;
    FechaSalida: string;
    CostoTotal: number;
    DetalleCarrito: any[];

    constructor() {
        this.IDCarrito = 0;
        this.IDCuenta = 0;
        this.FechaEntrada = '';
        this.FechaSalida = '';
        this.CostoTotal = 0;
        this.DetalleCarrito = [];
    }
}