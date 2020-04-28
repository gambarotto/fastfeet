// import { format, parseISO } from 'date-fns';
// import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationDeliveryMail {
  get key() {
    return 'CancellationDeliveryMail';
  }

  async handle({ data }) {
    const { deliveryProblem, deliveryman } = data;
    const {
      id,
      street,
      number,
      complement,
      state,
      city,
      // eslint-disable-next-line camelcase
      zip_code,
    } = deliveryProblem.delivery.recipient;
    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Entrega Cancelada',
      template: 'cancellationDelivery',
      context: {
        deliveryman: deliveryman.name,
        problem: {
          id,
          description: deliveryProblem.description,
        },
        order: {
          id: deliveryProblem.delivery.id,
          product: deliveryProblem.delivery.product,
          address: {
            street,
            number,
            complement,
            state,
            city,
            zip_code,
          },
        },
      },
    });
  }
}

export default new CancellationDeliveryMail();
