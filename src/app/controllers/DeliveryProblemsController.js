import { Op } from 'sequelize';

import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';
import DeliveryProblems from '../models/DeliveryProblems';
import Recipient from '../models/Recipient';
import Queue from '../../lib/Queue';
import CancellationDeliveryMail from '../jobs/CancellationDeliveryMail';

class DeliveryProblemsController {
  async index(req, res) {
    const problems = await DeliveryProblems.findAll();
    if (!problems) {
      return res.status(404).json({ error: 'Problems not found' });
    }
    return res.json(problems);
  }

  async indexOne(req, res) {
    const problem = await DeliveryProblems.findAll({
      where: {
        delivery_id: req.query.delivery,
      },
    });
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    return res.json(problem);
  }

  async store(req, res) {
    /**
     * CORRIGIR TABELA DELIVERY_PROBLEM
     */
    const deliveryman = await Deliveryman.findByPk(req.params.id);
    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found' });
    }
    const { idOrder, description } = req.body;

    const order = await Order.findByPk(idOrder, {
      where: {
        canceled_at: {
          [Op.is]: null,
        },
      },
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found, or canceleded' });
    }

    const deliveryProblem = await DeliveryProblems.create({
      delivery_id: idOrder,
      description,
    });

    return res.json(deliveryProblem);
  }

  async upate(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.idDeliveryman);
    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found' });
    }

    const deliveryProblem = await DeliveryProblems.findByPk(
      req.params.idDeliveryProblem
    );
    if (!deliveryProblem) {
      return res.status(404).json({ error: 'Delivery Problem not found' });
    }

    deliveryProblem.description = req.body.description;
    await deliveryProblem.save();
    return res.json(deliveryProblem);
  }

  async delete(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.idDeliveryman);
    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found' });
    }

    const deliveryProblem = await DeliveryProblems.findByPk(
      req.params.idDeliveryProblem,
      {
        include: [
          {
            model: Order,
            as: 'delivery',
            attributes: ['product'],
            include: [
              {
                model: Recipient,
                as: 'recipient',
              },
            ],
          },
        ],
      }
    );
    if (!deliveryProblem) {
      return res.status(404).json({ error: 'Delivery Problem not found' });
    }
    const deleted = await deliveryProblem.destroy();

    if (!deleted) {
      return res.status(404).json({ error: 'Erro ao excluir' });
    }

    await Queue.add(CancellationDeliveryMail.key, {
      deliveryProblem,
      deliveryman,
    });

    return res.json({});
  }
}

export default new DeliveryProblemsController();
