const fs = require('fs'); // Usa fs.promises para funciones asíncronas
const Clases = require('./clases.js');

const DB_PATH = './db.txt';
const USUARIOS_PATH = './db/usuarios.txt';

function guardarUsuario(data) {
  let str_usuarios = fs.readFileSync('./db/usuarios.txt', 'utf-8');
  let usuarios = [];
  if (str_usuarios) {
    usuarios = JSON.parse(str_usuarios);
    console.log('Piezas existentes:', usuarios);
  }
  console.log('Nuevo Usuario:', data);
  usuarios.push(data);
  console.log('Usuario después de agregar:', usuarios);
  try {
    fs.writeFileSync('./db/usuarios.txt', JSON.stringify(usuarios));
    console.log('Datos guardados en ./db/usuarios.txt');
    return true;
  } catch (err) {
    console.error('Error al guardar los datos:', err);
    return false;
  }
}

function getUsuarios() {
    let str_usuarios = fs.readFileSync('./db/usuarios.txt', 'utf-8');
    let usuarios = [];
    if (str_usuarios) {
        usuarios = JSON.parse(str_usuarios);
    }
    let objUsuarios = [];
    usuarios.forEach(x => objUsuarios.push(Clases.Usuario.fromJSON(x)));

    return objUsuarios;
}

function guardar(data) {
  console.log("corriendo guardar(data)")
  console.log(data)
    let str_piezas = fs.readFileSync('./db.txt', 'utf-8');
    console.log("str_piezas")
    console.log(str_piezas)
    let piezas = [];/* */
    if (str_piezas) {
        piezas = JSON.parse(str_piezas);
        console.log('Piezas existentes:', piezas);
    }
    console.log("piezas")
    console.log(piezas)
    console.log('Nueva pieza:', data);
    piezas.push(data);
    console.log('Piezas después de agregar la nueva:', piezas);

    try {
        fs.writeFileSync('./db.txt', JSON.stringify(piezas));
        //fs.writeFileSync('./db.txt', JSON.stringify(data));
        console.log('Datos guardados en db.txt');
        return true;
    } catch (err) {
        console.error('Error al guardar los datos:', err);
        return false;
    }
}

function obtener() {
    let str_piezas = fs.readFileSync('./db.txt', 'utf-8');
    let piezas = [];
    if (str_piezas) {
        piezas = JSON.parse(str_piezas);
    }

    return piezas;
}

// baja lógica-----------------------------------------------------------
function actualizarBajaLogica(numeroRegistro) {
  try {
    let str_piezas = fs.readFileSync('./db.txt', 'utf-8');
    let piezas = [];
    if (str_piezas) {
        piezas = JSON.parse(str_piezas);
    }
    //console.log("Coleccion de piezas")
    for(var i=0; i<piezas.length ; i++){
      
      if(piezas[i].NumeroRegistro == numeroRegistro){
        piezas[i].BajaLogica = false
      }
      console.log(piezas[i].NumeroRegistro+"  "+piezas[i].BajaLogica+"  "+numeroRegistro)
    }
    fs.writeFileSync('./db.txt', JSON.stringify(piezas));

  } catch (err) {
    console.error('Error al actualizar baja lógica:', err);
    return false;
  }
}

function guardarPrestamo(data) {
  let str_prestamo = fs.readFileSync('./db/prestamo.txt', 'utf-8');
  let prestamo = [];
  if (str_prestamo) {
    prestamo = JSON.parse(str_prestamo);
      console.log('prestamo existente:', prestamo);
  }

  console.log('Nueva prestamo:', data);
  prestamo.push(data);
  console.log('prestamo después de agregar la nueva:', prestamo);

  try {
      fs.writeFileSync('./db/prestamo.txt', JSON.stringify(prestamo));
      console.log('Datos guardados en prestamo.txt');
      return true;
  } catch (err) {
      console.error('Error al guardar los datos:', err);
      return false;
  }
}


function updatePieza(piezaAct) {
  const piezas = obtener();

  let index = null;
  for (let i = 0; i < piezas.length; i++) {
    if (piezaAct.numero === piezas[i].NumeroRegistro) {
      index = i;
      console.log("encontre esto", index);
    }
  }
  if (index !== -1) {
    piezas[index].NombrePieza = piezaAct.nombre;
    piezas[index].MedidaPieza = piezaAct.medida;
    piezas[index].MaterialObjeto = piezaAct.material;
    piezas[index].FechaAdquisicion = piezaAct.fechaAd;
    piezas[index].FormaAdquirida = piezaAct.formaAd;
    piezas[index].AñoPieza = piezaAct.Año;
    piezas[index].EstadoPieza = piezaAct.estado;
    piezas[index].Cantidad = piezaAct.cantidad;
    piezas[index].Observacion = piezaAct.obser;

    try {
      fs.writeFileSync("./db.txt", JSON.stringify(piezas));
      console.log("pieza Nro", piezaAct.numero, "modificada");
      return true;
    } catch (err) {
      console.log("pieza nro", piezaAct.numero, "no encontrada");
      return false;
    }
  }
}

function obtenerPrestamo() {
  let str_prestamo = fs.readFileSync('./db/prestamo.txt', 'utf-8');
  let prestamo = [];
  if (str_prestamo) {
    prestamo = JSON.parse(str_prestamo);
  }

  return prestamo;
}

function guardarTaxidermia(miTaxidermia) {
  let str_taxidermia = fs.readFileSync('./db/taxidermia.txt', 'utf-8');
  let taxidermia = [];
  if (str_taxidermia) {
    taxidermia = JSON.parse(str_taxidermia);
      console.log('Registros existentes:', taxidermia);
  }

  console.log('Nueva Taxidermia:', miTaxidermia);
  taxidermia.push(miTaxidermia);
  console.log('Registro después de agregar la nueva taxidermia:', taxidermia);

  try {
      fs.writeFileSync('./db/taxidermia.txt', JSON.stringify(taxidermia));
      console.log('Datos guardados en taxidermia.txt');
      return true;
  } catch (err) {
      console.error('Error al guardar los datos:', err);
      return false;
  }

}

function obtenerTaxidermia() {
  let str_taxidermia = fs.readFileSync('./db/taxidermia.txt', 'utf-8');
  let taxidermia = [];
  if (str_taxidermia) {
    taxidermia = JSON.parse(str_taxidermia);
  }
  return taxidermia;
}

function updateTaxidermia(taxidermiaActualizada){
const taxidermia = obtenerTaxidermia();

let indice = null;

for (let i = 0; i < taxidermia.length; i++) {
    if (taxidermiaActualizada.numero === taxidermia[i].idTaxidermia) {
      indice = i;
      console.log('encntre esta taxidermia', indice);
    }
  
}
if (indice !== -1) {
  
  taxidermia[indice].fechaMantenimiento = taxidermiaActualizada.fecha;
  taxidermia[indice].observacionTaxidermia = taxidermiaActualizada.observa;

  try {
    fs.writeFileSync('./db/taxidermia.txt', JSON.stringify(taxidermia));
    console.log('Datos guardados en taxidermia.txt');
    return true;
} catch (err) {
    console.error('Error al guardar los datos:', err);
    return false;
}
}
}

function updatePrestamo(PrestamoActualizado){
  const prestamo = obtenerPrestamo();
  
  let indice = null;
  
  for (let i = 0; i < prestamo.length; i++) {
      if (PrestamoActualizado.numero === prestamo[i].idPrestamo) {
        indice = i;
        console.log('encntre este Prestamo', indice);
      }
    
  }
  if (indice !== -1) {
    
    prestamo[indice].numeroPrestamo = PrestamoActualizado.numeroPrestamo;
    prestamo[indice].numeroPiezas = PrestamoActualizado.numeroPiezas;
    prestamo[indice].eventoPrestamo = PrestamoActualizado.eventoPrestamo;
    prestamo[indice].fechaPrestamo = PrestamoActualizado.fechaPrestamo;
    prestamo[indice].fechaDevolucion = PrestamoActualizado.fechaDevolucion;
    prestamo[indice].cantidad = PrestamoActualizado.cantidad;
    prestamo[indice].observacion = PrestamoActualizado.observacion;


    try {
      fs.writeFileSync('./db/prestamo.txt', JSON.stringify(prestamo));
      console.log('Datos guardados en prestamo.txt');
      return true;
  } catch (err) {
      console.error('Error al guardar los datos:', err);
      return false;
  }
  }



}
module.exports = { guardar, obtener, guardarUsuario, getUsuarios, guardarPrestamo, obtenerPrestamo, actualizarBajaLogica,updatePieza, guardarTaxidermia, obtenerTaxidermia, updateTaxidermia,updatePrestamo, };
