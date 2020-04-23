// Verifica se o usuario tem uma sessão ativa
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

async function user(req, res, next) {
  const authHeaders = req.headers.authorization;
  if (!authHeaders) {
    return res.status(400).json({ error: 'Token not provider' });
  }
  // o token por padrão é enviado assim "bearer b5yhffryjkggnhtt579jr"
  const [, token] = authHeaders.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
}

export default user;
