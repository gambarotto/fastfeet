import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import File from '../app/models/File';
import Deliveryman from '../app/models/Deliveryman';
import Signature from '../app/models/Signature';
import Order from '../app/models/Order';
import DeliveryProblems from '../app/models/DeliveryProblems';

import databaseConfig from '../config/database';

const models = [
  User,
  Recipient,
  File,
  Deliveryman,
  Signature,
  Order,
  DeliveryProblems,
];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig); // Faz a conexao com as configurações do database.js

    // Passa a conexao p/ o init de cada modelo
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  }
}

export default new Database();
