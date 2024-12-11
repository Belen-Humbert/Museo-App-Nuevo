const express = require("express");//importamo express que proporciona herramientas para manejo de rutas y middlewars.
const path = require("path");// utilidad incorporada que proporciona node para trabajar con rutas y directorios de archivos.
const exphbs = require("express-handlebars");//Importamos el motor de plantillas para generar vistas dinámicas.
const Seguridad = require("./seguridad.js");
const Controlador = require("./controlador.js");
const session = require("express-session");

// Inicialización de la aplicación Express
const app = express();
const port = 3002;

// Configuración de express-session
app.use(
  session({
    secret: "secreto_de_tito_session", // Clave para firmar la cookie de sesión
    resave: false, // No guardar sesión si no ha cambiado
    saveUninitialized: false, // Guardar sesión nueva aunque no tenga datos
    cookie: {
      secure: false, // Cambia a true si usas HTTPS
      maxAge: 2 * 60 * 60 * 1000 //la sesión expirará después de 2 horas de inactividad
    }
  })
);

//Configuramos express-handlebars como motor de plantillas para la aplicación Express
app.engine(
  "hbs", //Define la extensión que se usa para identificar los archivos de plantillas
  exphbs.engine({
    extname: ".hbs", //Especifica la extensión de archivo que usarán las plantillas
    defaultLayout: "main", //Define el layout por defecto que se usará para todas las vistas
    layoutsDir: path.join(__dirname, "views/layouts"), //Define el directorio donde se encuentran el layout
    helpers: {
      eq: function (v1, v2) {
        return v1 === v2;
      }
    }
  })
);

app.set("view engine", "hbs"); //Establecemos a Handlebars (hbs) como el motor de vistas de la aplicación
app.set("views", path.join(__dirname, "views")); // Define dónde Express buscará los archivos de las vistas

// Middleware para parsear JSON y datos de formularios
app.use(express.json());//Permite que la aplicación entienda datos en formato JSON
app.use(express.urlencoded({ extended: false }));//Permite entender datos enviados desde formularios HTML

// Servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, "public")));  //Permite que recursos como CSS o imágenes sean accesibles públicamente

// Middleware para verificar la autenticación
function autenticarUsuario(req, res, next) {
  console.log("server --> autenticarUsuario 'verificar sesión'");
  if (req.session.usuario) {
    console.log("autenticarUsuario --> server 'sesión válida'");
    return next();//permite continuar a la ruta solicitada
  }

  res.redirect("/");
}

//--------- DEFINICIÓN DE RUTAS --------------
app.get("/", (req, res) => {
  res.render("index", {
    useNav: false,
    titulo: "Inicio de Sesión",
    error: req.query.error
  });
});

app.post("/login", (req, res) => {
  console.log("browser --> server 'POST /login'");
  let resultado = Seguridad.registrado(req.body);
  console.log("server --> seguridad.registrado");
  if (resultado.autenticado) {
    console.log("seguridad --> server 'autenticado: true'");
    req.session.usuario = resultado.usuario; //asigna una sesión al usuario autenticado
    console.log("server --> browser 'redirect: /inicio'");
    res.redirect("/inicio");
  } else {
    console.log("seguridad --> server 'autenticado: false'");
    console.log("server --> browser 'render: index con error'");
    res.render("index", {
      useTailwind: true,
      useCSS: false,
      useNav: false,
      titulo: "Inicio de Sesión",
      error: resultado.mensaje,
    });
  }
});

app.get("/inicio", autenticarUsuario, (req, res) => {
  console.log("browser --> server 'GET /inicio'");
  console.log("server --> browser 'render: inicio'");
  const piezas = Controlador.listar();
  const piezasActivas = piezas.filter(pieza => pieza.BajaLogica === false);
  const prestamos = Controlador.obtenerPrestamo();
  const prestamosActivos = prestamos.filter(prestamo => prestamo.BajaLogica === false);
  const taxidermias = Controlador.listarTaxidermia();
  const taxidermiasActivos = taxidermias.filter(taxidermia => taxidermia.BajaTax === true);

  res.render("inicio", {
    useTailwind: true,
    useCSS: false,
    useNav: true,
    titulo: "Inicio",
    piezas: piezasActivas,
    prestamos: prestamosActivos,
    taxidermias: taxidermiasActivos,
    usuario: req.session.usuario,
  });
});


//--------- PIEZA RUTAS --------------
app.get("/listarPieza", autenticarUsuario, (req, res) => {
  console.log("browser --> server 'GET /listarPieza'");
  const piezas = Controlador.listar();
  const piezasActivas = piezas.filter(pieza => pieza.BajaLogica === false);

  console.log("server --> controlador.listar");
  console.log("server --> browser 'render: listarPieza'");
  res.render("listarPieza", {
    useNav: true,
    piezas: piezasActivas,
    titulo: "Piezas del Museo",
    usuario: req.session.usuario,
  });
});

app.get("/nuevaPieza", autenticarUsuario, (req, res) => {
  console.log("browser --> server 'GET /nuevo'");
  console.log("server --> browser 'render: nuevo'");
  res.render("nuevaPieza", {
    useNav: true,
    titulo: "Registro de pieza",
    usuario: req.session.usuario,
  });
});

app.post("/agregar", (req, res) => {
  console.log("browser --> server 'POST /agregar'");
  const operacionExitosa = Controlador.nuevo(req.body);
  console.log("server --> controlador 'nuevo(req.body)'");
  if (operacionExitosa) {
    res.redirect("/listarPieza");
  } else {
    res.send("Error al guardar los datos");
  }
});

app.post("/enviarNreg", (req, res) => {
  console.log("browser --> server 'POST /enviarNreg'");
  const NroReg = req.body.editar;
  console.log(`server --> browser 'redirect: /editarPieza/${NroReg}'`);
  res.redirect(`/editarPieza/${NroReg}`);
});

app.get("/editarPieza/:NroReg", (req, res) => {
  console.log("browser --> server 'GET /editarPieza/:NroReg'");
  const numRe = req.params.NroReg;
  console.log("server --> controlador.PiezaPorNro");
  const piezas = Controlador.PiezaPorNro(numRe);
  console.log("controlador --> server 'datos de la pieza'");
  console.log("server --> browser 'render: modificar'");
  res.render("modificarPieza", {
    useNav: true,
    titulo: "Editar pieza",
    piezas,
    usuario: req.session.usuario,
  });
});

app.post("/actualizarPieza", (req, res) => {
  console.log("browser --> server 'POST /actualizarPieza'");
  const piezaAct = req.body;
  console.log("server --> controlador.actualizarPieza");
  const operacionExitosa = Controlador.actualizarPieza(piezaAct);
  console.log("controlador --> server 'resultado de la actualización'");

  if (operacionExitosa) {
    console.log("server --> browser 'redirect: /listarPieza'");
    res.redirect("/listarPieza");
  } else {
    console.log("server --> browser 'error al actualizar'");
    res.send("Error al actualizar la pieza");
  }
});

app.post("/deletePieza", (req, res) => {
  console.log("browser --> server 'POST /deletePieza'");
  const NroReg = req.body.NroReg;
  const resultado = Controlador.PiezaBaja(NroReg);
  console.log("server --> controlador 'PiezaBaja'");
  if (resultado) {
    res.redirect("listarPieza");
  } else {
    res.send("Error al eliminar la pieza")
  }
});

//--------- PRÉSTAMO RUTAS --------------
app.post("/registrarprestamo", (req, res) => {
  console.log("browser --> server 'POST /registrarprestamo'");
  const operacionExitosa = Controlador.guardarPrestamo(req.body);
  console.log("server --> controlador 'guardarPrestamo'");
  if (operacionExitosa) {
    console.log("server --> browser 'redirect: /listarPrestamo'");
    res.redirect("/listarPrestamo");
  } else {
    console.log("server --> browser 'error al guardar préstamo'");
    res.send("Error al guardar el préstamo");
  }
});

app.get("/prestamo", autenticarUsuario, (req, res) => {
  res.render("prestamo", {
    useNav: true,
    titulo: "Registro de prestamo",
    usuario: req.session.usuario,
  });
});

app.get("/listarPrestamo", (req, res) => {
  const prestamos = Controlador.obtenerPrestamo();
  const prestamosActivos = prestamos.filter(prestamo => prestamo.BajaLogica === false);
  res.render("listarPrestamo", {
    useNav: true,
    titulo: "Prestamos",
    prestamo: prestamosActivos,
    usuario: req.session.usuario,
  });
});

app.post("/modificarPrestamo", (req, res) => {
  const idPres = req.body.editar;
  res.redirect(`/editarPrestamo/${idPres}`);
});

app.get("/editarPrestamo/:idPres", (req, res) => {
  const idPres = req.params.idPres;
  const prestamo = Controlador.PrestamoPorNro(idPres);
  res.render("modificarPrestamo", {
    useNav: true,
    titulo: "Editar prestamo",
    prestamo,
    usuario: req.session.usuario,
  });
});

app.post("/actualizarPrestamo", (req, res) => {
  const PrestamoActualizado = req.body;
  const operacionOk = Controlador.actualizarPrestamo(PrestamoActualizado);

  if (operacionOk) {
    res.redirect("listarPrestamo");
  } else {
    res.send("Error al actualizar prestamo");
  }
});

app.post("/deletePrestamo", (req, res) => {
  const NroReg = req.body.NroReg;
  const resultado = Controlador.PrestamoBaja(NroReg);
  if (resultado) {
    res.redirect("listarPrestamo");
  } else {
    res.send("Error al eliminar prestamo");
  }
});

//--------- TAXIDERMIA RUTAS --------------
app.get("/nuevaTaxidermia", (req, res) => {
  res.render("nuevaTaxidermia", {
    useNav: true,
    titulo: "Registro de Taxidermia",
    usuario: req.session.usuario,
  });
});

app.post("/enviarTaxidermia", (req, res) => {
  const nuevaTaxidermia = req.body;
  const operacionExitosa = Controlador.nuevaTaxi(nuevaTaxidermia);
  if (operacionExitosa) {
    res.redirect("/listarTaxidermia");
  } else {
    res.send("Error al guardar los datos");
  }
});

app.get("/listarTaxidermia", (req, res) => {
  const taxidermias = Controlador.listarTaxidermia();
  const taxidermiasActivos = taxidermias.filter(taxidermia => taxidermia.BajaTax === false);

  res.render("listarTaxidermia", {
    useNav: true,
    titulo: "Taxidermias",
    taxidermia: taxidermiasActivos,
    usuario: req.session.usuario,
  });
});

app.post("/modificarTaxidermia", (req, res) => {
  const idTax = req.body.editar;
  res.redirect(`/editarTaxidermia/${idTax}`);
});

app.get("/editarTaxidermia/:idTax", (req, res) => {
  const idTax = req.params.idTax;
  const taxidermia = Controlador.TaxidermiaPorNro(idTax);
  if (taxidermia) {
    res.render("modificarTaxidermia", {
      useNav: true,
      titulo: "Editar taxidermia",
      taxidermia,
      usuario: req.session.usuario,
    });
  } else {
    res.send("No encontre taxidermia con ese id");
  }
});

app.post("/actualizarTaxidermia", (req, res) => {
  const taxidermiaActualizada = req.body;
  const operacionOk = Controlador.actualizarTaxidermia(taxidermiaActualizada);

  if (operacionOk) {
    res.redirect("listarTaxidermia");
  } else {
    res.send("Algo falló al actualizar taxidermia");
  }
});

app.post("/deleteTaxidermia", (req, res) => {
  const NroTax = req.body.NroTax;
  resultado = Controlador.TaxidermiaBaja(NroTax);

  if (resultado) {
    res.redirect("listarTaxidermia");
  } else {
    res.send("No se pudo eliminar");
  }
});

//--------- USUARIO RUTAS --------------
app.get("/registrar", (req, res) => {
  res.render("registro", {
    useNav: true,
    titulo: "Registro",
    usuario: req.session.usuario,
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al cerrar sesión:", err);
    }
    res.redirect("/");
  });
});

//--------- SERVER RUTAS --------------
app.use((req, res) => {
  res
    .status(404)
    .render("404", { useTailwind: true, titulo: "Página no encontrada" });
});

app.listen(port, () => {
  console.log(
    `Corriendo en \x1b[35m'http://localhost:${port}'\x1b[30m crtl + click izq para ir\x1b[0m`
  );
});