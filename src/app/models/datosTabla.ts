export class DatoTabla{;
    IDCuenta: number;
    IDReserva: number;
    NombreCompleto : string;
    HoraLlegada : string;
    NumeroTelefono : string;
    FechaEntrada: string;
    FechaSalida: string;
    EstadoReserva : string;
    EstadoPago: string;

    constructor() {
        this.IDCuenta = 0;
        this.IDReserva = 0;
        this.NombreCompleto = '';
        this.HoraLlegada = '';
        this.NumeroTelefono = '';
        this.FechaEntrada = '';
        this.FechaSalida = '';
        this.EstadoReserva = '';
        this.EstadoPago = '';

    }
}