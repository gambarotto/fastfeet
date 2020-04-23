import jwt from 'jsonwebtoken';

import User from '../models/User';
import Deliveryman from '../models/Deliveryman';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!user.checkPassword(password)) {
      return res.status(400).json({ error: 'Password invalid' });
    }
    const { id, name } = user;
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }

  async storeDeliveryman(req, res) {
    const deliveryman = await Deliveryman.findOne({
      where: { email: req.body.email },
    });
    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found' });
    }

    return res.json({
      user: {
        id: deliveryman.id,
        name: deliveryman.name,
        email: req.body.email,
      },
      token: jwt.sign({ id: deliveryman.id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}
export default new SessionController();
