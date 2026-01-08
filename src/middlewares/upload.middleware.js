import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { config } from 'dotenv';

config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Allowed MIME types
const ALLOWED_MIMETYPES = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'application/pdf'
];

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Generate unique folder/filename structure
    const isPdf = file.mimetype === 'application/pdf';

    return {
      folder: 'hackademy/reports',
      resource_type: 'auto', // Cloudinary will decide (image or raw/pdf)
      public_id: `${Date.now()}-${file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_')}`,
      format: isPdf ? 'pdf' : undefined, // Explicitly set pdf format if it's a pdf
    };
  },
});

// File filter for validation
const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
    return cb(new Error(`Invalid file type. Allowed types: PNG, JPG, JPEG, PDF`), false);
  }
  cb(null, true);
};

// Create multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5 // Max 5 files per upload
  }
});

// Error handler middleware for multer errors
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        message: 'Too many files. Maximum is 5 files per upload.'
      });
    }
    return res.status(400).json({ message: err.message });
  }

  if (err) {
    return res.status(400).json({ message: err.message });
  }

  next();
};

export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE,
  ALLOWED_MIMETYPES,
  MAX_FILES: 5
};
