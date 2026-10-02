export class cuenta{
    IDCuenta: number;
    NombreCompleto : string;
    CorreoElectronico: string;
    Rol: number;
    Contrasena: string;
    NumeroTelefono: string;
    Foto: number;

    constructor() {
        this.IDCuenta = 0;
        this.NombreCompleto = '';
        this.CorreoElectronico = '';
        this.Rol = 0;
        this.Contrasena = '';
        this.NumeroTelefono = ''
        this.Foto = 0;
    }
}
