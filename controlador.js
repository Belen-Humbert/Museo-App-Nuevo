const Clases = require("./clases.js");
const Modelo = require("./modelo.js");

function nuevoUser(data) {
  console.log("--nuevo(data)-->[controlador]");
  console.log(data);

  const usuario = Modelo.getUsuarios();
  if (usuario.find(u => u.usuario === data.usuario)) {
    return { exito: false, mensaje: "El nombre de usuario ya existe" }
  }


  let unUser = new Clases.Usuario(
    data.nombre,
    data.usuario,
    data.pass,
    null,
  );

  console.log('Usuario creado:', unUser);
  const guardarExitoso = Modelo.guardarUsuario(unUser);
  if (guardarExitoso) {
    return { exito: false, mensaje: "Usuario registrado con éxito" }
  } else {
    return { exito: false, mensaje: "Error al guardad el usuario" }
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

function actualizarPieza(piezaAct, NroRpiezaOri){
const piezaOr = PiezaPorNro(NroRpiezaOri);
const piezasArray = Modelo.obtener();

if(piezaAct !== piezaOr){


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
  let insert = data.insert === 'true'

  let miPretamos = new Clases.Prestamo(
    data.idPrestamo,
    data.numeroPrestamo,
    data.eventoPrestamo,
    data.fechaPrestamo,
    data.fechaDevolucion,
    data.cantidad,
    data.observacionPrestamo,
    data.idPieza,
    insert

  );

  console.log(' miPretamos:', miPretamos);

  const guardarExitoso = Modelo.guardarPrestamo(miPretamos);
  console.log('Operación de guardar:', guardarExitoso);

  return guardarExitoso;
}

function obtenerPrestamo() {
  return Modelo.obtenerPrestamo();
}


module.exports = { nuevoUser, nuevo, obtener, listar, PiezaPorNro, guardarPrestamo, obtenerPrestamo, PiezaBaja, actualizarPieza};