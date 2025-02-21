const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowed_formats: async (req, file) => ["png","jpg","jpeg"]
      
    },
  });

  cloudinary.config({
    cloud_name:process.env.CLOUDNAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET

  })

  module.exports ={storage,cloudinary};