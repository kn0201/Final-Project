import { randomUUID } from 'crypto';
import multer from 'multer';
import { env } from './env';

export let storage = multer.diskStorage({
  destination: env.UPLOAD_DIR,
  filename(req, file, callback) {
    let ext = file.mimetype.match(/^image\/([\w-]+)/)?.[1] || 'bin';
    let filename = randomUUID() + '.' + ext;
    callback(null, filename);
  },
});
