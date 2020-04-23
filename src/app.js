import express from 'express';
import { resolve } from 'path';
import routes from './routes';

// importa as configs do database pro app
import './database';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(resolve(__dirname, '..', 'temp', 'uploads', 'avatars'))
    );
    this.server.use(
      '/signatures',
      express.static(resolve(__dirname, '..', 'temp', 'uploads', 'signatures'))
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
