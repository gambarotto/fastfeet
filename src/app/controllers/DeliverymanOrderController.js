import { Op } from 'sequelize';
import {
  startOfDay,
  endOfDay,
  isAfter,
  isBefore,
  setSeconds,
  setHours,
  setMinutes,
  format,
  parseISO,
} from 'date-fns';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';
import Signature from '../models/Signature';
// import pt from 'date-fns/locale/pt';

class DeliverymanOrderController {
  async index(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);
    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found' });
    }
    // Lista somente as entregas finalizadas
    if (req.query.deliveries === 'true') {
      const deliveries = await Order.findAll({
        where: {
          deliveryman_id: req.params.id,
          end_at: {
            [Op.not]: null,
          },
          canceled_at: null,
        },
        include: [
          {
            model: Signature,
            as: 'signature',
            attributes: ['id', 'url', 'path'],
          },
        ],
      });
      return res.json(deliveries);
    }

    const orders = await Order.findAll({
      where: {
        deliveryman_id: req.params.id,
        end_at: null,
        canceled_at: null,
      },
    });
    return res.json(orders);
  }

  async start(req, res) {
    const order = await Order.findByPk(req.body.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const startDay = startOfDay(new Date());
    const endDay = endOfDay(new Date());

    const ordersOftoDay = await Order.findAndCountAll({
      where: {
        deliveryman_id: req.params.id,
        start_at: {
          [Op.between]: [startDay, endDay],
        },
      },
    });

    // Verifica se o entregador já fez mais que 5 retiradas no dia
    if (ordersOftoDay.count > 5) {
      return res.status(400).json({
        error: 'It is not allowed to withdraw more than 5 orders per day',
      });
    }
    // Definindo o horário de funcionamento
    const workingHours = ['08:00', '18:00'];
    // Formatando a hora
    const hours = workingHours.map((time) => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(Number(Date.now()), hour), minute),
        0
      );
      return parseISO(format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"));
    });
    // Verificando se a retirada está dentro do horário permitido
    if (isAfter(new Date(), hours[1] || isBefore(new Date(), hours[0]))) {
      return res.status(400).json({
        error: 'Withdraw is allowed between 08:00 until 18:00 hours',
      });
    }

    order.start_at = req.body.start_at;
    // await order.save();

    return res.json(hours);
  }

  async end(req, res) {
    const order = await Order.findByPk(req.body.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (!order.start_at) {
      return res.status(400).json({ error: 'Order was not withdrawn yet' });
    }
    if (!(await Signature.findByPk(req.body.signature_id))) {
      return res.status(400).json({ error: 'Image not found' });
    }

    await order.update({
      end_at: new Date(),
      signature_id: req.body.signature_id,
    });

    return res.json(order);
  }
}

export default new DeliverymanOrderController();
