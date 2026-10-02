export class nuevocarrito{
    IDCuenta: number;
    FechaEntrada: string;
    FechaSalida: string;
    CostoTotal: number;
    DetalleCarrito: any[];

    constructor() {
        this.IDCuenta = 0;
        this.FechaEntrada = '';
        this.FechaSalida = '';
        this.CostoTotal = 0;
        this.DetalleCarrito = [];
    }
}