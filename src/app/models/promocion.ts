export class Promocion {
    IDPromocion: number;
    IDHabitacion: number;
    TipoHabitacion: string;
    Costo: number;
    descuento: number;
    costoDesc: number;
    fechin: Date;
    fechout: Date;

    constructor() {
        this.IDPromocion = 0;
        this.IDHabitacion = 0;
        this.TipoHabitacion = '';
        this.Costo = 0;
        this.descuento = 0;
        this.costoDesc = 0;
        this.fechin = new Date(); // Inicializa fechin con la fecha actual
        this.fechout = new Date(); // Inicializa fechout con la fecha actual
    }
}
