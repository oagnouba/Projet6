/************* Création du serveur ****************/
const http = require('http');//importer le package http de node
const app = require('./app');//appel l'application app

const normalizePort = val => {//renvoie un port valide qu'il soit d'un numéro ou d'une chaîne
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port>= 0){
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => {//recherche les différentes erreurs et les gère de manière approppriée puis enrégistre sur le serveur
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe' + address : 'port' + port;
  switch (error.code) {
    case 'EACCES':
      console.log(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
/********* Fin création du serveurs **********/

