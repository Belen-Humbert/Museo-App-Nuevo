class Pieza {
    constructor(nroR, nomP, medidaP, materialOb, fechaAd, formaAdq, añoPi, estadoPi, cantidad, Obse, supr) {
        this.NumeroRegistro = nroR;
        this.NombrePieza = nomP;
        this.MedidaPieza = medidaP;
        this.MaterialObjeto = materialOb;
        this.FechaAdquisicion = fechaAd;
        this.FormaAdquirida = formaAdq;
        this.AñoPieza = añoPi;
        this.EstadoPieza = estadoPi;
        this.Cantidad = cantidad;
        this.Observacion = Obse;
        this.BajaLogica = supr;
        this.class = "Pieza";
    }
}

class Prestamo {

    constructor(numPres, numPieza, eventoPre, fechaPre, fechaDev, cant, obsePre, supr) {
        this.numeroPrestamo = numPres
        this.numeroPiezas = numPieza;
        this.eventoPrestamo = eventoPre;
        this.fechaPrestamo = fechaPre;
        this.fechaDevolucion = fechaDev;
        this.cantidad = cant;
        this.observacionPrestamo = obsePre;
        this.BajaLogica = supr;
        this.class = "Prestamo";
    }
}

class Taxidermia {

    constructor(idTax, numPieza, fechaM, obseTax, baj = false) {

        this.idTaxidermia = idTax;
        this.numeroPiezas = numPieza;
        this.fechaMantenimiento = fechaM;
        this.observacionTaxidermia = obseTax;
        this.BajaTax = baj;
        this.class == "Taxidermia";
    }
}
class Usuario {
    constructor(nombre, usuario, pass, token) {
        this.nombre = nombre;
        this.usuario = usuario;
        this.pass = pass;
        this.class = "Usuario";
    }
}
module.exports = { Pieza, Prestamo, Taxidermia, Usuario };
