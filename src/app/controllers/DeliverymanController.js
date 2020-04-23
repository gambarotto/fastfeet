import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async index(req, res) {
    const deliverymans = await Deliveryman.findAll();

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
    const deliveryman = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }
    // eslint-disable-next-line camelcase
    const { name, email, newEmail, avatar_id } = req.body;

    // verifica se o novo email passado já existe na base de dados
    if (newEmail && deliveryman.email !== newEmail) {
      const deliverymanExists = await Deliveryman.findOne({
        where: { email: newEmail },
      });
      if (deliverymanExists) {
        return res.status(401).json({ error: 'This email already exists' });
      }
    }

    const userUpdated = await deliveryman.update({
      name,
      email: newEmail || email,
      avatar_id,
    });

    return res.json(userUpdated);
  }

  async delete(req, res) {
    const deliveryman = await Deliveryman.destroy({
      where: { email: req.body.email },
    });

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found' });
    }

    return res.json({ delete: 'ok' });
  }
}
export default new DeliverymanController();
