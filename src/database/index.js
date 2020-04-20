import Sequelize from 'sequelize';
import User from '../app/models/User';
import Recipient from '../app/models/Recipient';

import databaseConfig from '../config/database';

const models = [User, Recipient];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig); // Faz a conexao com as configurações do database.js
    models.map((model) => model.init(this.connection)); // Passa a conexao p/ o init de cada modelo
  }
}

export default new Database();
