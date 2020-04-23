import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import SignatureController from './app/controllers/SignatureController';
import OrderController from './app/controllers/OrderController';
import DeliverymanOrderController from './app/controllers/DeliverymanOrderController';

import authMiddlewareUser from './app/middlewares/authUser';
import authMiddlewareDeliveryman from './app/middlewares/authDeliveryman';

const routes = new Router();
const uploadFiles = multer(multerConfig.filesConfig);
const uploadSignatures = multer(multerConfig.signaturesConfig);

routes.post('/sessions', SessionController.store);
routes.post('/sessions/deliveryman', SessionController.storeDeliveryman);

// routes.get('deliveryman/:id/deliveries', DeliverymanOrderController.index);
routes.get(
  '/deliveryman/:id/deliveries',
  authMiddlewareDeliveryman,
  DeliverymanOrderController.index
);
routes.put(
  '/deliveryman/:id/order/start',
  authMiddlewareDeliveryman,
  DeliverymanOrderController.start
);
routes.put(
  '/deliveryman/:id/order/end',
  authMiddlewareDeliveryman,
  DeliverymanOrderController.end
);

routes.use(authMiddlewareUser);
routes.post('/files', uploadFiles.single('file'), FileController.store);
routes.post(
  '/signatures',
  uploadSignatures.single('signature'),
  SignatureController.store
);

routes.post('/users', UserController.store);
routes.get('/users', UserController.index);

routes.post('/recipients', RecipientController.store);
routes.get('/recipients', RecipientController.index);

routes.post('/deliverymans', DeliverymanController.store);
routes.get('/deliverymans', DeliverymanController.index);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

export default routes;
