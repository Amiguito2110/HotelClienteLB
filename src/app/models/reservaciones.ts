export class reservacion{
    IDReserva: number;
    IDCuenta: number;
    FechaEntrada: string;
    FechaSalida: string;
    HoraLlegada: string;
    EstadoReserva: string;
    EstadoPago: string;
    

    constructor() {
        this.IDReserva = 1;
        this.IDCuenta = 1;
        this.FechaEntrada = '';
        this.FechaSalida = '';
        this.HoraLlegada = '';
        this.EstadoReserva = ''
        this.EstadoPago = '';
    }
}