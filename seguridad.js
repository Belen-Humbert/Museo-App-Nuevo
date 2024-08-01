const Modelo = require('./modelo.js');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secreto_de_tito_jwt';

function generarToken(usuario) {
  return jwt.sign({ usuario: usuario.usuario, nombre: usuario.nombre }, JWT_SECRET, { expiresIn: '2h' });
}

function verificarToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

function registrado(body) {
  console.log("seguridad --> modelo 'getUsuarios()'");
  let usuarios = Modelo.getUsuarios();
  console.log("seguridad <-r- modelo '[{Usuario}]'");
  if (body.pass !== '') {
    let usuario = usuarios.find(x => body.user === x.usuario && body.pass === x.pass);
    if (usuario) {
      const token = generarToken(usuario);
      console.log(token, usuario);
      return { autenticado: true, token, usuario };
    }
  }
  return { autenticado: false, mensaje: "Usuario o contraseña incorrectos"};
}

module.exports = { registrado, verificarToken };