import app from "../app";
import { createServer } from "http";
import { Server } from "node:http";
import { HttpError } from "http-errors";

const port: number = Number(process.env.PORT) || 3000;

const server: Server = createServer(app);
const debug: NodeRequire = require('debug')('server:server');

const onError = (error: HttpError) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

const onListening = () => {
  const addr = server.address();
  const bind: string = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr?.port;
  debug('Listening on ' + bind);
  console.log('Listening on ' + bind);
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

export default server;