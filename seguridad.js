const Modelo = require('./modelo.js');

function registrado(body) {
  let usuarios = Modelo.getUsuarios();
  console.log("seguridad --> modelo.getUsuarios()");
  if (body.pass !== '') {
    let usuario = usuarios.find(x => body.user === x.usuario && body.pass === x.pass);
    if (usuario) {
      console.log("seguridad --> server 'usuario encontrado'");
      return { 
        autenticado: true, 
        usuario: { 
          usuario: usuario.usuario, 
          nombre: usuario.nombre 
        } 
      };
    }
  }
  console.log("seguridad --> server 'usuario no encontrado'");
  return { autenticado: false, mensaje: "Usuario o contraseña incorrectos" };
}

module.exports = { registrado };