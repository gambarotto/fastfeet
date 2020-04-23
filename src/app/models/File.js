import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3333/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }

  // static associate(models) {
  //   this.hasOne(models.Deliveryman, {
  //     foreignKey: 'deliveryman_id',
  //     as: 'deliveryman',
  //   });
  // }
}

export default File;
