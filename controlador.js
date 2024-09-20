const Clases = require("./clases.js");
const Modelo = require("./modelo.js");

function nuevoUser(data) {
  console.log("--nuevoUser(data)-->[controlador]");
  console.log(data);

  // Obtener la lista de usuarios
  const usuarios = Modelo.getUsuarios();
  
  // Verificar si el nombre de usuario ya existe
  if (usuarios.find(u => u.usuario === data.usuario)) {
    return { exito: false, mensaje: "El nombre de usuario ya existe" };
  }

  // Crear el nuevo usuario
  let unUser = new Clases.Usuario(
    data.nombre,
    data.usuario,
    data.pass,
    null,  // Asume que no necesitas un campo extra en este momento
  );

  console.log('Usuario creado:', unUser);

  // Guardar el usuario usando el modelo
  const guardarExitoso = Modelo.guardarUsuario(unUser);
  if (guardarExitoso) {
    return { exito: true, mensaje: "Usuario registrado con éxito" };  // Corregido a 'exito: true'
  } else {
    return { exito: false, mensaje: "Error al guardar el usuario" };
  }
}

function nuevo(data) {
  console.log("--nuevo(data)-->[controlador]");
  console.log(data);
  let BajaLogica = data.BajaLogica === 'true'

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

  return guardarExitoso;
}

function obtener() {
  return Modelo.obtener();
}

function listar() {

  return Modelo.obtener();

}

function PiezaPorNro(numRe) {

  const piezasArray = Modelo.obtener();
  const piezaId = piezasArray.find(pieza => pieza.NumeroRegistro === numRe);//busca el priemer numero en el array que coincida con el que se le pasa con el 


  if (piezaId) {
    console.log('encontramos', piezaId.NumeroRegistro);
    return (piezaId);
  } else {
    console.log('No encontre ni aka');
  }

}

// en proceso

function actualizarPieza(piezaAct) {

  OperaciónOk =  Modelo.updatePieza(piezaAct);

  if (OperaciónOk) {
    console.log('todo bien al fin');
    return true;

  } else {
    console.log('todo mal otra vez');
    return false;

  }

}

//baja logica
function PiezaBaja(numRe) {
  const numeroRegistro = numRe;
  console.log('Número de Registro recibido en PiezaBaja:', numeroRegistro); // Agregada
  const resultado = Modelo.actualizarBajaLogica(numeroRegistro);
  if (resultado) {
    return{ success: true, message: 'Pieza eliminada lógicamente' };
  } else {
    return{ success: false, message: 'Pieza no encontrada' };
  }
}

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
    console.log('algo fallo');
    return false;
  }

}

function listarTaxidermia() {
  return Modelo.obtenerTaxidermia();
}

function TaxidermiaPorNro(idTax){

  const taxidermiaArray = Modelo.obtenerTaxidermia();
  const taxidId = taxidermiaArray.find(taxidermia => taxidermia.idTaxidermia === idTax);//busca el priemer numero en el array que coincida con el que se le pasa con el 

  if (taxidId) {
    console.log('encontramos', taxidId.idTaxidermia);
    return (taxidId);
  } else {
    console.log('No encontre ni aka');
  }

}

function actualizarTaxidermia(taxidermiaActualizada){
  const operacionOk = Modelo.updateTaxidermia(taxidermiaActualizada);

  if (operacionOk) {
    console.log('esta funcionando');
    return true;
  } else {
    console.log('no anda');
    return false;
  }

}


function PrestamoPorNro(idPres){

  const prestamoArray = Modelo.obtenerPrestamo();
  const prestId = prestamoArray.find(prestamo => prestamo.numeroPrestamo === idPres);//busca el priemer numero en el array que coincida con el que se le pasa con el 

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



module.exports = { nuevoUser, nuevo, obtener, listar, PiezaPorNro, guardarPrestamo, obtenerPrestamo, PiezaBaja, actualizarPieza, nuevaTaxi, listarTaxidermia, TaxidermiaPorNro, actualizarTaxidermia, PrestamoPorNro,actualizarPrestamo, PrestamoBaja};