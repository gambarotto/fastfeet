// import { format, parseISO } from 'date-fns';
// import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class NewOrderMail {
  get key() {
    return 'NewOrderEmail';
  }

  async handle({ data }) {
    const { nOrder, deliveryman } = data;
    const {
      street,
      number,
      complement,
      state,
      city,
      // eslint-disable-next-line camelcase
      zip_code,
    } = nOrder.recipient;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'New Order',
      template: 'newOrder',
      context: {
        deliveryman: deliveryman.name,
        product: nOrder.product,
        address: {
          street,
          number,
          complement,
          state,
          city,
          zip_code,
        },
        // date: format(
        //   parseISO(nOrder.created_at),
        //   "'dia 'dd 'de' MMMM', às 'H:mm'h'",
        //   { locale: pt }
        // ),
      },
    });
  }
}

export default new NewOrderMail();
