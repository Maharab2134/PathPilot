import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Resolve upload directory consistently with the app's static serving logic.
const uploadPathEnv = process.env.UPLOAD_PATH || './uploads/profile';
const uploadDir = path.isAbsolute(uploadPathEnv)
  ? uploadPathEnv
  : path.join(process.cwd(), uploadPathEnv);

// Ensure the upload directory exists.
try {
  fs.mkdirSync(uploadDir, { recursive: true });
} catch (err) {
  // If directory creation fails, multer will surface errors later when writing files.
  console.warn(
    'Could not create upload directory:',
    uploadDir,
    (err as any).message
  );
}

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, uploadDir);
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
  },
  fileFilter: fileFilter,
});
