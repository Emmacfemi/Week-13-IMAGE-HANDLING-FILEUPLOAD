const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'app_uploads', // Cloudinary folder name
    allowed_formats: ['jpeg', 'png', 'jpg', 'webp'],
    transformation: [{ width: 1200, crop: 'limit' }] // Optional auto-resize
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 } // 3MB limit
});

module.exports = upload;