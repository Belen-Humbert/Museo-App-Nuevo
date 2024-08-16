// Importación de módulos necesarios
const express = require("express");
const path = require('path');
const exphbs = require('express-handlebars');
const Seguridad = require("./seguridad.js");
const Controlador = require('./controlador.js');
const session = require('express-session');
const { title } = require("process");

// Inicialización de la aplicación Express
const app = express();
const port = 3000;

// Configuración de express-session
app.use(session({
  secret: 'secreto_de_tito_session', // Contraseña super secreta de tito suarez
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Cambia a true si usas HTTPS
}));


// Configuración de express-handlebars como motor de plantillas
app.engine('hbs', exphbs.engine({
  extname: '.hbs', // Extensión de archivo para las plantillas
  defaultLayout: 'main', // Plantilla de diseño por defecto
  layoutsDir: path.join(__dirname, 'views/layouts') // Directorio de layouts
}));
app.set('view engine', 'hbs'); // Establecer Handlebars como motor de vistas
app.set('views', path.join(__dirname, 'views')); // Directorio de vistas


// Middleware para parsear JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para verificar la autenticación
function autenticarUsuario(req, res, next) {
  const token = req.session.token;
  if (token) {
    const usuario = Seguridad.verificarToken(token);
    if (usuario) {
      req.usuario = usuario;
      console.log(usuario);
      return next();
    }
  }
  res.redirect('/');
}

// ----- Definición de rutas -----
app.get('/', (req, res) => {
  res.render('index', { useTailwind: false, titulo: 'Login' });
});

app.post('/login', (req, res) => {
  console.log("browser --> server 'post/login'");
  console.log("server --> seguridad 'registrado(req.body)'");
  let resultado = Seguridad.registrado(req.body);
  if (resultado.autenticado) {
    console.log("server <-r- seguridad 'true'");
    req.session.token = resultado.token;
    res.redirect('/inicio');
    console.log("browser <-r- server 'inicio'");
  } else {
    console.log("server <-r- seguridad 'false'");
    console.log("browser <-r- server 'Error...!!!.html'");
    res.render('index', { 
      useTailwind: false, 
      titulo: 'Login',
      error: resultado.mensaje,
    });
    console.log(resultado.mensaje)
  }
});

app.get('/menu',autenticarUsuario, (req, res) => {
  const piezas = Controlador.listar();
  res.render('menu', { useTailwind: true, piezas, titulo: 'Menú' ,usuario: req.usuario});
});

app.get('/inicio',autenticarUsuario, (req, res) => {
  console.log(req.usuario)
  res.render('inicio', { useTailwind: false, titulo: 'Inicio', usuario: req.usuario});
});

app.get('/nuevo',autenticarUsuario, (req, res) => {
  console.log("llegó un get/nuevo");
  res.render('nuevo', { useTailwind: true, titulo: 'Nuevo Elemento' });
});

app.post('/agregar', (req, res) => {
  console.log("llegó post/agregar");
  console.log(req.body);
  const operacionExitosa = Controlador.nuevo(req.body);
  console.log('Operación exitosa:', operacionExitosa);

  if (operacionExitosa) {
    console.log('Redirigiendo a la ruta principal...');
    res.redirect('/menu');
  } else {
    console.log('Error al guardar los datos');
    res.send('Error al guardar los datos');
  }
});

app.get('/registrar', (req, res) => {
  console.log("llegó un get/registrar");
  res.render('registro', { useTailwind: false, titulo: 'Registro' });
});

app.post('/agregarUser',(req, res) => {
  const resultado = Controlador.nuevoUser(req.body);
  if (resultado.exito) {
    res.redirect('/login?mensaje=' + encodeURIComponent(resultado.mensaje));
  } else {
    res.render('registro', { 
      useTailwind: true, 
      titulo: 'Registro de Usuario',
      error: resultado.mensaje
    });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/');
    }
    res.redirect('/');
  });
});

app.post('/enviarNreg', (req, res) =>{ 
  const NroReg = req.body.editar; // en esta ruta se obtiene el nro de registro de la pieza que se quiere modificar y se 
  res.redirect(`/editarPieza/${NroReg}`);// redirige a otra ruta
});

app.get('/editarPieza/:NroReg', (req, res)=>{

  const numRe = req.params.NroReg;
  const piezas = Controlador.PiezaPorNro(numRe);
  res.render('modificar', { useTailwind: true, titulo: 'Modificar', piezas });


}); 


app.post('/actualizarPieza', (req, res)=>{

  const piezaAct = req.body;

  const operacionExitosa = Controlador.actualizarPieza(piezaAct);

  if (operacionExitosa) {

    console.log('en server todo bien redirigeindo a menu');
    res.redirect('/menu');

  }else{

    console.log('error mi rey')
  }
  

});

app.get('/prestamo', autenticarUsuario,(req, res) => {
  console.log("llegó un /nuevo prestamo");
  res.render('prestamo', { useTailwind: true, titulo: 'Nuevo prestamo' });
});

app.post('/registrarprestamo', (req, res) => {
  console.log("llegó post");
  console.log(req.body);

  const operacionExitosa = Controlador.guardarPrestamo(req.body);
  console.log('Operación exitosa:', operacionExitosa);
});


app.post('/deletePieza',(req, res) => {
  console.log("llegó post");
  console.log(req.body);
  const NroReg = req.body.NroReg;
  Controlador.PiezaBaja(NroReg);
  res.redirect('menu');
});

app.get('/prestamo',autenticarUsuario, (req, res) => {
  console.log("llegó un /nuevo prestamo");
  res.render('prestamo', { useTailwind: true, titulo: 'Nuevo prestamo' });
});

app.post('/registrarprestamo', (req, res) => {
  console.log("llegó post");
  console.log(req.body);

  const operacionExitosa = Controlador.guardarPrestamo(req.body);
  console.log('Operación exitosa:', operacionExitosa);

});

app.get('/nuevaTaxidermia', (req, res) => {
  res.render('nuevaTaxidermia', { useTailwind: true, titulo: 'Nueva Taxidermia' });
});

app.post('/enviarTaxidermia', (req, res) => {
  console.log(req.body);
  const nuevaTaxidermia = req.body;
  const operacionExitosa = Controlador.nuevaTaxi(nuevaTaxidermia);
  if(operacionExitosa){
    console.log('redirigiendo a inicio');
    res.redirect('/listarTaxidermia');
  } else {
    return false;
  }
});

app.get('/listarTaxidermia', (req,res) => {
const taxidermia = Controlador.listarTaxidermia();
res.render('listarTaxidermia', {useTailwind: true, titulo: 'Listar Taxidermia', taxidermia})
});

app.post('/modificarTaxidermia', (req,res) => {
 const idTax = req.body.editar;
 res.redirect(`/editarTaxidermia/${idTax}`);
});

app.get('/editarTaxidermia/:idTax', (req,res) => {
const idTax = req.params.idTax;
const taxidermia = Controlador.TaxidermiaPorNro(idTax);
res.render('modificarTaxidermia', {useTailwind: true, titulo: 'Modificar Pieza', taxidermia});
});

app.post('/actualizarTaxidermia', (req,res) => {
  const taxidermiaActualizada = req.body;
  const operacionOk = Controlador.actualizarTaxidermia(taxidermiaActualizada);

  if(operacionOk){
    console.log('Todo bien en server redirigiendo a listar');
    res.redirect('listarTaxidermia');
  }else{
    console.log('algo fallo');
    return false
  }

})

//baja logica
/* app.delete('/eliminar/:numeroRegistro', Controlador.eliminarPieza); */
app.use((req, res, next) => {
  res.status(404).render('404', { useTailwind: true, titulo: 'Página no encontrada' });
});


app.listen(port, () => {
  console.log(`Corriendo en \x1b[35m'http://localhost:${port}'\x1b[30m crtl + click izq para ir\x1b[0m`)
});




