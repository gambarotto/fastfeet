// Verifica se o usuario tem uma sessão ativa
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

async function deliveryman(req, res, next) {
  // Recuperando o token
  const authHeaders = req.headers.authorization;
  if (!authHeaders) {
    return res.status(400).json({ error: 'Token not provider' });
  }
  // o token por padrão é enviado assim "bearer b5yhffryjkggnhtt579jr"
  const [, token] = authHeaders.split(' ');
  console.log('aq');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.deliverymanId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
}

export default deliveryman;
