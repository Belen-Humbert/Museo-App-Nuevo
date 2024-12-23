const fs = require("fs"); // Usa fs.promises para funciones asíncronas
const Clases = require("./clases.js");

//---------- USUARIO --------------
function getUsuarios() {
  let str_usuarios = fs.readFileSync("./db/usuarios.txt", "utf-8");
  let usuarios = [];
  if (str_usuarios) {
    usuarios = JSON.parse(str_usuarios);
  }
  console.log("modelo --> seguridad [usuarios]");
  return usuarios;
}

//---------- PIEZA --------------
function guardar(data) {
  console.log("modelo --> controlador 'guardar(data)'");
  let str_piezas = fs.readFileSync("./db/piezas.txt", "utf-8");
  let piezas = []; /* */
  if (str_piezas) {
    piezas = JSON.parse(str_piezas);
  }
  piezas.push(data);
  try {
    fs.writeFileSync("./db/piezas.txt", JSON.stringify(piezas));
    console.log("gurdado exitoso");
    return true;
  } catch (err) {
    console.log("error al guardar");
    return false;
  }
}

function obtener() {
  let str_piezas = fs.readFileSync("./db/piezas.txt", "utf-8");
  let piezas = [];
  if (str_piezas) {
    piezas = JSON.parse(str_piezas);
  }
  console.log("modelo --> controlador 'datos de piezas'");
  return piezas;
}

// baja lógica
function actualizarBajaLogica(numeroRegistro) {
  try {
    let str_piezas = fs.readFileSync("./db/piezas.txt", "utf-8");
    let piezas = [];
    if (str_piezas) {
      piezas = JSON.parse(str_piezas);
    }
    for (var i = 0; i < piezas.length; i++) {
      if (piezas[i].NumeroRegistro == numeroRegistro) {
        piezas[i].BajaLogica = true;
      }
      console.log(
        piezas[i].NumeroRegistro +
          "  " +
          piezas[i].BajaLogica +
          "  " +
          numeroRegistro
      );
    }
    fs.writeFileSync("./db/piezas.txt", JSON.stringify(piezas));
    return true;
  } catch (err) {
    return false;
  }
}

function updatePieza(piezaAct) {
  const piezas = obtener();
  console.log("modelo --> controlador 'updatePieza(piezaAct)'");
  let index = null;
  for (let i = 0; i < piezas.length; i++) {
    if (piezaAct.numero === piezas[i].NumeroRegistro) {
      index = i;
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
      fs.writeFileSync("./db/piezas.txt", JSON.stringify(piezas));
      console.log("modelo --> controlador 'true'");
      return true;
    } catch (err) {
      console.log("modelo --> controlador 'false'");
      return false;
    }
  }
  console.log("modelo --> controlador 'false'");
}

//---------- PRÉSTAMO --------------
function guardarPrestamo(data) {
  let str_prestamo = fs.readFileSync("./db/prestamo.txt", "utf-8");
  let prestamo = [];
  if (str_prestamo) {
    prestamo = JSON.parse(str_prestamo);
  }
  prestamo.push(data);

  try {
    fs.writeFileSync("./db/prestamo.txt", JSON.stringify(prestamo));
    return true;
  } catch (err) {
    return false;
  }
}

function obtenerPrestamo() {
  let str_prestamo = fs.readFileSync("./db/prestamo.txt", "utf-8");
  let prestamo = [];
  if (str_prestamo) {
    prestamo = JSON.parse(str_prestamo);
  }

  return prestamo;
}

function updatePrestamo(PrestamoActualizado) {
  const prestamo = obtenerPrestamo();
  let indice = null;

  for (let i = 0; i < prestamo.length; i++) {//si el numero del prestamo enviado desde el form es igual al numero de algun prestamo en en el array de prestamos 
    if (PrestamoActualizado.numeroPrestamo === prestamo[i].numeroPrestamo) {//obtiene el numero de posicion de ese prestamo y lo guarda en indice
      indice = i;
    }
  }
  if (indice !== -1) {//prestamo[numero de posicion en el array].propiedadDeLaClase =(asigna el nuevo valor) PrestamoActualizado.NuevoValorEnviadoDesdeForm
    prestamo[indice].numeroPrestamo = PrestamoActualizado.numeroPrestamo;
    prestamo[indice].numeroPiezas = PrestamoActualizado.numeroPiezas;
    prestamo[indice].eventoPrestamo = PrestamoActualizado.eventoPrestamo;
    prestamo[indice].fechaPrestamo = PrestamoActualizado.fechaPrestamo;
    prestamo[indice].fechaDevolucion = PrestamoActualizado.fechaDevolucion;
    prestamo[indice].cantidad = PrestamoActualizado.cantidad;
    prestamo[indice].observacionPrestamo =
      PrestamoActualizado.observacionPrestamo;

    try {
      fs.writeFileSync("./db/prestamo.txt", JSON.stringify(prestamo));
      return true;
    } catch (err) {
      return false;
    }
  }
}

function actualizarBajaLogicaPrestamo(numeroPrestamo) {
  try {
    let str_prestamos = fs.readFileSync("./db/prestamo.txt", "utf-8");
    let prestamos = [];

    // Verifica si hay datos en el archivo
    if (str_prestamos) {
      prestamos = JSON.parse(str_prestamos);
    }

    let encontrado = false; // Para rastrear si se encuentra el registro

    // Itera sobre los préstamos para encontrar el registro
    for (let i = 0; i < prestamos.length; i++) {
      // Compara como string para asegurar coincidencia
      if (prestamos[i].numeroPrestamo === String(numeroPrestamo)) {
        // Marca como baja lógica
        prestamos[i].BajaLogica = true; // Asegúrate de que esta propiedad exista
        encontrado = true; // Se encontró el registro
        console.log(
          `Préstamo ${prestamos[i].numeroPrestamo} marcado como baja lógica.`
        );
      } else {
        console.log(
          `${prestamos[i].numeroPrestamo}  ${prestamos[i].BajaLogica}  ${numeroPrestamo}`
        );
      }
    }

    // Si se encontró el registro, guarda los cambios
    if (encontrado) {
      fs.writeFileSync("./db/prestamo.txt", JSON.stringify(prestamos, null, 2)); // Formato legible
      console.log("baja exitosa");
      return true; // Indica que la baja lógica fue exitosa
    } else {
      return false; // Indica que no se encontró el registro
    }
  } catch (err) {
    return false; // Manejo de errores
  }
}

//---------- TAXIDERMIA --------------
function guardarTaxidermia(miTaxidermia) {
  let str_taxidermia = fs.readFileSync("./db/taxidermia.txt", "utf-8");
  let taxidermia = [];
  if (str_taxidermia) {
    taxidermia = JSON.parse(str_taxidermia);
  }

  taxidermia.push(miTaxidermia);

  try {
    fs.writeFileSync("./db/taxidermia.txt", JSON.stringify(taxidermia));
    return true;
  } catch (err) {
    console.log("algo fallo en el modelo");
    return false;
  }
}

function obtenerTaxidermia() {
  let str_taxidermia = fs.readFileSync("./db/taxidermia.txt", "utf-8");
  let taxidermia = [];
  if (str_taxidermia) {
    taxidermia = JSON.parse(str_taxidermia);
  }
  return taxidermia;
}

function actualizarBajaLogicaTax(NroTax) {
  try {
    let str_taxidermia = fs.readFileSync("./db/taxidermia.txt", "utf-8");
    let taxidermia = [];
    if (str_taxidermia) {
      taxidermia = JSON.parse(str_taxidermia);
    }
    let encontrado = false; // Para rastrear si se encuentra el registro
    for (var i = 0; i < taxidermia.length; i++) {
      if (taxidermia[i].idTaxidermia == NroTax) {
        taxidermia[i].BajaTax = true;
        encontrado = true;
      }
    }
    if (encontrado) {
      fs.writeFileSync("./db/taxidermia.txt", JSON.stringify(taxidermia));
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

function updateTaxidermia(taxidermiaActualizada) {
  const taxidermia = obtenerTaxidermia();
  let indice = null;

  for (let i = 0; i < taxidermia.length; i++) {
    if (taxidermiaActualizada.numero === taxidermia[i].idTaxidermia) {
      indice = i;
    }
  }
  if (indice !== -1) {
    taxidermia[indice].fechaMantenimiento = taxidermiaActualizada.fecha;
    taxidermia[indice].observacionTaxidermia = taxidermiaActualizada.observa;

    try {
      fs.writeFileSync("./db/taxidermia.txt", JSON.stringify(taxidermia));
      return true;
    } catch (err) {
      return false;
    }
  }
}

module.exports = {
  guardar,
  obtener,
  getUsuarios,
  guardarPrestamo,
  obtenerPrestamo,
  actualizarBajaLogica,
  updatePieza,
  guardarTaxidermia,
  obtenerTaxidermia,
  updateTaxidermia,
  updatePrestamo,
  actualizarBajaLogicaTax,
  actualizarBajaLogicaPrestamo,
};
