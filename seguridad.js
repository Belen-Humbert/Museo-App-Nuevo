const Modelo = require('./modelo.js');

function registrado(body) {
  console.log("seguridad --> modelo 'getUsuarios()'");
  let usuarios = Modelo.getUsuarios();
  console.log("seguridad <-r- modelo '[{Usuario}]'");
  if (body.pass !== '') {
    let usuario = usuarios.find(x => body.user === x.usuario && body.pass === x.pass);
    if (usuario) {
      return { 
        autenticado: true, 
        usuario: { 
          usuario: usuario.usuario, 
          nombre: usuario.nombre 
        } 
      };
    }
  }
  return { autenticado: false, mensaje: "Usuario o contraseña incorrectos" };
}

module.exports = { registrado };