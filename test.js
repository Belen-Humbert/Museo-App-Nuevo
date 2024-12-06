const Clases = require('./clases.js');
const Helper = require('./helper.js');
const Modelo = require('./modelo.js');

console.log(Modelo.obtener());

function testGuardar(){
    const miPieza = new Clases.Pieza(5050, "libro", "20x20","plata",new Date(),"compra",1234,"deteriorada",1,"",true)
    Modelo.guardar(miPieza)
}
//testGuardar();

function testNuevaTaxidermia(){
    const miTaxidermia = new Clases.Taxidermia(1, "12/04/2024", "Mi primer registro")
    Modelo.guardarTaxidermia(miTaxidermia);
}
testNuevaTaxidermia

function testActualizarBajaLogica(){
    Modelo.actualizarBajaLogica()
}
//testActualizarBajaLogica(1734)

function testObtener(){
    console.log("Test Obtener Piezas----")
    console.log(Modelo.obtener())
}
//testObtener()

//Modelo.guardarUsuario(unUsuario);

//console.log("getUsuarios ---------------------")
//console.log(Modelo.getUsuarios());

