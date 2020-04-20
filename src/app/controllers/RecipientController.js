import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const recipients = await Recipient.findAll();
    return res.json(recipients);
  }

  async store(req, res) {
    const {
      name,
      street,
      number,
      complement,
      state,
      city,
      // eslint-disable-next-line camelcase
      zip_code,
    } = await Recipient.create(req.body);
    return res.json({
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }
}
export default new RecipientController();
