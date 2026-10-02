import { Time } from "@angular/common";

// export class nuevaReservacion{
//     IDCuenta: number;
//     FechaEntrada: string;
//     FechaSalida: string;
//     HoraLlegada: string;
//     EstadoReserva: string;

//     constructor() {
//         this.IDCuenta = 0;
//         this.FechaEntrada = '';
//         this.FechaSalida = '';
//         this.HoraLlegada = '';
//         this.EstadoReserva = ''
//     }
// }

export class nuevaReservacion{
    IDCuenta: number;
    FechaEntrada: string;
    FechaSalida: string;
    HoraLlegada: string;
    CostoTotal: number;
    detallesReserva: any[];

    constructor() {
        this.IDCuenta = 0;
        this.FechaEntrada = '';
        this.FechaSalida = '';
        this.HoraLlegada = '';
        this.CostoTotal = 0;
        this.detallesReserva = [];
    }
}