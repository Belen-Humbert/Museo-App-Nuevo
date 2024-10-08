const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const Seguridad = require("./seguridad.js");
const Controlador = require("./controlador.js");
const session = require("express-session");

// Inicialización de la aplicación Express
const app = express();
const port = 3000;

// Configuración de express-session
app.use(
  session({
    secret: "secreto_de_tito_session",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Cambia a true si usas HTTPS
      maxAge: 2 * 60 * 60 * 1000
    }
  })
);

// Configuración de express-handlebars como motor de plantillas
app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs", // Extensión de archivo para las plantillas
    defaultLayout: "main", // Plantilla de diseño por defecto
    layoutsDir: path.join(__dirname, "views/layouts"), // Directorio de layouts
  })
);
app.set("view engine", "hbs"); // Establecer Handlebars como motor de vistas
app.set("views", path.join(__dirname, "views")); // Directorio de vistas


// Middleware para parsear JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, "public")));

// Middleware para verificar la autenticación
function autenticarUsuario(req, res, next) {
  console.log("server --> autenticarUsuario 'verificar sesión'");
  if (req.session.usuario) {
    console.log("autenticarUsuario --> server 'sesión válida'");
    return next();
  }

  res.redirect("/");
}

//--------- DEFINICIÓN DE RUTAS --------------
app.get("/", (req, res) => {
  res.render("index", { useTailwind: true, useCSS: true, titulo: "Login", useNav: false });
});

app.post("/login", (req, res) => {
  console.log("browser --> server 'POST /login'");
  let resultado = Seguridad.registrado(req.body);
  console.log("server --> seguridad.registrado");
  if (resultado.autenticado) {
    console.log("seguridad --> server 'autenticado: true'");
    req.session.usuario = resultado.usuario;
    console.log("server --> browser 'redirect: /inicio'");
    res.redirect("/inicio");
  } else {
    console.log("seguridad --> server 'autenticado: false'");
    console.log("server --> browser 'render: index con error'");
    res.render("index", {
      useTailwind: true,
      titulo: "Login",
      error: resultado.mensaje,
      useNav: true
    });
  }
});

app.get("/inicio", autenticarUsuario, (req, res) => {
  console.log("browser --> server 'GET /inicio'");
  console.log("server --> browser 'render: inicio'");
  res.render("inicio", {
    useTailwind: true,
    useCSS: true,
    useNav: true,
    titulo: "Inicio",
    usuario: req.session.usuario,
  });
});


//--------- PIEZA RUTAS --------------
app.get("/menu", autenticarUsuario, (req, res) => {
  console.log("browser --> server 'GET /menu'");
  const piezas = Controlador.listar();
  console.log("server --> controlador.listar");
  console.log("server --> browser 'render: menu'");
  res.render("menu", {
    useTailwind: true,
    useCSS: false,
    piezas,
    titulo: "Menú",
    usuario: req.session.usuario,
    useNav: true
  });
});

app.get("/nuevo", autenticarUsuario, (req, res) => {
  console.log("browser --> server 'GET /nuevo'");
  console.log("server --> browser 'render: nuevo'");
  res.render("nuevo", {
    useTailwind: true,
    useCSS: false,
    useNav: true,
    titulo: "Nuevo Elemento",
  });
});

app.post("/agregar", (req, res) => {
  console.log("browser --> server 'POST /agregar'");
  const operacionExitosa = Controlador.nuevo(req.body);
  console.log("server --> controlador 'nuevo(req.body)'");
  if (operacionExitosa) {
    res.redirect("/menu");
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
  res.render("modificar", {
    useTailwind: true,
    useCSS: false,
    useNav: true,
    titulo: "Modificar",
    piezas,
  });
});

app.post("/actualizarPieza", (req, res) => {
  console.log("browser --> server 'POST /actualizarPieza'");
  const piezaAct = req.body;
  console.log("server --> controlador.actualizarPieza");
  const operacionExitosa = Controlador.actualizarPieza(piezaAct);
  console.log("controlador --> server 'resultado de la actualización'");

  if (operacionExitosa) {
    console.log("server --> browser 'redirect: /menu'");
    res.redirect("/menu");
  } else {
    console.log("server --> browser 'error al actualizar'");
    res.send("Error al actualizar la pieza");
  }
});

app.post("/deletePieza", (req, res) => {
  console.log("browser --> server 'POST /deletePieza'");
  const NroReg = req.body.NroReg;
  Controlador.PiezaBaja(NroReg);
  console.log("server --> controlador 'PiezaBaja'");
  res.redirect("menu");
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
    useTailwind: true,
    useCSS: false,
    useNav: true,
    titulo: "Nuevo prestamo"
  });
});

app.get("/listarPrestamo", (req, res) => {
  const prestamo = Controlador.obtenerPrestamo();
  res.render("listarPrestamo", {
    useTailwind: true,
    useCSS: false,
    useNav: true,
    titulo: "Listar prestamo",
    prestamo,
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
    useTailwind: true,
    useCSS: false,
    useNav: true,
    titulo: "Modificar prestamo",
    prestamo,
  });
});

app.post("/actualizarPrestamo", (req, res) => {
  const PrestamoActualizado = req.body;
  const operacionOk = Controlador.actualizarPrestamo(PrestamoActualizado);

  if (operacionOk) {
    res.redirect("listarPrestamo");
  } else {
    return false;
  }
});

app.post("/deletePrestamo", (req, res) => {
  const NroReg = req.body.NroReg;
  Controlador.PrestamoBaja(NroReg);
  res.redirect("listarPrestamo");
});

//--------- TAXIDERMIA RUTAS --------------
app.get("/nuevaTaxidermia", (req, res) => {
  res.render("nuevaTaxidermia", {
    useTailwind: true,
    useCSS: false,
    useNav: true,
    titulo: "Nueva Taxidermia",
  });
});

app.post("/enviarTaxidermia", (req, res) => {
  const nuevaTaxidermia = req.body;
  const operacionExitosa = Controlador.nuevaTaxi(nuevaTaxidermia);
  if (operacionExitosa) {
    res.redirect("/listarTaxidermia");
  } else {
    return false;
  }
});

app.get("/listarTaxidermia", (req, res) => {
  const taxidermia = Controlador.listarTaxidermia();
  res.render("listarTaxidermia", {
    useTailwind: true,
    useCSS: false,
    useNav: true,
    titulo: "Listar Taxidermia",
    taxidermia,
  });
});

app.post("/modificarTaxidermia", (req, res) => {
  const idTax = req.body.editar;
  res.redirect(`/editarTaxidermia/${idTax}`);
});

app.get("/editarTaxidermia/:idTax", (req, res) => {
  const idTax = req.params.idTax;
  const taxidermia = Controlador.TaxidermiaPorNro(idTax);
  res.render("modificarTaxidermia", {
    useTailwind: true,
    useCSS: false,
    useNav: true,
    titulo: "Modificar Pieza",
    taxidermia,
  });
});

app.post("/actualizarTaxidermia", (req, res) => {
  const taxidermiaActualizada = req.body;
  const operacionOk = Controlador.actualizarTaxidermia(taxidermiaActualizada);

  if (operacionOk) {
    res.redirect("listarTaxidermia");
  } else {
    return false;
  }
});

app.post("/deleteTaxidermia", (req, res) => {
  const NroTax = req.body.NroTax;
  Controlador.TaxidermiaBaja(NroTax);
  res.redirect("listarTaxidermia");
});

//--------- USUARIO RUTAS --------------
app.get("/registrar", (req, res) => {
  res.render("registro", {
    useTailwind: true,
    useCSS: false,
    useNav: true,
    titulo: "Registro",
  });
});

app.post("/agregarUser", (req, res) => {
  const resultado = Controlador.nuevoUser(req.body);
  if (resultado.exito) {
    res.redirect("/login?mensaje=" + encodeURIComponent(resultado.mensaje));
  } else {
    res.render("registro", {
      useTailwind: true,
      useCSS: false,
      useNav: true,
      titulo: "Registro de Usuario",
      error: resultado.mensaje,
    });
  }
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
app.use((req, res, next) => {
  res
    .status(404)
    .render("404", { useTailwind: true, titulo: "Página no encontrada" });
});

app.listen(port, () => {
  console.log(
    `Corriendo en \x1b[35m'http://localhost:${port}'\x1b[30m crtl + click izq para ir\x1b[0m`
  );
});