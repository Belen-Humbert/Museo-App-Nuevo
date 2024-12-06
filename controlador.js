const Clases = require("./clases.js");
const Modelo = require("./modelo.js");

//---------- PIEZA --------------
function nuevo(data) {
  console.log("server --> controlador 'nuevo(data)'");
  console.log(data);
  let BajaLogica = data.BajaLogica === 'false' //=== devuelve true si ambos son iguales

  let miPieza = new Clases.Pieza(
    data.NumeroRegistro,
    data.NombrePieza,
    data.MedidaPieza,
    data.MaterialObjeto,
    data.FechaAdquisicion,
    data.FormaAdquirida,
    data.AñoPieza,
    data.EstadoPieza,
    data.Cantidad,
    data.Observacion,
    BajaLogica

  );

  console.log('Pieza creada:', miPieza);

  const guardarExitoso = Modelo.guardar(miPieza);
  console.log('Operación de guardar:', guardarExitoso);
  console.log("controlador --> modelo 'guardar(miPieza)'");

  return guardarExitoso;
}

function obtener() {
  return Modelo.obtener();
}

function listar() {
  console.log("server --> controlador.listar");
  console.log("controlador --> modelo.obtener");
  const piezas = Modelo.obtener();
  console.log("modelo --> controlador 'datos de piezas'");
  console.log("controlador --> server 'lista de piezas'");
  return piezas;
}

function PiezaPorNro(numRe) {

  const piezasArray = Modelo.obtener();
  const piezasActivas = piezasArray.filter(pieza => pieza.BajaLogica === false);//El método filter() es una función de arrays en JavaScript que crea un nuevo array con todos los elementos que cumplan una condición específica.
  const piezaId = piezasActivas.find(pieza => pieza.NumeroRegistro === numRe);//busca el priemer numero en el array que coincida con el que se le pasa con el 


  if (piezaId) {
    console.log('encontramos', piezaId.NumeroRegistro);
    return (piezaId);
  } else {
    console.log('No encontre ni aka');
  }

}


function actualizarPieza(piezaAct) {
  OperaciónOk =  Modelo.updatePieza(piezaAct);
  console.log("controlador --> modelo 'updatePieza(piezaAct)'");
  if (OperaciónOk) {
    console.log('todo bien al fin');
    console.log("controlador --> server 'true'");
    return true;

  } else {
    console.log("controlador --> server 'false'");
    return false;
  }

}

//baja logica
function PiezaBaja(numRe) {
  console.log("server --> controlador 'PiezaBaja'");
  const numeroRegistro = numRe;
  console.log('Número de Registro recibido en PiezaBaja:', numeroRegistro); // Agregada
  const resultado = Modelo.actualizarBajaLogica(numeroRegistro);
  console.log("server --> modelo 'actualizarBajaLogica(numeroRegistro)'");
  if (resultado) {
    console.log("controlador -r-> server { success: true, message: 'Pieza eliminada lógicamente' }'");
    return{ success: true, message: 'Pieza eliminada lógicamente' };
  } else {
    console.log("controlador -r-> server { success: false, message: 'Pieza no encontrada' }'");
    return{ success: false, message: 'Pieza no encontrada' };
  }
}

//---------- PRÉSTAMO --------------
function guardarPrestamo(data) {
  console.log("--nuevo(Préstamo)-->[controlador]");
  console.log(data);

  // Asegúrate de que estás definiendo BajaLogica correctamente
  let BajaLogica = data.BajaLogica === 'true'; // Asegúrate de que esto sea correcto

  let miPrestamo = new Clases.Prestamo(
    data.numeroPrestamo,
    data.numeroPiezas,
    data.eventoPrestamo,
    data.fechaPrestamo,
    data.fechaDevolucion,
    data.cantidad,
    data.observacionPrestamo,
    BajaLogica // Usa la variable definida aquí
  );

  console.log('miPrestamo:', miPrestamo);

  const guardarExitoso = Modelo.guardarPrestamo(miPrestamo);
  console.log('Operación de guardar:', guardarExitoso);

  return guardarExitoso;
}

function obtenerPrestamo() {
  return Modelo.obtenerPrestamo();
}

function PrestamoPorNro(idPres){

  const prestamoArray = Modelo.obtenerPrestamo();
  const prestamosActivos = prestamoArray.filter(prestamo => prestamo.BajaLogica === false);
  const prestId = prestamosActivos.find(prestamo => prestamo.numeroPrestamo === idPres);//busca el priemer numero en el array que coincida con el que se le pasa con el 

  if (prestId) {
    console.log('encontramos', prestId.numeroPrestamo);
    return (prestId);
  } else {
    console.log('No encontre ni aka');
  }

}

function actualizarPrestamo(PrestamoActualizado){
  const operacionOk = Modelo.updatePrestamo(PrestamoActualizado);

  if (operacionOk) {
    console.log('esta funcionando');
    return true;
  } else {
    console.log('no anda');
    return false;
  }

}
function PrestamoBaja(numRe) {
  const numeroPrestamo = String(numRe); // Asegúrate de convertirlo a string
  console.log('Número de Préstamo recibido en PrestamoBaja:', numeroPrestamo);
  
  const resultado = Modelo.actualizarBajaLogicaPrestamo(numeroPrestamo);
  if (resultado) {
    return { success: true, message: 'Préstamo eliminado lógicamente' };
  } else {
    return { success: false, message: 'Préstamo no encontrado' };
  }
}

//---------- TAXIDERMIA --------------
function nuevaTaxi(nuevaTaxidermia) {
  console.log("--nuevo(nuevaTaxidermia)-->[controlador]");
  console.log(nuevaTaxidermia);

  let miTaxidermia = new Clases.Taxidermia(
    nuevaTaxidermia.NumeroRegistro,
    nuevaTaxidermia.FechaMantenimiento,
    nuevaTaxidermia.Observacion,
    nuevaTaxidermia.idPieza
    );

  console.log('Registro de Taxidermia Creado:', miTaxidermia);

  const guardarExitoso = Modelo.guardarTaxidermia(miTaxidermia);
  console.log('Operación de guardar:', guardarExitoso);
  if(guardarExitoso){
    console.log("Taxidermia registrada con exito");
    return true;
  } else{
    console.log('algo fallo en el controlador');
    return false;
  }

}

function listarTaxidermia() {
  return Modelo.obtenerTaxidermia();
}

function TaxidermiaPorNro(idTax){

  const taxidermiaArray = Modelo.obtenerTaxidermia();
  const taxidermiasActivos = taxidermiaArray.filter(taxidermia => taxidermia.BajaTax === false);
  const taxidId = taxidermiasActivos.find(taxidermia => taxidermia.idTaxidermia === idTax);//busca el priemer numero en el array que coincida con el que se le pasa con el 

  if (taxidId) {
    console.log('encontramos', taxidId.idTaxidermia);
    return (taxidId);
  } else {
    console.log('algo fallo en el controlador');
    return false;
  }

}

function actualizarTaxidermia(taxidermiaActualizada){
  const operacionOk = Modelo.updateTaxidermia(taxidermiaActualizada);

  if (operacionOk) {
    console.log('esta funcionando en controlador');
    return true;
  } else {
    console.log('Algo fallo en el controlador');
    return false;
  }

}

function TaxidermiaBaja(NroTax){

  const numeroTax = NroTax;
  console.log('Número de Taxidermia recibido en TaxidermiaBaja:', numeroTax); // Agregada
  const resultado = Modelo.actualizarBajaLogicaTax(numeroTax);
  if (resultado) {
    console.log("esta funcionando en controlador TaxidermiaBaja");
    return true;
  } else {
    console.log("taxidermia no encontrada");
    return false;
  }

}




module.exports = { nuevo, obtener, listar, PiezaPorNro, guardarPrestamo, obtenerPrestamo, PiezaBaja, actualizarPieza, nuevaTaxi, listarTaxidermia, TaxidermiaPorNro, actualizarTaxidermia, PrestamoPorNro, actualizarPrestamo, TaxidermiaBaja,PrestamoBaja};
