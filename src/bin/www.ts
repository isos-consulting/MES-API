import app from "../app";
import { createServer } from "http";
import { Server } from "node:http";
import { HttpError } from "http-errors";
import config from "../configs/config";

const port: number = Number(config.port) || 3000;

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
	console.log(`
8888888 .d8888b.   .d88888b.        .d8888b.  8888888888 8888888b.  888     888 8888888888 8888888b.  
  888  d88P  Y88b d88P" "Y88b      d88P  Y88b 888        888   Y88b 888     888 888        888   Y88b 
  888  Y88b.      888     888      Y88b.      888        888    888 888     888 888        888    888 
  888   "Y888b.   888     888       "Y888b.   8888888    888   d88P Y88b   d88P 8888888    888   d88P 
  888      "Y88b. 888     888          "Y88b. 888        8888888P"   Y88b d88P  888        8888888P"  
  888        "888 888     888            "888 888        888 T88b     Y88o88P   888        888 T88b   
  888  Y88b  d88P Y88b. .d88P      Y88b  d88P 888        888  T88b     Y888P    888        888  T88b  
8888888 "Y8888P"   "Y88888P"        "Y8888P"  8888888888 888   T88b     Y8P     8888888888 888   T88b 
	`)
  console.log('Listening on ' + bind);
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

export default server;