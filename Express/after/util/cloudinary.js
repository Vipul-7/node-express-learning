// import {v2 as cloudinary} from 'cloudinary';
const cloudinary = require("cloudinary").v2;
          
cloudinary.config({ 
  cloud_name: 'dkyetl66u', 
  api_key: '481942493734226', 
  api_secret: '7xHR9KMwPyZeJfa0sbawgDwLA0Q' 
});

module.exports = cloudinary;