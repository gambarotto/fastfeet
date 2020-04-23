import multer from 'multer';
import { resolve, extname } from 'path';
import crypto from 'crypto';

export default {
  filesConfig: {
    storage: multer.diskStorage({
      destination: resolve(__dirname, '..', '..', 'temp', 'uploads', 'avatars'),
      filename: (req, file, cb) => {
        crypto.randomBytes(16, (err, res) => {
          if (err) return cb(err);

          return cb(null, res.toString('hex') + extname(file.originalname));
        });
      },
    }),
  },
  signaturesConfig: {
    storage: multer.diskStorage({
      destination: resolve(
        __dirname,
        '..',
        '..',
        'temp',
        'uploads',
        'signatures'
      ),
      filename: (req, file, cb) => {
        crypto.randomBytes(16, (err, res) => {
          if (err) return cb(err);

          return cb(null, res.toString('hex') + extname(file.originalname));
        });
      },
    }),
  },
};
