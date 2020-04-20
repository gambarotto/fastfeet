import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async index(req, res) {
    const users = await User.findAll();

    return res.json(users);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });
    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const { id, name, email, provider } = await User.create(req.body);
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  // async update(req, res) {
  //   const userExists = await User.findOne({ where: { email: req.body.email } });
  //   if (!userExists) {
  //     return res.status(400).json({ error: 'User does not exists' });
  //   }
  //   const { email, oldPassword } = req.body;

  //   if (oldPassword) {
  //   }
  // }
}

export default new UserController();
