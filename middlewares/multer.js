const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "upload",
    format: async (req, file) => "png",
    public_id: (req, file) => "computed-filename-using-request",
  },
});

const upload = multer({ storage });

module.exports = upload;
