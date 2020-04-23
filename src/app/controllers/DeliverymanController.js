import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const deliverymans = await Deliveryman.findAll({
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'url', 'path'],
        },
      ],
    });

    return res.json(deliverymans);
  }

  async store(req, res) {
    const deliverymanExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });
    if (deliverymanExists) {
      return res.status(401).json({ error: 'This email already exists' });
    }

    const deliveryman = await Deliveryman.create(req.body);

    return res.json(deliveryman);
  }

  async update(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }
    // eslint-disable-next-line camelcase
    const { name, email, avatar_id } = req.body;

    // verifica se o novo email passado já existe na base de dados
    if (email && deliveryman.email !== email) {
      const deliverymanExists = await Deliveryman.findOne({
        where: { email },
      });
      if (deliverymanExists) {
        return res.status(401).json({ error: 'This email already exists' });
      }
    }

    const userUpdated = await deliveryman.update({
      name,
      email: email || deliveryman.email,
      avatar_id,
    });

    return res.json(userUpdated);
  }

  async delete(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found' });
    }

    await deliveryman.destroy();
    return res.json({ delete: 'ok' });
  }
}
export default new DeliverymanController();
