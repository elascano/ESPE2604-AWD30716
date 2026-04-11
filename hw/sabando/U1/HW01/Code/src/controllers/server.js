const jsonServer = require('json-server');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// Aquí importas o unes tus archivos
const db = {
  libros: require('../../data/libros.json'),
  usuarios: require('../../data/usuarios.json'),
  transacciones: require('../../data/transacciones.json')
};

const router = jsonServer.router(db);

server.use(middlewares);
server.use(router);

server.listen(3000, () => {
  console.log('JSON Server está corriendo en http://localhost:3000');
});